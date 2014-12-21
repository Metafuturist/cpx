/***********************
 * CPX TORRENT TRACKER *
 ***********************/
 
// Part of the CPX Project
// Distributed under the MIT License

#include <arpa/inet.h>  // inet_aton
#include <netinet/in.h> // sockaddr_in
#include <stdio.h>      // printf() and so on
#include <unistd.h>     // close()
#include <string.h>     // strlen()
#include <signal.h>     // Signal handling
#include <sys/socket.h> // socket()
#include <sys/types.h>  // Sometimes needed when using sockets
#include "colors.h"     // colored output
#include <stdlib.h>     // malloc()

// Some stuff to use sockets
typedef struct sockaddr_in SOCKADDR_IN;
typedef struct sockaddr SOCKADDR;
typedef struct in_addr IN_ADDR;

//The indexes of the array we'll use to store the request settings
enum{
	REQUEST_UP,      // Uploaded amount since last announce
	REQUEST_DOWN,    // Downloaded amount since last announce
	REQUEST_PORT,    // Port the client can be contacted at
	REQUEST_COMPACT, // Whether the client accepts compact lists or not
	REQUEST_LEFT,    // How many bytes he client has to download to complete the torrent, used to create a peer list with percentages
	REQUEST_HASH,    // Hash of the torrent
	
	// These values don't need to be checked by the loop (either not compulsory, either already checked), that's why they're at the end
	
	REQUEST_PASSKEY, // The passkey the user uses
	REQUEST_CLIENT,  // The client used. This is the User-Agent data
	REQUEST_EVENT,   // Sometimes set to indicate a special event to the tracker.
	// We'll only take into account the stopped value, which indicates a graceful stop.
	REQUEST_SIZE     // The length of the array
};

int string_until(char *string, char delimiter){ // Reads the string until it reaches <delimiter>, then returns the number of bytes read
	int bytes_read = 0;
	while(string[bytes_read] != delimiter && string[bytes_read] != 0) // Get the next byte until it's the correct one, but don't go too far!
		bytes_read++;
	
	// Just put a simple end of string character instead of the delimiter
	string[bytes_read] = 0;
	return bytes_read;
}

int stop = 0; //When the program catches a Ctrl+C event, the status of this variable will change and it will begin a graceful stop
void sig_stop(int sig){ // Function called when Ctrl+C event fired
	stop = 1; // Change the value of stop, so that the program stops on next request
}

// Here begins the program
int main(int argc, char* argv[]){
	// First of all, say hello. It's important
	printf(COLOR_BLUE "\n"
	"***************\n"
	"* CPX TRACKER *\n"
	"***************\n" "\n"COLOR_RESET); // If someone wants to add some colors, why not ^^
	
	/**************************
	 * 0 - Handle Ctrl+C case *
	 **************************/
	if(signal(SIGINT, sig_stop) == SIG_ERR)
		perror(COLOR_YELLOW "Could not bind Ctrl+C event. Won't web able to make a clean stop" COLOR_RESET);
	// But if we can't that's fine, just emit a warning with perror()

	/******************************
	 * 1 - Open and bind a socket * 
	 ******************************/
	// Create a socket
	int sock = socket(AF_INET, SOCK_STREAM, 0);
	if(sock < 0){ // Something went wrong when trying to create the socket
		perror(COLOR_RED "Unable to create the socket" COLOR_RESET);
		return -1;
	}
	
	// Bind it to the correct port - TODO : Get the port from the command prompt (as an argument)
	SOCKADDR_IN inaddr = { 0 };
	inaddr.sin_addr.s_addr = htonl(INADDR_ANY); // You can contact me on any adress
	inaddr.sin_port = htons(8080);
	inaddr.sin_family = AF_INET;
	if(bind(sock, (SOCKADDR *) &inaddr, sizeof inaddr) < 0){
		perror(COLOR_RED "Unable to bind the socket" COLOR_RESET);
		return -1;
	}
	
	// Listen to requests
	if(listen(sock, 5) < 0){ // We set a maximum of 5 maximum queued requests - perhaps more ?
		perror(COLOR_RED "Could not listen to requests" COLOR_RESET);
		return -1;
	}
	
	/*************************
	 * 2 - Initialise memory * 
	 *************************/
	
	// a - The request string
	char *request=malloc(512); // Prepare the Buffer for the request data
	
	// b - Pointers to the interesting values
	char *request_params[REQUEST_SIZE];
	
	// c - Data related to the processing of the request
	char *request_char = request; // Pointer to the processed adress
	int length; //The length of the item we're processing
	int param_location; // Used when processing parameters, to know the array index corresponding to the parameter name
	char *param_end; // Used when processing parameters, to know the end of the string related to them
	char *request_end; // To indicate where we should not go after
	
	// d - Socket stuff
	int response_socket; // The socket we will write our response on
	SOCKADDR_IN client_data = { 0 }; // We can get some data about the way the client contacted us with this, such as its IP
	socklen_t client_data_size = (socklen_t) sizeof client_data; // The size of the client data. Not really needed, but the accept() method wants it
	socklen_t *_client_data_size = &client_data_size; // Just creating the pointer, so that we don't have to do it for every request
	
	/************************
	 * 3 - Process Requests *
	 ************************/
	
	while(stop == 0){ // While we're not asked to stop
		/*****************************
		 * Get ready for the request *
		 *****************************/
		
		// Reset request buffers
		memset(request, 0, 512);
		memset(request_params, 0, REQUEST_SIZE);
		
		// Come back to the beginning of the request
		request_char = request;
		
		/**********************
		 * Wait for a request *
		 **********************/
		
		response_socket = accept(sock, (SOCKADDR *)&client_data, _client_data_size);
		request_end = request_char + recv(response_socket, request, 512, 0) + 1;
		
		if(request_end == request_char + 1) // If we got 0 bytes, this is not a correct request
			goto badreq; // Goto is definitively the best way to do this, as we just want to skip other processing, and if() structure would be horrible
		
		request[511]=0; //Make sure the last byte is 0 (which is the 511st, as numbering begins at 0), just in case
		
		/***************************
		 * Begin of the processing *
		 ***************************/
		// Requests are made in the HTTP style
		
		/******************
		 * Request Method *
		 ******************/
		// Make sure the method is a GET
		length = string_until(request_char, ' ');
		if(length == 0) // The request begins with a space - Really ?!
			goto badreq;
		
		if(strcmp("GET", request_char) != 0) // I only reply to GET requests
			goto badreq;

		request_char += length + 2; //Skip the delimiter (+1) and the first slash (+1) --> +2
		
		/***********
		 * Passkey *
		 ***********/
		// We're at the passkey's location
		request_params[REQUEST_PASSKEY]=request_char;
		// Put a delimiter at the next slash
		length = string_until(request_char,'/');
		
		if(length == 0) // If there is no passkey
			goto badreq;
		
		request_char += length + 1; // Go ahead!
		
		/*********
		 * Query *
		 *********/
		// Make sure the client wants an announce
		length = string_until(request_char, '?'); // "?" is the delimiter between the name of the page and the parameters
		
		if(length == 0) // No page name
			goto badreq;
		
		// Actually, we can only handle announce, so let's check it's what we're asked
		if(strcmp(request_char, "announce") != 0){
			send(response_socket, "d14:failure reason14:Unknown methode", 36, 0);
			goto nextreq;
		}
		
		request_char += length + 1; // Go ahead
		
		/**********************
		 * Request parameters *
		 **********************/
		// Parameters end with a space. Let's see where we have to stop
		length = string_until(request_char, ' ');
		
		if(length == 0) // No parameters
			goto badreq;
		
		param_end = request_char + length; // This is a pointer to the space, which we must not go after!
		while(param_end > request_char) // If we've passed the space, get out!
		{
			length = string_until(request_char, '='); // The equal separates the name of the parameter and its value
			if(length == 0) // No more parameters - Normally not triggered, but just in case
				break;
			
			//request_char now contains the name of the parameter
			param_location=-1;
			// Determine where we should put the data of the parameter
			if(strcmp(request_char, "uploaded") == 0)
				param_location=REQUEST_UP;
			else if(strcmp(request_char, "downloaded") == 0)
				param_location=REQUEST_DOWN;
			else if(strcmp(request_char, "port") == 0)
				param_location=REQUEST_PORT;
			else if(strcmp(request_char, "left") == 0)
				param_location=REQUEST_LEFT;
			else if(strcmp(request_char, "compact") == 0)
				param_location=REQUEST_COMPACT;
			else if(strcmp(request_char, "event") == 0)
				param_location=REQUEST_EVENT;
			else if(strcmp(request_char, "info_hash") == 0)
				param_location=REQUEST_HASH;
			
			// Let's see the value of the parameter
			request_char += length + 1;

			length = string_until(request_char, '&'); // & indicates a new parameter - or the function will stop at 0, which indicates the end of the parameters
			
			if(length == 0) // Unspecified value
				goto badreq;
			
			if(param_location != -1) // If we want to use this parameter
				request_params[param_location]=request_char;
			
			request_char += length + 1; // Now, proceed the next parameter!
		}
		
		// Let's check we have all the parameters set
		for(param_location=REQUEST_UP; param_location < REQUEST_PASSKEY; param_location++)
			if(request_params[param_location] == 0) // If one parameter is missing, then we're not fine
				goto badreq;
		
		/************************
		 * Determine the Client *
		 ************************/
		// We'll use the User-Agent header to do so
		
		// First, let's go to the next line
		length = string_until(request_char, '\n');
		if(length == 0) // Normally, we should have "HTTP/1.1", which is not empty
			goto badreq;
		
		request_char += length + 1;
		
		// Now iterate over the headers
		while(request_char < request_end){ // Don't go after the end of the request
			length = string_until(request_char, ':'); // The colon indicates we are switching to the header value
			if(length == 0) // No header name
				goto badreq;
			
			if(strcmp(request_char, "User-Agent") == 0){ // This is the data we want!
				request_char += length + 2; // Go to the corresponding value - There is also a space after the colon
				
				request_params[REQUEST_CLIENT] = request_char;
				string_until(request_char, '\n'); // Insert a end of string delimiter after the value
				
				break; //Get out of the loop, we have nothing more to do here
			
			} else { // This is not the data we want
				request_char += length + 1; // Go after ":", and try the next line
				length = string_until(request_char, '\n');
				if(length == 0) //We've reached the end of the data
					goto badreq; // As we haven't got any data about the client used, we consider this to be a bad request
			}
		}
		// If we reach this point, it means we got the client.
		
		// TODO : Process the data with the DB : Integrate Mongo First!
		
		/*********************
		 * Check the passkey *
		 *********************/
		// While we're on it, we'll also update the uploaded and downloaded data, as MongoDB will return the number of affected lines
		
		
		/**** This is just debug, to show it works correctly ****/
		printf(
			COLOR_YELLOW "====== THE DATA OF THE REQUEST =======\n"
			COLOR_BLUE "PASSKEY  : " COLOR_WHITE "%s\n"
			COLOR_BLUE "UPLOAD   : " COLOR_GREEN "%s\n"
			COLOR_BLUE "DOWNLOAD : " COLOR_RED "%s\n"
			COLOR_BLUE "PORT     : " COLOR_RESET "%s\n"
			COLOR_BLUE "CLIENT   : " COLOR_MAGENTA "%s\n"
			COLOR_BLUE "IP       : " COLOR_CYAN "%s\n"
			COLOR_BLUE "COMPACT  : " COLOR_RESET "%s\n"
			COLOR_BLUE "LEFT     : " COLOR_RESET "%s\n",
			request_params[REQUEST_PASSKEY],
			request_params[REQUEST_UP],
			request_params[REQUEST_DOWN],
			request_params[REQUEST_PORT],
			request_params[REQUEST_CLIENT],
			inet_ntoa(client_data.sin_addr),
			request_params[REQUEST_COMPACT],
			request_params[REQUEST_LEFT]
		);
		if(request_params[REQUEST_EVENT] != 0)
			printf(COLOR_BLUE "EVENT    : " COLOR_RESET "%s\n", request_params[REQUEST_EVENT]);
		printf("\n");
		
		send(response_socket, "d14:failure reason15:Not Implementede", 37, 0);
		
		goto nextreq; // Avoid sending him failed request data, he's not going to like it
		
		/****************************
		 * In case of a bad request *
		 ****************************/
		badreq:
		send(response_socket, "d14:failure reason11:Bad Requeste", 33, 0);
		
		/**********************************
		 * Get ready for the next request *
		 **********************************/
		
		nextreq:
		// Close the sockect
		close(response_socket);

	}
	/*********************
	 * 4 - Graceful stop *
	 *********************/

	// Just close the socket, the system will take care of the memory
	close(sock);
	
	// Say everyhing went fine
	return 0;
}
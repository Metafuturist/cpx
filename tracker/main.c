/***********************
 * CPX TORRENT TRACKER *
 ***********************/
 
// Part of the CPX Project
// Distributed under the MIT License

#include <netinet/in.h>
#include <stdio.h>
#include <sys/socket.h>
#include <sys/types.h>

int stop = 0; //When the program catches a Ctrl+C event, the status of this variable will change and it will begin a graceful stop

// Here begins the program
int main(int argc, char* argv[]){
	// 1 - Open a listening Socket
	int sockfd = socket(AF_INET, SOCK_STREAM, 0);
	// Bind it to the correct port - TODO : Get the port from the command prompt?
	SOCKADDR_IN sin = { 0 };
	sin.sin_addr.s_addr = htonl(INADDR_ANY);
	sin.sin_port = htons(PORT);
	sin.sin_family = AF_INET;
	bindq(
	
	// 2 - Wait for a request
	char request[512]; // Prepare the Buffer for the request
}
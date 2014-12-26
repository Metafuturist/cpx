var index=0, size;
// Little tool to make it easier appending values
Array.prototype.append = function (other_array) {
	for(var i = 0; i<other_array.length; i++) //There is no method forEach on Uint8Arrays, so we have to use a for loop
		this.push(other_array[i]);    
}

function BinaryData(data){
	this.data = data;
	this.index = -1;

	this.nextChar = function(){
		this.index++;
		if(this.index >= this.data.length) //If we already reached the end of the file - To make sure that even if we get a corrupted file no infinite loop is launched
			return false;
		var code = this.data[this.index];
		if(code < 128) //The last byte is not set to 1
			return String.fromCharCode(code);
		else{ //Bit harder, now we have to find out the code of the UTF-8 character
			var n_bytes=0, pow=128;
			while(code >= pow)
			{
				code -= pow;
				pow /= 2;
				n_bytes++;
			}
			//Now that we know how many bytes the character code is coded on, let's add their values!
			for(i=1; i < n_bytes; i++)
			{
				code <<= 6; //Make some space for other bytes, please!
				this.index++;
				code += this.data[this.index] - 128; //The first byte is set to 1
			}
			var elem=document.createElement('p');
			elem.innerHTML='&#' + code + ';';
			return elem.innerHTML;
		}
	}
	
	this.nextInt = function(){ //Get the integer value beginning where the index is
		var toadd = parseInt(this.nextChar()), value = 0;
		while(!isNaN(toadd))
		{
			value *= 10;
			value += toadd;
			toadd = parseInt(this.nextChar());
		}
		return value;
	}
	
	this.nextString = function(){ // Return the next string as an Uint8Array
		this.index -= 1;
		//The length of the string is easy to get :
		var size = this.nextInt();
		//Then, get the correct portion of the array :
		var data = this.data.subarray(this.index+1, 1 + (this.index += size)  ); //We add 1 because we don't want the colon ":" and because we want the index+size character
		return data;
	}
}

bdecode = function(myArray, type){
	if(!type){
		var array = new BinaryData(myArray),
		data = array.nextChar() == 'd' ? {} : [] ;
	} else
	{
		var array = myArray,
		data = type == 'd' ? {} : [];
	}
	
	var object = !Array.isArray(data), character;
	if(object)
		var target;

	while(character = array.nextChar()){ //This loop is stopped by the return instruction or by reaching the end of the file
		switch (character)
		{
			case 'e':
				//We have reached the end of our item! WOHOOO!
				return data;
			break;
			case 'i':
				toadd = array.nextInt();
			break;
			case 'd':
			case 'l':
				toadd = bdecode(array, character);
			break;
			default:
				//String
				toadd = array.nextString();
			break;
		}
		//Right ! Now that we know what to add, let's see how to insert it into the object!
		if (object)
		{
			if (target !== undefined)
			//We already have an index
			{
				data[target] = toadd;
				target = undefined;
			}
			else
				target = intToString(toadd);
		}
		else
			data.push(toadd);
		index++;
	}
	return false;
}

function intToString(array){
	var data = new BinaryData(array), result="";
	for(var i = 0; i < array.length; i++)
		result += data.nextChar();
	return result;
}

bencode = function(data){ //Encode some data!
	var result = [], object = true, i;
	if(Array.isArray(data))
	{
		result.push(108); //The code of 'l' is 108
		object = false;
	} else
		result.push(100); //The code of 'd' is 108
	for (i in data)
	{
		if(i == 'append') //The function we defined for an array can trigger the for ... in ... loop
			continue; //Just skip it
		if(object) //If it's an object, add the name of the value before...
		{
			//Append the length of the index before
			result.append(numberToInt(i.length));
			//Don't forget the colon...
			result.push(58);
			//Now, add the name to the array...
			result.append(stringToInt(i));
		}
		switch(typeof data[i])
		{
			case 'number':
				//Say it's a number
				result.push(105);
				result.append(numberToInt(data[i])); //Encode the number
				//Add a 'e' at the end
				result.push(101);
			break;
			default: //It's not a number, so it can either be a string, an array, or an object
				if(Array.isArray(data[i]))
				{
					//The best way to determine if array is in Uint8 or not is still to... append a key at the beginning. The decode function already added something
					result.append(bencode(data[i])); //It will add 'l' and 'e' automatically
				} else if (Object.prototype.toString.call(data[i]).contains('Uint8')) { //It's Raw data! Let's add it! But don't forget the length before!
					result.append(numberToInt(data[i].length));
					//Don't forget the colon...
					result.push(58);
					//Now, add the name to the array...
					result.append(data[i]);
				} else { //It's an object
					result.append(bencode(data[i]))
				}
			break;
		}
	}
	result.push(101); //Add 'e' code at the end
	return result;
}

function stringToInt(data){
	var result = [];
	for(var i=0; i<data.length; i++)
		result.push(data.charCodeAt(i)); //Assuming it's a simple string because it's a key index
	return result;
}

function numberToInt(number){ //Encode a number properly : one digit at a time!
	var result = [];
	var pow = Math.floor(Math.log10(number));
	pow = Math.pow(10, pow);
	while(pow >= 1)
	{
		result.push(48 + Math.floor(number / pow)); //0 has a code of 48, 1 a code of 49 ....
		number -= Math.floor(number / pow) * pow;
		pow /= 10; //Get the next digit at next iteration
	}
	return result;
}
function Decoder(bytes, port) {
  // TO-DO: 
  // - verify checksum
  // - add other message types
	
	//helper function to convert lat,long to double floats
	function bytesToFloat(bytes) {
		var buffer = new ArrayBuffer(8);
		var view = new Uint8Array(buffer,0,8);
		var float = new Float64Array(buffer,0,1);
		view[0] = bytes[0];
		view[1] = bytes[1];
		view[2] = bytes[2];
		view[3] = bytes[3];
		view[4] = bytes[4];
		view[5] = bytes[5];
		view[6] = bytes[6];
		view[7] = bytes[7];
		return float[0];
	}
	
	//decode message type form payload
	var messageType = bytes[4];

	//output decoded message depending on the type
	switch(messageType){
		case 0xF6: //BATTERY AND STEPS INFO
			return {
				message:"power",
				batV: (bytes[6] << 8 | bytes[5] * 20) + "%",
				steps: bytes[10] << 24 | bytes[9] << 16 | bytes[8] << 8 | bytes[7],
				signal_strength: bytes[11] + "%",
				timestamp: bytes[15] << 24 | bytes[14] << 16 | bytes[13] << 8 | bytes[12]
			};
		
		case 0x03: //GPS LOCATION 
			var lon = bytesToFloat(bytes.slice(5,13));
			var lat = bytesToFloat(bytes.slice(13,21));
			return {
				message:"gps",
				longitude: (String.fromCharCode(bytes[22]) == 'E')?lon:-1*lon,
				latitude: (String.fromCharCode(bytes[21]) == 'N')?lat:-1*lat,
				status: String.fromCharCode(bytes[23]),
				timestamp: bytes[27] << 24 | bytes[26] << 16 | bytes[25] << 8 | bytes[24]
			};
		
		case 0xC2: //HEART RATE and BLOOD PRESSURE
			return {
				message:"heart",
				bp_systolic: bytes[6] << 8 | bytes[5], 
				bp_diastolic: bytes[8] << 8 | bytes[7],
				heart_rate: bytes[10] << 8 | bytes[9],
				timestamp: bytes[14] << 24 | bytes[13] << 16 | bytes[12] << 8 | bytes[11]
			};
		
		case 0xB5: //SOS
			return {
				message: "sos",
				status: bytes[5],
				timestamp: bytes[9] << 24 | bytes[8] << 16 | bytes[7] << 8 | bytes[6]
			};
		
		case 0xC7: //uplink when no gpd fix
			return {message:"no_gps"};
		
		default:
			return {message:"unknown"};
	}
}

/* 
 * Decoder function for Helium
 * Browan Ambient Light Sensor
 *
 * This function was created by Jason
 */

function Decoder(bytes, port) {

    var params = {
        "bytes": bytes
    };

    // Status measurement
	params.darker = ((bytes[0] & 0x1) !== 0) ? true : false;
	params.lighter = ((bytes[0] & 0x2) !== 0) ? true : false;
	params.keep_alive = ((bytes[0] & 0x5) !== 0) ? true : false;
	   
	// Lux
	params.lux = ((bytes[5] << 16) | (bytes[4] << 8) | bytes[3])/100;


    
    // Board temp measurement
    temp_board = bytes[2] & 0x7f;
    temp_board = temp_board - 32;



    // Battery measurements
    batt = bytes[1] & 0x0f;
    batt = (25 + batt) / 10;
    params.temp_board = temp_board;
    params.batt = batt;

    return params;
}

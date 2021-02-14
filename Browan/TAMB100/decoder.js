/* 
 * Decoder function for Helium
 * Browan Ambient Light Sensor
 *
 * This function was created by Jason
 * Sample payload 600c341a26
 */

function Decoder(bytes, port) {

    var decoded = {};

    // Status measurement
	decoded.darker = bit(bytes[0], 0);
	decoded.lighter = bit(bytes[0], 1);
	decoded.status_change = bit(bytes[0], 4);
	decoded.keep_alive = bit(bytes[0], 5);
	   
	// Lux
	decoded.lux = ((bytes[5] << 16) | (bytes[4] << 8) | bytes[3])/100;


    
    // Board temp measurement
    temp_board = bytes[2] & 0x7f;
    temp_board = temp_board - 32;



    // Battery measurements
    batt = bytes[1] & 0x0f;
    batt = (25 + batt) / 10;
    decoded.temp_board = temp_board;
    decoded.batt = batt;

    return decoded;
}

// Gets the boolean value of the given bit
function bit(value, bit) {
  return (value & (1 << bit)) > 0;
}

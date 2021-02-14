/* 
 * Decoder function for Helium
 *
 * This function was created by Jason
 */

function Decoder(bytes, port) {

    var params = {};

    // Status measurement
    params.leak = bit(bytes[0], 0);
    params.leak_int = bit(bytes[0], 4);
    params.temp_change = bit(bytes[0], 5);
    params.RH_change = bit(bytes[0], 6);
    
    
    

    // Humidity Measurement
    rh = bytes[3] & 0x7f;
    if (rh === 127) {
        rh_error = true;
    } else {
        rh_error = false;
    }
     
    // Board temp measurement
    temp_board = bytes[2] & 0x7f;
    temp_board = temp_board - 32;

    // Ambient temp measurement
    temp_ambient = bytes[4] & 0x7f;
    temp_ambient = temp_ambient - 32;

    // Battery measurements
    batt = bytes[1] & 0x0f;
    batt = (25 + batt) / 10;
    
    params.rh = rh;
    params.rh_error = rh_error;
    params.temp_board = temp_board;
    params.temp_ambient = temp_ambient;
    params.batt = batt;

    return params;
}

// Gets the boolean value of the given bit
function bit(value, bit) {
  return (value & (1 << bit)) > 0;
}

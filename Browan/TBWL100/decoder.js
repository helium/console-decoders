/* 
 * Decoder function for Helium
 *
 * This function was created by Jason
 */

function Decoder(bytes, port) {

    var params = {};

    // Status measurement
    params.leak = ((bytes[0] & 0x1) !== 0) ? true : false;
    params.leak_change = ((bytes[0] & 0x8) !== 0) ? true : false;
    params.temp_change = ((bytes[0] & 0x10) !== 0) ? true : false;
    params.RH_change = ((bytes[0] & 0x20) !== 0) ? true : false;
    
    
    

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

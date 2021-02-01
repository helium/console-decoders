/* 
* Decoder for the Browan TBHH100 Temperature and Humidity Sensor
*
* The starting source code for TBHH100.js came from the file, healthyhome.js found in this repository:
* https://github.com/SensationalSystems/smart_building_sensors_decoder
* which was created by Cameron Sharp at Sensational Systems - cameron@sensational.systems
 *
 *
 */

function Decoder(bytes, port) {

    var params = {
        "bytes": bytes
    };
    
    // Humidity Measurement
    rh = bytes[3] &= 0x7f;
    if (rh === 127) {
        rh_error = true;
    } else {
        rh_error = false;
    }
    
    // temp measurement (in degrees C)
    temp = bytes[2] & 0x7f;
    temp = temp - 32;



    // Battery measurements
    batt = bytes[1] & 0x0f;
    batt = (25 + batt) / 10;

    params.rh = rh;
    params.temp = temp;
    params.batt = batt;

    return params;
}

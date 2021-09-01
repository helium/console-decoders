/* 
 * Decoder function for The Things Network to unpack the payload of TEKTELIC's All-in-One Home sensors
 * More info on the sensors/buy online:
 * https://connectedthings.store/products/tektelic-kona-home-sensor-pir
 * https://connectedthings.store/products/tektelic-kona-home-sensor-base
 * This function was created by Al Bennett at Sensational Systems - al@sensational.systems
 */

function bin2HexStr(arr)
 
{
    var str = "";
    for(var i=0; i<arr.length; i++)
    {

       var tmp = arr[i].toString(16);
       if(tmp.length == 1)
       {
           tmp = "0" + tmp;
       }
       tmp = "0x" + tmp;
       if (i != arr.length - 1) {
           tmp += ",";
       }
       str += tmp;
    }
    return str;
}

// Wrapper for ChirpStack
function Decode(port, bytes) {
	//Simply call the TTN function with the parameters switched
	return Decoder(bytes, port);
}

//TTN Handler
function Decoder(bytes, port) {

    var params = {
        "battery_voltage": null,
        "reed_state": null,
        "light_detected": null,
        "temperature": null,
        "humidity": null,
        "impact_magnitude": null,
        "break_in": null,
        "acceleration_x": null,
        "acceleration_y": null,
        "acceleration_z": null,
        "reed_count": null,
        "moisture": null,
        "activity": null,
        "mcu_temperature": null,
        "impact_alarm": null,
        "activity_count": null,
        "external_input": null,
        "external_input_count": null,
        "decode_data_hex": bin2HexStr(bytes),
        "bytes": bytes
    }

    for (var i = 0; i < bytes.length; i++) {        
        // Handle battery voltage
        if(0x00 === bytes[i] && 0xFF === bytes[i+1]) {
            params.battery_voltage = 0.01 * ((bytes[i+2] << 8) | bytes[i+3]);
            i = i+3;
        }
        
        // Handle reed switch state
        if(0x01 === bytes[i] && 0x00 === bytes[i+1]) {
            if(0x00 === bytes[i+2]) {
                params.reed_state = true;
            } else if(0xFF === bytes[i+2]) {
                params.reed_state = false;
            }
            i = i+2;
        }
        
        // Handle light detection
        if(0x02 === bytes[i] && 0x00 === bytes[i+1]) {
            if(0x00 === bytes[i+2]) {
                params.light_detected = false;
            } else if(0xFF === bytes[i+2]) {
                params.light_detected = true;
            }
            i = i+2;
        }
		
        // Handle temperature
        if(0x03 === bytes[i] && 0x67 === bytes[i+1]) {
            // Sign-extend to 32 bits to support negative values, by shifting 24 bits
            // (16 too far) to the left, followed by a sign-propagating right shift:
            params.temperature = (bytes[i+2]<<24>>16 | bytes[i+3]) / 10;
            i = i+3;
        }
        
        // Handle humidity
        if(0x04 === bytes[i] && 0x68 === bytes[i+1]) {
            params.humidity = 0.5 * bytes[i+2];
            i = i+2;
        }
		
        // Handle impact magnitude
        if(0x05 === bytes[i] && 0x02 === bytes[i+1]) {
            // Sign-extend to 32 bits to support negative values, by shifting 24 bits
            // (16 too far) to the left, followed by a sign-propagating right shift:
            params.impact_magnitude = (bytes[i+2]<<24>>16 | bytes[i+3])/1000;
            i = i+3;
        }
		
        // Handle break-in
        if(0x06 === bytes[i] && 0x00 === bytes[i+1]) {
            if(0x00 === bytes[i+2]) {
                params.break_in = false;
            } else if(0xFF === bytes[i+2]) {
                params.break_in = true;
            }
            i = i+2;
        }
		
        // Handle accelerometer data
        if(0x07 === bytes[i] && 0x71 === bytes[i+1]) {
            // Sign-extend to 32 bits to support negative values, by shifting 24 bits
            // (16 too far) to the left, followed by a sign-propagating right shift:
            params.acceleration_x = (bytes[i+2]<<24>>16 | bytes[i+3])/1000;
            params.acceleration_y = (bytes[i+4]<<24>>16 | bytes[i+5])/1000;
            params.acceleration_z = (bytes[i+6]<<24>>16 | bytes[i+7])/1000;
            i = i+7;
        }
        
        // Handle reed switch count
        if(0x08 === bytes[i] && 0x04 === bytes[i+1]) {
            params.reed_count = (bytes[i+2] << 8) | bytes[i+3];
            i = i+3;
        }
		
        // Handle moisture
        if(0x09 === bytes[i] && 0x00 === bytes[i+1]) {
          i = i+1;
          //check data
          if (0x00 === bytes[i+1]) {
             params.moisture = false;
             i = i+1;
          }
          else if( 0xFF === bytes[i+1]) {
            params.moisture = true;
            i = i+1;
          }
        }
        
        // Handle PIR activity
        //check the channel and type
        if(0x0A === bytes[i] && 0x00 === bytes[i+1]) {
          i = i+1;
          //check data
          if (0x00 === bytes[i+1]) {
             params.activity = false;
             i = i+1;
          }
          else if( 0xFF === bytes[i+1]) {
            params.activity = true;
            i = i+1;
          }
        }
		
        // Handle temperature
        if(0x0B === bytes[i] && 0x67 === bytes[i+1]) {
            // Sign-extend to 32 bits to support negative values, by shifting 24 bits
            // (16 too far) to the left, followed by a sign-propagating right shift:
            params.mcu_temperature = (bytes[i+2]<<24>>16 | bytes[i+3]) / 10;
            i = i+3;
        }
        
        // Handle impact alarm
        if(0x0C === bytes[i] && 0x00 === bytes[i+1]) {
            if(0x00 === bytes[i+2]) {
                params.impact_alarm = false;
            } else if(0xFF === bytes[i+2]) {
                params.impact_alarm = true;
            }
            i = i+2;
        }
        
        // Handle motion (PIR activity) event count
        if(0x0D === bytes[i] && 0x04 === bytes[i+1]) {
            params.activity_count = (bytes[i+2] << 8) | bytes[i+3];
            i = i+3;
        }
        
        // Handle external input state
        if(0x0E === bytes[i] && 0x00 === bytes[i+1]) {
            if(0x00 === bytes[i+2]) {
                params.external_input = true;
            } else if(0xFF === bytes[i+2]) {
                params.external_input = false;
            }
            i = i+2;
        }
        
        // Handle external input count
        if(0x0F === bytes[i] && 0x04 === bytes[i+1]) {
            params.external_input_count = (bytes[i+2] << 8) | bytes[i+3];
            i = i+3;
        }
    }

    return params

}

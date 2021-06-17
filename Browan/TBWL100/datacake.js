// Browan tabs Water Leak Sensor (TBWL100)
// Example payload: 

function Decoder(payload, port) {


if (port===106) 
{
	    rh = payload[3] & 0x7f;
    if (rh === 127) {
        rh_error = true;
    } else {
        rh_error = false;
    }

        return [
            {
                field: "WATER_LEAK",
                value: bit(payload[0], 0),
            },
            {
                field: "LEAK_INT",
                value: bit(payload[0], 4),
            },
            {
                field: "TEMP_CHANGE",
                value: bit(payload[0], 5),
            },
            {
                field: "RH_CHANGE",
                value: bit(payload[0], 6),
            },
            {
                field: "HUMIDITY",
                value: rh,
            },
			{
				field: "RH_ERROR",
				value : rh_error,
			},
            {
                field: "TEMP_BOARD",
                value: (payload[2] & 0x7f) - 32,
            },
            {
                field: "TEMP_AMBIENT",
                value: (payload[4] & 0x7f) - 32,
            },
            {
                field: "BATTERY",
                value: ((25+ (payload[1] & 0x0f))/10),
            }

        ];
}

if (port===204)
{
       return [
            {
                field: "KEEP_ALIVE_INTERVAL",
                value: payload[2]<<8) | (payload[1],
            },
            {
                field: "TEMP_DELTA",
                value: payload[4],
            },
            {
                field: "RH_DELTA",
                value: payload[6],
            },
            {
                field: "SENSOR_DETECT_INTERVAL",
                value: payload[9]<<8 | payload[8],
            }

        ];
}


}

// Gets the boolean value of the given bit
function bit(value, bit) {
  return (value & (1 << bit)) > 0;
}

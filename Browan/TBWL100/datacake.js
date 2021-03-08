// Browan tabs Water Leak Sensor (TBWL100)
// Example payload: 

function Decoder(payload, port) {

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

// Gets the boolean value of the given bit
function bit(value, bit) {
  return (value & (1 << bit)) > 0;
}

// Browan tabs Water Leak Sensor (TBWL100)
// Example payload: 

function Decoder(payload, port) {

        return [
            {
                field: "WATER_LEAK",
                value: ((payload[0] & 0x1) !== 0) ? true : false,
            },
            {
                field: "LEAK_CHANGE",
                value: ((payload[0] & 0x8) !== 0) ? true : false,
            },
            {
                field: "TEMP_CHANGE",
                value: ((payload[0] & 0x10) !== 0) ? true : false,
            },
            {
                field: "RH_CHANGE",
                value: ((payload[0] & 0x20) !== 0) ? true : false,
            },
            {
                field: "HUMIDITY",
                value: ((payload[3] & 0x7f),
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

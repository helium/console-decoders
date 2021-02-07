// Browan tabs Ambient Light Sensor (TBHH100)
// Example payload: IAs6AAAA

function Decoder(payload, port) {
        return [
            {
                field: "DARKER",
                value: ((payload[0] & 0x1) !== 0) ? true : false,
            },
            {
                field: "LIGHTER",
                value: ((payload[0] & 0x2) !== 0) ? true : false,
            },
            {
                field: "KEEP_ALIVE",
                value: ((payload[0] & 0x20) !== 0) ? true : false,
            },
            {
                field: "LUX",
                value: ((payload[5] << 16) | (payload[4] << 8) | payload[3])/100,
            },
            {
                field: "TEMP_BOARD",
                value: (payload[2] & 0x7f) - 32,
            },
            {
                field: "BATT",
                value: ((25+ (payload[1] & 0x0f))/10),
            }

        ];
}

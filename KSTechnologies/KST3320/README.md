# KST3320 Decoder

The KST3320 LoRaWAN Distance Sensor is designed for contact-less measurements of solid and liquid levels within 10mm accuracy. 

---

## KST3320 Packets Types

### Uplink

Four different payloads are sent. A Distance, Battery, GPS & Extended GPS (If ADR is supported) The Distance payload is sent per the uplink interval, which can be changed via a downlink. Battery and GPS payloads are typically sent once per day. If GPS is required more than once per day, this can be changed via the downlink.

Check the documentation in the Javascript decoder for more detail.

Distance Example: `01820036`

Battery Example: `017863`

GPS Example: `018805F371F006170372EE`

Extended GPS Example: `018805F371F006170372EE00018D800000FA3604`

| Packet Type  | LoRa Channel | Data Type | Value                                    | Decoded Value                                                                                                   |
|--------------|--------------|-----------|------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| Distance     | `0x01`       | `0x82`    | `0x0036`                                 | 54mm                                                                                                            |
| Battery      | `0x01`       | `0x78`    | `0x63`                                   | 99%                                                                                                             |
| GPS          | `0x01`       | `0x88`    | `0x05F371F006170372EE`                   | Lat: 39.0001°, Long: 104.7016°, Alt: 2260.30 meters                                                             |
| Extended GPS | `0x01`       | `0x88`    | `0x05F371F006170372EE00018D800000FA3604` | Lat: 39.0001°, Long: 104.7016°, Alt: 2260.30 meters, Horiz ACC: 101.760 meters, Vert ACC: 64.054 meters, SAT: 4 |


### Downlink

A downlink payload can be sent to change the uplink interval time in minutes. If you so choose to, you can also change the GPS interval and set the Tx power for BLE.

Example: `00000A0005040000` = Set Distance Uplink Interval to 10mins, GPS payload to every 5th uplink and sets the BLE Tx power to +4dBm.

| Packet ID | Distance Uplink Interval | GPS Payload | BLE Tx Power | Reserved Value |
|-----------|--------------------------|-------------|--------------|----------------|
| `0x00`    | `0x000A`                 | `0x0005`    | `0x04`       | `0x0000`       |
# KST3620 Decoder

The KST3620 is a LoRaWAN temperature sensor with an operating range between -30°C to +70°C. The KST3620 sensor consists of a separate RF (radio frequency) IP rated enclosure allowing the user to customize the temperature sensor placement while not compromising the RF performance.

---

## KST3620 Packets Types

## Uplink

One payload is sent with both Temperature & Battery packets concatenated.
Temperature uplinks are in 2's Complement notation. Check the documentation in the Javascript Parser for more detail.

Example: `006702FE840078021175`

| Packet Type      | Key      | Length | Value    | Decoded Value |
|------------------|----------|--------|----------|---------------|
| Temperature (°C) | `0x0067` | `0x02` | `0xFE84` | -23.75°C      |
| Battery (mV)     | `0x0078` | `0x02` | `0x1175` | 4469mV        |

## Downlink

A downlink payload can be sent to change the uplink interval time in minutes.

Example: `0100010F` = Set Uplink Interval to 15mins

| Packet Type     | Key      | Length | Value           |
|-----------------|----------|--------|-----------------|
| Uplink Interval | `0x0100` | `0x01` | `0x0F` (15mins) |
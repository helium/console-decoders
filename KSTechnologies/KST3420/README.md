# KST3420 Decoder

The KST3420 is a LoRaWAN distance sensor with an operating range between -20°C to +70°C. The KST3420 sensor consists of a separate RF (radio frequency) IP rated enclosure allowing the user to customize the distance sensor placement while not compromising the RF performance.

---

## KST3420 Packets Types

### Uplink

One payload is sent with both Distance, Ambient Light, Reflected Light, and Battery packets concatenated.

Check the documentation in the Javascript decoder for more detail.

Example: `0082020041008902383500650294000078021146`

| Packet Type   | Key      | Length | Value    | Decoded Value |
|---------------|----------|--------|----------|---------------|
| Distance (mm) | `0x0082` | `0x02` | `0x0041` | 65mm          |
| Reflection    | `0x0089` | `0x02` | `0x3835` | 14,389 mcps   |
| Ambient       | `0x0065` | `0x02` | `0x9400` | 37,888 mcps   |
| Battery       | `0x0078` | `0x02` | `0x1146` | 4,422mV       |


### Downlink

A downlink payload can be sent to change the uplink interval time in minutes.

Example: `0100010F` = Set Uplink Interval to 15mins

| Packet Type     | Key      | Length | Value           |
|-----------------|----------|--------|-----------------|
| Uplink Interval | `0x0100` | `0x01` | `0x0F` (15mins) |
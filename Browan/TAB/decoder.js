/**
 * Decoder for Trackio GPS device.
 * Added altitude = 0 to add support for mappers.helium.com
 *
 * Test with: 08FE3962FF010E78BACA5B
 */
/*jslint bitwise: true */
function Decoder(bytes, port) {
  var decoded = {};
  var batteryStatus = bytes[1];

  // Some "common status format"
  decoded.status = bits(bytes[0], 4, 7);

  switch (batteryStatus){
    case 0:
      // Device is charging or line powered.
      decoded.charging = true;
      decoded.batteryFault = false;
      break;
    case 255:
      // Device could not measure battery — possible Fault
      decoded.batteryFault = true;
      break;
    default:
      decoded.charging = false;
      decoded.batteryFault = false;
      var battery = bytes[1] & 0x0f;
      battery = (25 + battery) / 10;
      decoded.battery = battery;
      var capacity = bytes[1] >> 4;
      capacity = (capacity / 15) * 100;
      decoded.capacity = capacity;
  }

  // Bit 7 is RFU; exclude
  decoded.temperature = bits(bytes[2], 0, 7) - 32;
  decoded.gnssFix =  bit(bytes[0], 3);
    // LSB, ignoring the 4 high bits (RFU) and sign-extending to 32 bits
    // to support negative values, by shifting 4 bytes too far to the
    // left (which discards those bits, as only 32 bits are preserved),
    // followed by a sign-propagating right shift:
  decoded.latitude = (bytes[3] | bytes[4] << 8 | bytes[5] << 16
      | bytes[6] << 28 >> 4) / 1e6;
    // Likewise, ignoring the 3 high bits (used for accuracy):
  decoded.longitude = (bytes[7] | bytes[8] << 8 | bytes[9] << 16
      | bytes[10] << 27 >> 3) / 1e6;
    // Accuracy in meters; 1 << x+2 is the same as Pow(2, x+2) for x < 32
  decoded.accuracy = 1 << bits(bytes[10], 5, 7) + 2;
  decoded.altitude = 0;

  decoded.buttonPressed = (bytes[0] & 0x1) === 1;
  decoded.moving = (bytes[0] & 0x2) !== 0;
  decoded.gnssOk = (bytes[0] & 0x16) === 0;

  return decoded;
}

// Gets the zero-based unsigned numeric value of the given bit(s)
function bits(value, lsb, msb) {
  var len = msb - lsb + 1;
  var mask = (1 << len) - 1;
  return value >> lsb & mask;
}

// Gets the boolean value of the given bit
function bit(value, bit) {
  return (value & (1 << bit)) > 0;
}

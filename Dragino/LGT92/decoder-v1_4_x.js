function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  var alarm = bytes[6] & 0x40 ? true : false; //Alarm status
  value = ((bytes[6] & 0x3f) << 8) | bytes[7];
  var batV = value / 1000; //Battery,units:Volts
  value = (bytes[8] << 8) | bytes[9];
  if (bytes[8] & 0x80) {
    value |= 0xffff0000;
  }
  var roll = value / 100; //roll,units: Â°
  value = (bytes[10] << 8) | bytes[11];
  if (bytes[10] & 0x80) {
    value |= 0xffff0000;
  }
  var pitch = value / 100; //pitch,units: Â°
  var json = {
    roll: roll,
    pitch: pitch,
    batV: batV,
    alarm: alarm,
  };
  var value = (bytes[0] << 16) | (bytes[1] << 8) | bytes[2];
  if (bytes[0] & 0x80) {
    value |= 0xffffff000000;
  }
  var value2 = (bytes[3] << 16) | (bytes[4] << 8) | bytes[5];
  if (bytes[3] & 0x80) {
    value2 |= 0xffffff000000;
  }
  if (value == 0x0fffff && value2 == 0x0fffff) {
    //gps disabled (low battery)
  } else if (value === 0 && value2 === 0) {
    //gps no position yet
  } else {
    json.latitude = value / 10000; //gps latitude,units: Â°
    json.longitude = value2 / 10000; //gps longitude,units: Â°
  }
  return json;
}

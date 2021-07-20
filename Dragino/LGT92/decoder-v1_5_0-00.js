//The function is :
function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  var value = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  if (bytes[0] & 0x80) {
    value |= 0xffffffff00000000;
  }
  var latitude = value / 1000000; //gps latitude,units: Â°
  value = (bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7];
  if (bytes[4] & 0x80) {
    value |= 0xffffffff00000000;
  }
  var longitude = value / 1000000; //gps longitude,units: Â°
  var alarm = bytes[8] & 0x40 ? "TRUE" : "FALSE"; //Alarm status
  value = ((bytes[8] & 0x3f) << 8) | bytes[9];
  var batV = value / 1000; //Battery,units:V
  value = bytes[10] & 0xc0;
  if (value == 0x40) {
    var motion_mode = "Move";
  } else if (value == 0x80) {
    motion_mode = "Collide";
  } else if (value == 0xc0) {
    motion_mode = "User";
  } else {
    motion_mode = "Disable";
  } //mode of motion
  var led_updown = bytes[10] & 0x20 ? "ON" : "OFF"; //LED status for position,uplink and downlink
  value = (bytes[11] << 8) | bytes[12];
  if ((bytes[10] & 0x1f) == "0x00") {
    var version = "LGT92_v1.5.0";
  }
  if (bytes[11] & 0x80) {
    value |= 0xffff0000;
  }
  var roll = value / 100; //roll,units: Â°
  value = (bytes[13] << 8) | bytes[14];
  if (bytes[13] & 0x80) {
    value |= 0xffff0000;
  }
  var pitch = value / 100; //pitch,units: Â°
  return {
    Version: version,
    Latitude: latitude,
    Longitude: longitude,
    Roll: roll,
    Pitch: pitch,
    BatV: batV,
    ALARM_status: alarm,
    MD: motion_mode,
    LON: led_updown,
    Altitude: 0,
    Accuracy: 3,
  };
}

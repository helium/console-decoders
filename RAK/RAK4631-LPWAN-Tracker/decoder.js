function Decoder(bytes, port) {
  
  // Decode LPWAN-Tracker to javascript object 
  
  var sensor = {};
  
  sensor.latitude = (bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24 | (bytes[3] & 0x80 ? 0xFF << 24 : 0)) / 100000.0;
  sensor.longitude = (bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24 | (bytes[7] & 0x80 ? 0xFF << 24 : 0)) / 100000.0;
  sensor.altitude = (bytes[8] | bytes[9] << 8 | (bytes[9] & 0x80 ? 0xFF << 16 : 0));
  // sensor.pr  = bytes[10];
  sensor.battery = bytes[11];
  
  return( sensor );
}

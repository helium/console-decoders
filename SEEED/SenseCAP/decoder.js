function Decoder(bytes, port) {
    var decoded = {};
   
    var battery = -99;
    var interval = -99;
    var temp = -99;
    var hum = -99;
    var ch1 = -99;
    var ch2 = -99;
    var ch3 = -99;
    var val01 = -99;
    var val02 = -99;
    var val03 = -99;
     
    ch01 = bytes[0];
   
    val01 = ((bytes[2] << 8) | bytes[1]);
   
    if (val01 === 7) { // battery
      battery = (bytes[4] << 8) | bytes[3];
      interval = (bytes[6] << 8) | bytes[5];
    }
   
    if (val01 === 4097) // temperature
      temp = ((bytes[6] << 24) | (bytes[5] << 16) | (bytes[4] << 8) | bytes[3]) /1000 ;
   
    ch02 = bytes[7];
   
    val02 = ((bytes[9] << 8) | bytes[8]);
   
    if (val02 === 4097) // temperature
      temp = ((bytes[13] << 24) | (bytes[12] << 16) | (bytes[11] << 8) | bytes[10]) /1000 ;
   
    if (val02 === 4098)
      hum = ((bytes[13] << 24) | (bytes[12] << 16) | (bytes[11] << 8) | bytes[10]) / 1000;
   
    ch03 = bytes[14];
   
    val03 = ((bytes[16] << 8) | bytes[15]);
   
    if (val03 === 4097) // temperature
      temp = ((bytes[20] << 24) | (bytes[19] << 16) | (bytes[18] << 8) | bytes[17]) /1000 ;
   
    if (val03 === 4098)
      hum = ((bytes[20] << 24) | (bytes[19] << 16) | (bytes[18] << 8) | bytes[17]) / 1000;
   
    decoded.ch01 = ch01;
    decoded.val01 = val01;
    decoded.ch02 = ch02;
    decoded.val02 = val02;
    decoded.ch03 = ch03;
    decoded.val03 = val03;
    decoded.battery = battery;
    decoded.interval = interval;
    decoded.temperature = temp;
    decoded.humidity = hum;
   
    return decoded;
  }
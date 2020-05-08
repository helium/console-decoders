function Decoder(bytes, port) {
  function step_size(lo, hi, nbits, nresv) {
    return 1.0 / (((1 << nbits) - 1 - nresv) / (hi - lo));
  }

  function mt_value_decode(value, lo, hi, nbits, nresv) {
    return (value - nresv / 2) * step_size(lo, hi, nbits, nresv) + lo;
  }

  var obj = new Object();
  var num;

  obj.bytes = bytes;
  obj.length = bytes.length;
  switch (bytes[0]) {
    case 0x05: //Heartbeat
      obj.type = "HEARTBEAT";
      obj.mode = ((1 << 3) - 1) & (bytes[1] >> 5);
      obj.battery =
        Math.round(100 * mt_value_decode(bytes[2], 2.8, 4.2, 8, 2)) / 100;
      obj.temperature =
        Math.round(100 * mt_value_decode(bytes[3], -44, 85, 8, 2)) / 100;
      obj.ack = (bytes[4] >> 4) & ((1 << 4) - 1);
      break;

    case 0x04: //Energy status
      obj.type = "ENERGY STATUS";
      obj.mode = ((1 << 3) - 1) & (bytes[1] >> 5);
      obj.battery =
        Math.round(100 * mt_value_decode(bytes[2], 2.8, 4.2, 8, 2)) / 100;
      obj.temperature =
        Math.round(100 * mt_value_decode(bytes[3], -44, 85, 8, 2)) / 100;
      obj.ack = (bytes[4] >> 4) & ((1 << 4) - 1);
      break;

    case 0x03: //Position
      obj.type = "POSITION";
      obj.mode = ((1 << 3) - 1) & (bytes[1] >> 5);
      obj.battery =
        Math.round(100 * mt_value_decode(bytes[2], 2.8, 4.2, 8, 2)) / 100;
      obj.temperature =
        Math.round(100 * mt_value_decode(bytes[3], -44, 85, 8, 0)) / 100;
      obj.ack = (bytes[4] >> 4) & ((1 << 4) - 1);
      obj.position_type = bytes[4] & ((1 << 4) - 1);
      obj.age = mt_value_decode(bytes[5], 0, 2040, 8, 0);
      num = ((((bytes[6] << 8) | bytes[7]) << 8) | bytes[8]) << 8;

      if (num > 2147483647) {
        num = num - 268435456;
      }
      obj.lattitude = num / 10000000;

      num = ((((bytes[9] << 8) | bytes[10]) << 8) | bytes[11]) << 8;

      if (num > 2147483647) {
        num = num - 268435456;
      }
      obj.longitude = num / 10000000;
  }
  return obj;
}

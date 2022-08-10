function Decoder(bytes, port) {
  var decoded = {};

  decoded.num = bytes[1];
  decoded.app_id =
    (bytes[2] << 24) | (bytes[3] << 16) | (bytes[4] << 8) | bytes[5];
  decoded.dev_id =
    (bytes[6] << 24) | (bytes[7] << 16) | (bytes[8] << 8) | bytes[9];
  decoded.altitude = 0;
  switch (bytes[0]) {
    case 0xca: // No Location fix
      decoded.acc = 0;
      decoded.fix = false;
      decoded.battery = bytes[10];
      decoded.time =
        (bytes[11] << 24) | (bytes[12] << 16) | (bytes[13] << 8) | bytes[14];
      // adjust time zone
      decoded.time = decoded.time;
      var dev_date = new Date(decoded.time * 1000);
      decoded.time_stamp = dev_date.getHours() + ":" + dev_date.getMinutes();
      decoded.date_stamp =
        dev_date.getDate() +
        "." +
        (dev_date.getMonth() + 1) +
        "." +
        dev_date.getFullYear();
      decoded.stat = bytes[15] & 0x03;
      decoded.gps = bytes[15] & 0x0c;
      decoded.alarm = false;
      break;
    case 0xcb: // Location fix
      decoded.sos = false;
      decoded.alarm = false;
      decoded.fix = true;
      decoded.battery = bytes[20];
      decoded.time =
        (bytes[21] << 24) | (bytes[22] << 16) | (bytes[23] << 8) | bytes[24];
      // adjust time zone
      decoded.time = decoded.time;
      var dev_date = new Date(decoded.time * 1000);
      decoded.time_stamp = dev_date.getHours() + ":" + dev_date.getMinutes();
      decoded.date_stamp =
        dev_date.getDate() +
        "." +
        (dev_date.getMonth() + 1) +
        "." +
        dev_date.getFullYear();
      decoded.stat = bytes[25] & 0x03;
      decoded.gps = bytes[25] & 0x0c;
      decoded.longitude = (
        ((bytes[10] << 24) | (bytes[11] << 16) | (bytes[12] << 8) | bytes[13]) *
        0.000001
      ).toFixed(6);
      decoded.latitude = (
        ((bytes[14] << 24) | (bytes[15] << 16) | (bytes[16] << 8) | bytes[17]) *
        0.000001
      ).toFixed(6);
      decoded.accuracy = bytes[18];
      decoded.gps_start = bytes[19];
      break;
    case 0xcc: // SOS
      decoded.sos = true;
      decoded.alarm = true;

      decoded.longitude = (
        ((bytes[10] << 24) | (bytes[11] << 16) | (bytes[12] << 8) | bytes[13]) *
        0.000001
      ).toFixed(6);
      decoded.latitude = (
        ((bytes[14] << 24) | (bytes[15] << 16) | (bytes[16] << 8) | bytes[17]) *
        0.000001
      ).toFixed(6);
      decoded.location = "(" + decoded.lat + "," + decoded.lng + ")";
      if (bytes.length > 18) {
        var i;
        for (i = 18; i < 28; i++) {
          decoded.name += bytes[i].toString();
        }
        for (i = 28; i < 40; i++) {
          decoded.country += bytes[i].toString();
        }
        for (i = 39; i < 50; i++) {
          decoded.phone += bytes[i].toString();
        }
      }
      break;
    case 0xcd:
      decoded.sos = false;
      decoded.alarm = false;
      break;
    case 0xce:
      decoded.alarm = true;
      decoded.alarm_lvl = bytes[10];
      break;
  }

  try {
    decoded.LORA_RSSI =
      (!!normalizedPayload.gateways &&
        !!normalizedPayload.gateways[0] &&
        normalizedPayload.gateways[0].rssi) ||
      0;
    decoded.LORA_SNR =
      (!!normalizedPayload.gateways &&
        !!normalizedPayload.gateways[0] &&
        normalizedPayload.gateways[0].snr) ||
      0;
    decoded.LORA_DATARATE = normalizedPayload.data_rate;
  } catch (e) {
    console.log(e);
  }

  return decoded;
}

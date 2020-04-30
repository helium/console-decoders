// Convert the two byte sensor data format to a signed number
//
// tInt: the integer portion of the temperature
// tDec: the fractional portion of the temperature
function convertTempUnits(tDec, tInt) {
  // the integer portion is a signed two's complement value; convert it
  // to a signed number
  if (tInt > 127) {
    tInt -= 256;
  }
  // the fractional portion of the number is unsigned and represents the
  // part of the temperature after the base 10 decimal point
  return tInt + (tDec * (tInt < 0 ? -1 : 1)) / 100;
}

function asTempAndRh(decoded, bytes) {
  decoded.Humidity = bytes[2] / 100.0 + bytes[3];
  decoded.Temperature = convertTempUnits(bytes[4], bytes[5]);

  switch (bytes[6]) {
    case 0:
      decoded.BatteryCapacity = "0-5%";
      break;
    case 1:
      decoded.BatteryCapacity = "5-20%";
      break;
    case 2:
      decoded.BatteryCapacity = "20-40%";
      break;
    case 3:
      decoded.BatteryCapacity = "40-60%";
      break;
    case 4:
      decoded.BatteryCapacity = "60-80%";
      break;
    case 5:
      decoded.BatteryCapacity = "80-100%";
      break;
    default:
      decoded.BatteryCapacity = "This value is not supported";
  }

  decoded.AlarmMsgCount = ((bytes[7] << 8) >>> 0) + bytes[8];
  decoded.BacklogMsgCount = ((bytes[9] << 8) >>> 0) + bytes[10];
}

function asTempAndRhAggregate(decoded, bytes) {
  decoded.AlarmMsgCount = bytes[2];
  decoded.BacklogMsgCount = ((bytes[3] << 8) >>> 0) + bytes[4];

  switch (bytes[4]) {
    case 0:
      decoded.BatteryCapacity = "0-5%";
      break;
    case 1:
      decoded.BatteryCapacity = "5-20%";
      break;
    case 2:
      decoded.BatteryCapacity = "20-40%";
      break;
    case 3:
      decoded.BatteryCapacity = "40-60%";
      break;
    case 4:
      decoded.BatteryCapacity = "60-80%";
      break;
    case 5:
      decoded.BatteryCapacity = "80-100%";
      break;
    default:
      decoded.BatteryCapacity = "This value is not supported";
  }

  var numberOfReadings = bytes[5];

  // 2015-01-01T00:00:00+00:00 = 1420070400

  var timestamp =
    ((bytes[6] << 24) >>> 0) +
    ((bytes[7] << 16) >>> 0) +
    ((bytes[8] << 8) >>> 0) +
    bytes[9];
  timestamp = timestamp + 1420070400; // 1 Jan 2015 to 1 Jan 1970
  //decoded.Time = new Date(timestamp*1000);
  decoded.timestamp = timestamp;

  decoded.readings = [];
  for (var i = 0; i < numberOfReadings; i++) {
    var offset = 10 + i * 4;
    var sample = {};

    if (offset + 1 > bytes.length - 1) continue;
    sample["Humidity"] = bytes[offset] / 100.0 + bytes[offset + 1];
    if (offset + 3 > bytes.length - 1) continue;
    sample["Temperature"] = convertTempUnits(
      bytes[offset + 2],
      bytes[offset + 3]
    );

    decoded.readings.push(sample);
  }
}

function asBacklogTempAndRh(decoded, bytes) {
  var timestamp =
    ((bytes[2] << 24) >>> 0) +
    ((bytes[3] << 16) >>> 0) +
    ((bytes[4] << 8) >>> 0) +
    bytes[5];
  timestamp = timestamp + 1420070400; // 1 Jan 2015 to 1 Jan 1970
  //decoded.Time = new Date(timestamp*1000);
  decoded.timestamp = timestamp;

  decoded.Humidity = bytes[6] / 100.0 + bytes[7];
  decoded.Temperature = convertTempUnits(bytes[8], bytes[9]);
}

function asBacklogTempAndRhAggregate(decoded, bytes) {
  var numberOfReadings = bytes[2];

  // 2015-01-01T00:00:00+00:00 = 1420070400

  decoded.readings = [];
  for (var i = 0; i < numberOfReadings; i++) {
    var offset = 3 + i * 8;
    var sample = {};

    if (offset + 3 > bytes.length - 1) continue;
    var timestamp =
      ((bytes[offset] << 24) >>> 0) +
      ((bytes[offset + 1] << 16) >>> 0) +
      ((bytes[offset + 2] << 8) >>> 0) +
      bytes[offset + 3];
    timestamp = timestamp + 1420070400; // 1 Jan 2015 to 1 Jan 1970
    //decoded.Time = new Date(timestamp*1000);
    sample["timestamp"] = timestamp;

    if (offset + 5 > bytes.length - 1) continue;
    sample["Humidity"] = bytes[offset + 4] / 100.0 + bytes[offset + 5];
    if (offset + 7 > bytes.length - 1) continue;
    sample["Temperature"] = convertTempUnits(
      bytes[offset + 6],
      bytes[offset + 7]
    );

    decoded.readings.push(sample);
  }
}

function asSensorConfigSimple(decoded, bytes) {
  switch (bytes[2]) {
    case 1:
      decoded.BatteryType = "Zinc-Manganese Dioxide (Alkaline).";
      break;
    case 2:
      decoded.BatteryType = "Lithium/Iron Disulfide (Primary Lithium).";
      break;
    default:
      decoded.BatteryType = "Unknown battery type";
  }
  decoded.ReadSensorPeriod = ((bytes[3] << 8) >>> 0) + bytes[4];
  decoded.SensorAggregate = bytes[5];
  decoded.TempAlarmEnabled = bytes[6] == 1;
  decoded.HumidityAlarmEnabled = bytes[7] == 1;
}

function asSensorConfigAdvanced(decoded, bytes) {
  switch (bytes[2]) {
    case 1:
      decoded.BatteryType = "Zinc-Manganese Dioxide (Alkaline).";
      break;
    case 2:
      decoded.BatteryType = "Lithium/Iron Disulfide (Primary Lithium).";
      break;
    default:
      decoded.BatteryType = "Unknown battery type";
  }
  decoded.ReadSensorPeriod = ((bytes[3] << 8) >>> 0) + bytes[4];
  decoded.SensorAggregate = bytes[5];
  decoded.TempAlarmsEnabled = bytes[6] == 1;
  decoded.HumidityAlarmsEnabled = bytes[7] == 1;
  decoded.TempAlarmLimitLow = bytes[8];
  decoded.TempAlarmLimitHigh = bytes[9];
  decoded.HumidityAlarmLimitLow = bytes[10];
  decoded.HumidityAlarmLimitHigh = bytes[11];
  decoded.LED_BLE = ((bytes[12] << 8) >>> 0) + bytes[13];
  decoded.LED_Heartbeat = ((bytes[14] << 8) >>> 0) + bytes[15];
}

function asFwVersion(decoded, bytes) {
  decoded.VersionYear = bytes[2];
  decoded.VersionMonth = bytes[3];
  decoded.VersionDay = bytes[4];
  decoded.VersionMajor = bytes[5];
  decoded.VersionMinor = bytes[6];
  decoded.PartNumber =
    ((bytes[7] << 24) >>> 0) +
    ((bytes[8] << 16) >>> 0) +
    ((bytes[9] << 8) >>> 0) +
    bytes[10];
}

function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  var decoded = {};

  decoded.MsgType = bytes[0];
  options = bytes[1];

  decoded.Options = "";
  if (options & 0x01) {
    decoded.Options += "Server response is LoRa ack. ";
  }
  if (options & 0x02) {
    decoded.Options +=
      "Inform Server to send UT to sensor in the next downlink transmission. ";
  }
  if (options & 0x04) {
    decoded.Options += "Sensor configuration error. ";
  }
  if (options & 0x08) {
    decoded.Options += "Sensor has alarm condition. ";
  }

  decoded.Options = decoded.Options.trim();
  if (decoded.Options === "") {
    delete decoded.Options;
  }

  switch (decoded.MsgType) {
    case 0x01:
      asTempAndRh(decoded, bytes);
      break;
    case 0x2:
      asTempAndRhAggregate(decoded, bytes);
      break;
    case 0x03:
      asBacklogTempAndRh(decoded, bytes);
      break;
    case 0x04:
      asBacklogTempAndRhAggregate(decoded, bytes);
      break;
    case 0x05:
      asSensorConfigSimple(decoded, bytes);
      break;
    case 0x06:
      asSensorConfigAdvanced(decoded, bytes);
      break;
    case 0x07:
      asFwVersion(decoded, bytes);
      break;
  }

  return decoded;
}

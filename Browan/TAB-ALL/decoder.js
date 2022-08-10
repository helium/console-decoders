function Decoder(bytes, port) {
  // create the object to collect the decoded for returning the decoded payload
  var decoded = {
    bytes: bytes, // original payload
    port: port, // lorawan port
  };

  // Every device transmits the battery status and the temperature
  // Battery measurement
  battery = bytes[1] & 0x0f;
  battery = (25 + battery) / 10;
  capacity = bytes[1] >> 4;
  capacity = (capacity / 15) * 100;

  // Temperature measurement
  temperature = bytes[2] & 0x7f;
  temperature = temperature - 32;

  decoded.battery = battery;
  decoded.capacity = capacity;
  decoded.temperature = temperature;

  // depending on the lorawan port we know which tabs sensor is delivering the decoded
  if (port === 100) {
    // Door & Window Sensor
    // Time measurement
    openingStatusTime = (bytes[4] << 8) | bytes[3];

    // Count measurement
    openingStatusCount = (bytes[7] << 16) | (bytes[6] << 8) | bytes[5];

    // Status measurement
    openingStatus = bytes[0] & 0x1;
    if (openingStatus === 1) {
      openingStatusOpen = true;
    } else {
      openingStatusOpen = false;
    }

    decoded.openingStatusTime = openingStatusTime;
    decoded.openingStatusCount = openingStatusCount;
    decoded.openingStatusOpen = openingStatusOpen;
  } else if (port === 102) {
    // Motion Sensor (PIR)
    // Time measurement
    roomStatusTime = (bytes[4] << 8) | bytes[3];

    // Count measurement
    roomStatusCount = (bytes[7] << 16) | (bytes[6] << 8) | bytes[5];

    // Status measurement
    roomStatus = bytes[0] & 0x1;
    if (roomStatus === 1) {
      roomStatusOccupied = true;
    } else {
      roomStatusOccupied = false;
    }

    decoded.roomStatusTime = roomStatusTime;
    decoded.roomStatusCount = roomStatusCount;
    decoded.roomStatusOccupied = roomStatusOccupied;
  } else if (port === 103) {
    // Healthy Home Sensor IAQ & Temperature & Humidity Sensor
    if (bytes.length > 8) {
      // Healthy Home Sensor IAQ
      // VOC Measurement
      voc = (bytes[7] << 8) | bytes[6];
      if (voc === 65535) {
        vocError = true;
      } else {
        vocError = false;
      }

      // CO2 Measurement
      co2 = (bytes[5] << 8) | bytes[4];
      if (co2 === 65535) {
        co2Error = true;
      } else {
        co2Error = false;
      }

      // IAQ Measurement
      iaq = (bytes[9] << 9) | bytes[8];

      // Environment temperature measurement
      temperatureEnvironment = bytes[10] & 0x7f;
      temperatureEnvironment = temperatureEnvironment - 32;

      decoded.voc = voc;
      decoded.vocError = vocError;
      decoded.co2 = co2;
      decoded.co2Error = co2Error;
      decoded.iaq = iaq;
      decoded.temperatureEnvironment = temperatureEnvironment;
    }

    // Humidity Measurement
    humidity = bytes[3] &= 0x7f;
    if (humidity === 127) {
      humidityError = true;
    } else {
      humidityError = false;
    }

    decoded.humidity = humidity;
    decoded.humidityError = humidityError;
  } else if (port === 104) {
    // Ambient Light Sensor
    // Lux measurement
    lux = (bytes[5] << 16) | (bytes[4] << 8) | bytes[3];
    lux = lux / 100;

    decoded.lux = lux;
  } else if (port === 105) {
    // Sound Level Sensor
    // Sound Level measurement
    soundLevel = bytes[3] & 0xff;
    if (soundLevel === 255) {
      soundLevelError = true;
    } else {
      soundLevelError = false;
    }

    decoded.soundLevel = soundLevel;
    decoded.soundLevelError = soundLevelError;
  } else if (port === 106) {
    // Water Leak Sensor
    // water leakage status bit
    waterLeakageBit = bytes[0] & 0x01;
    if (waterLeakageBit === 1) {
      waterLeakage = true;
    } else {
      waterLeakage = false;
    }

    // Environment temperature measurement
    temperatureEnvironment = bytes[4] & 0x7f;
    temperatureEnvironment = temperatureEnvironment - 32;

    // Humidity Measurement
    humidity = bytes[3] &= 0x7f;
    if (humidity === 127) {
      humidityError = true;
    } else {
      humidityError = false;
    }

    decoded.waterLeakage = waterLeakage;
    decoded.temperatureEnvironment = temperatureEnvironment;
    decoded.humidity = humidity;
    decoded.humidityError = humidityError;
  } else if (port === 136) {
    // Object Locator
    // GNSS Fix?
    if ((bytes[0] & 0x8) === 0) {
      positionGnssFix = true;
    } else {
      positionGnssFix = false;
    }

    // Accuracy Measurement
    positionAccuracy = bytes[10] >> 5;
    positionAccuracy = Math.pow(2, parseInt(positionAccuracy) + 2);

    // Mask off end of accuracy byte, so longitude doesn't get affected
    bytes[10] &= 0x1f;

    if ((bytes[10] & (1 << 4)) !== 0) {
      bytes[10] |= 0xe0;
    }

    // Mask off end of latitude byte, RFU
    bytes[6] &= 0x0f;

    // Latitude and Longitude Measurement
    positionLatitude =
      (bytes[6] << 24) | (bytes[5] << 16) | (bytes[4] << 8) | bytes[3];
    positionLongitude =
      (bytes[10] << 24) | (bytes[9] << 16) | (bytes[8] << 8) | bytes[7];
    positionLatitude = positionLatitude / 1000000;
    positionLongitude = positionLongitude / 1000000;

    decoded.positionGnssFix = positionGnssFix;
    decoded.positionLatitude = positionLatitude;
    decoded.positionLongitude = positionLongitude;
    decoded.positionAccuracy = positionAccuracy;
  }

  return decoded;
}

function Decoder(bytes, port) {
  //Payload Formats of LHT65 Deveice
  var exti = bytes[8] & 0x01 ? "TRUE" : "FALSE"; //

  return {
    //External sensor
    Ext_sensor: {
      "0": "No external sensor",
      "1": "Temperature Sensor",
      "2": "Door Sensor",
      "3": "Water Leak Sensor",
    }[bytes[6] & 0xff],

    //Battery,units:V
    BatV: (((bytes[0] << 8) | bytes[1]) & 0x3fff) / 1000,

    //SHT20,temperature,units:â„ƒ
    TempC_SHT: ((((bytes[2] << 24) >> 16) | bytes[3]) / 100).toFixed(2),

    //SHT20,Humidity,units:%
    Hum_SHT: (((bytes[4] << 8) | bytes[5]) / 10).toFixed(1),

    //DS18B20,temperature,units:â„ƒ
    TempC_DS: {
      "1": ((((bytes[7] << 24) >> 16) | bytes[8]) / 100).toFixed(2),
    }[bytes[6] & 0xff],

    //status of door sensor
    Door_status: {
      "2": bytes[7] & 0x01 ? "OPEN" : "CLOSE",
    }[bytes[6] & 0xff],

    //status of water sensor
    Water_status: {
      "3": bytes[7] & 0x01 ? "NORMAL" : "LEAK",
    }[bytes[6] & 0xff],

    //status of exti_trigger
    EXTI_Trigger: {
      "2": exti,
      "3": exti,
    }[bytes[6] & 0xff],
  };
}

function Decoder(bytes, port) {
  var result = {};
  var transformers = {};

  if (port == 33) {
    transformers = {
      temperature: function transform(bytes) {
        value = bytes[0] * 256 + bytes[1];
        if (value >= 32768) value = value - 65536;
        return value / 100.0;
      },
      humidity: function transform(bytes) {
        return (bytes[0] * 256 + bytes[1]) / 100.0;
      },
      pressure: function transform(bytes) {
        return (bytes[0] * 256 + bytes[1]) / 10.0;
      },
      altitude: function transform(bytes) {
        return (bytes[0] * 256 + bytes[1]) / 10.0;
      },
      vbattery: function transform(bytes) {
        return (bytes[0] * 256 + bytes[1]) / 1000.0;
      },
    };

    result["temperature"] = {
      value: transformers["temperature"](bytes.slice(0, 2)),
      uom: "Celsius",
    };

    result["humidity"] = {
      value: transformers["humidity"](bytes.slice(2, 4)),
      uom: "Percent",
    };

    result["pressure"] = {
      value: transformers["pressure"](bytes.slice(4, 6)),
      uom: "hPa",
    };

    result["altitude"] = {
      value: transformers["altitude"](bytes.slice(6, 8)),
      uom: "Meter",
    };

    result["vbattery"] = {
      value: transformers["vbattery"](bytes.slice(8, 10)),
      uom: "Volt",
    };
  }

  return result;
}

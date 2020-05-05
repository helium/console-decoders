function Decode(fPort, bytes) {
  var ports = fPort;
  var v4 = toHexString(bytes);
  var v4_1 = v4.substr(10, 2);
  var v4_2 = v4.substr(0, 2);
  var v4_3 = v4.substr(0, 1);
  var v3 = v4.substr(8, 1);
  var length = v4.length;
  var battery;
  var Tamper;
  var Valve;
  var status_v4;
  var Cable_v4;
  var conf_p;
  var conf_s;
  var unit1;
  var time1;
  var unit2;
  var time2;
  var temperature;
  var hygrometry;
  var status;
  var DI_0;
  var DI_1;
  var Leakage;
  var Fraud;
  var clas;
  var power;
  var t;
  var t1;
  // Battery operated V3 Old
  if (v4_3 == "3") {
    var msg0 = String.fromCharCode.apply(null, bytes);
    var bat0 = msg0.substr(0, 4);
    battery = Math.round((bat0 - 2000) / 16);
    if (length == 10) {
      var st0 = msg0.substr(4, 1);
      var sta0 = dec_to_bho(st0, "B");
      status = pad(sta0, 8);
      Valve = status.substr(7, 1);
      Tamper = status.substr(6, 1);
    }
  }
  // Battery operated V3 & V4 & Class A
  if (v4_3 == "3") {
    var msg = String.fromCharCode.apply(null, bytes);
    var bat = msg.substr(0, 4);
    battery = Math.round((bat - 2000) / 16);
    if (length >= 10) {
      var st = msg.substr(4, 1);
      var sta = dec_to_bho(st, "B");
      status = pad(sta, 8);
      Valve = status.substr(7, 1);
      Tamper = status.substr(6, 1);
    }
    var st_1 = v4.substr(8, 2);
    t = st_1.substr(0, 1) - 3;
    t1 = st_1.substr(1, 1);
    var st1 = t + t1;
    var st01 = hex2bin(st1);
    status = pad(st01, 8);
    Valve = status.substr(7, 1);
    Tamper = status.substr(6, 1);
    Cable = status.substr(5, 1);
    DI_0 = status.substr(4, 1);
    DI_1 = status.substr(3, 1);
    Leakage = status.substr(2, 1);
    Fraud = status.substr(1, 1);
    conf_p = parseInt(msg.substr(6, 2), 16);
    conf_s = msg.substr(8, 2);
    unit1 = msg.substr(8, 2);
    time1 = msg.substr(10, 2);
    unit2 = msg.substr(12, 2);
    time2 = msg.substr(14, 2);
    var T_H = v4.substr(12, 8);
    var temp = T_H.substr(0, 4);
    var box_temp = parseInt(temp, 16);
    temperature = (box_temp / 65536) * 165 - 40;
    var hum = T_H.substr(4, 8);
    var box_hum = parseInt(hum, 16);
    hygrometry = (box_hum / 65536) * 100;
  }
  // Externally power V4 & Class variation
  if (v4_3 != "3" || v4_3 != "B" || v4_3 != "b") {
    var msg1 = String.fromCharCode.apply(1, bytes);
    var st2 = hex2bin(v4_2);
    clas = st2.substr(0, 1);
    power = st2.substr(1, 1);
    var st_3 = v4.substr(8, 2);
    t = st_3.substr(0, 1) - 3;
    t1 = st_3.substr(1, 1);
    var st3 = t + t1;
    var st02 = hex2bin(st3);
    status = pad(st02, 8);
    Valve = status.substr(7, 1);
    Tamper = status.substr(6, 1);
    Cable = status.substr(5, 1);
    DI_0 = status.substr(4, 1);
    DI_1 = status.substr(3, 1);
    Leakage = status.substr(2, 1);
    Fraud = status.substr(1, 1);
    conf_p = parseInt(msg1.substr(6, 2), 16);
    conf_s = msg1.substr(8, 2);
    unit1 = msg1.substr(8, 2);
    time1 = msg1.substr(10, 2);
    unit2 = msg1.substr(12, 2);
    time2 = msg1.substr(14, 2);
    var T_H1 = v4.substr(12, 8);
    var temp1 = T_H1.substr(0, 4);
    var box_temp1 = parseInt(temp1, 16);
    temperature = (box_temp1 / 65536) * 165 - 40;
    var hum1 = T_H1.substr(4, 8);
    var box_hum1 = parseInt(hum1, 16);
    hygrometry = (box_hum1 / 65536) * 100;
  }
  // Battery operated V4 & Class variation
  if (v4_3 == "B" || v4_3 == "b") {
    var msg2 = String.fromCharCode.apply(1, bytes);
    var st4 = hex2bin(v4_2);
    clas = st4.substr(0, 1);
    power = st4.substr(1, 1);
    var b = v4.substr(1, 1);
    var b1 = msg2.substr(2, 3);
    var bat1 = b.concat(b1);
    battery = Math.round((bat1 - 2000) / 16);
    var st_5 = v4.substr(8, 2);
    t = st_5.substr(0, 1) - 3;
    t1 = st_5.substr(1, 1);
    var st5 = t + t1;
    var st03 = hex2bin(st5);
    status = pad(st03, 8);
    Valve = status.substr(7, 1);
    Tamper = status.substr(6, 1);
    Cable = status.substr(5, 1);
    DI_0 = status.substr(4, 1);
    DI_1 = status.substr(3, 1);
    Leakage = status.substr(2, 1);
    Fraud = status.substr(1, 1);
    conf_p = parseInt(msg2.substr(7, 2), 16);
    conf_s = msg2.substr(9, 2);
    unit1 = msg2.substr(9, 2);
    time1 = msg2.substr(11, 2);
    unit2 = msg2.substr(13, 2);
    time2 = msg2.substr(15, 2);
    var T_H2 = v4.substr(12, 8);
    var temp2 = T_H2.substr(0, 4);
    var box_temp2 = parseInt(temp2, 16);
    temperature = (box_temp2 / 65536) * 165 - 40;
    var hum2 = T_H2.substr(4, 8);
    var box_hum2 = parseInt(hum2, 16);
    hygrometry = (box_hum2 / 65536) * 100;
  }

  function pad(num, len) {
    return ("00000000" + num).substr(-len);
  }
  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }
  function dec_to_bho(n, base) {
    if (n < 0) {
      n = 0xffffffff + n + 1;
    }
    switch (base) {
      case "B":
        return parseInt(n, 10).toString(2);
        break;
      case "H":
        return parseInt(n, 10).toString(16);
        break;
      case "O":
        return parseInt(n, 10).toString(8);
        break;
      default:
        return "Wrong input.........";
    }
  }
  function ascii_to_hexa(str) {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    return arr1.join("");
  }
  function toHexString(bytes) {
    return bytes
      .map(function (byte) {
        return ("00" + (byte & 0xff).toString(16)).slice(-2);
      })
      .join("");
  }
  function hex2bin(hex) {
    return ("00000000" + parseInt(hex, 16).toString(2)).substr(-8);
  }

  if (v4_1 === "40") {
    if (
      conf_p === 14 ||
      conf_p === 15 ||
      conf_p === 16 ||
      conf_p === 17 ||
      conf_p === 18 ||
      conf_p === 19 ||
      conf_p === 20
    ) {
      return {
        Port: ports,
        Battery: battery,
        Valve: Valve,
        Tamper: Tamper,
        Cable: Cable,
        DI_0: DI_0,
        DI_1: DI_1,
        Leakage: Leakage,
        Fraud: Fraud,
        Class: clas,
        Power: power,
        Schl_Port: conf_p || 0,
        Schl_status: conf_s || 0,
      };
    }
    if (conf_p === 21) {
      return {
        Port: ports,
        Battery: battery,
        Valve: Valve,
        Tamper: Tamper,
        Cable: Cable,
        DI_0: DI_0,
        DI_1: DI_1,
        Leakage: Leakage,
        Fraud: Fraud,
        Class: clas,
        Power: power,
        Schl_status_Port: conf_p || 0,
        Schl_status_ack: conf_s || 0,
      };
    }
    if (conf_p === 12 || conf_p === 13) {
      return {
        Port: ports,
        Battery: battery,
        Valve: Valve,
        Tamper: Tamper,
        Cable: Cable,
        DI_0: DI_0,
        DI_1: DI_1,
        Leakage: Leakage,
        Fraud: Fraud,
        Class: clas,
        Power: power,
        RTC_Port: conf_p || 0,
        RTC_status: conf_s || 0,
      };
    }
    if (conf_p === 9) {
      return {
        Port: ports,
        Battery: battery,
        Valve: Valve,
        Tamper: Tamper,
        Cable: Cable,
        DI_0: DI_0,
        DI_1: DI_1,
        Leakage: Leakage,
        Fraud: Fraud,
        Class: clas,
        Power: power,
        Class_Port: conf_p || 0,
        Class_status: conf_s || 0,
      };
    }
    if (conf_p === 22) {
      return {
        Port: ports,
        Battery: battery,
        Valve: Valve,
        Tamper: Tamper,
        Cable: Cable,
        DI_0: DI_0,
        DI_1: DI_1,
        Leakage: Leakage,
        Fraud: Fraud,
        Class: clas,
        Power: power,
        magnet_Port: conf_p || 0,
        magnet_status: conf_s || 0,
      };
    }
  }
  if (v4_1 === "23") {
    return {
      Port: ports,
      Status: status,
      Battery: battery,
      Valve: Valve,
      Tamper: Tamper,
      Cable: Cable,
      DI_0: DI_0,
      DI_1: DI_1,
      Leakage: Leakage,
      Fraud: Fraud,
      Class: clas,
      Power: power,
      Temperature: roundToTwo(temperature),
      Hygrometry: roundToTwo(hygrometry),
    };
  } else {
    return {
      Port: ports,
      Battery: battery,
      Valve: Valve,
      Tamper: Tamper,
    };
  }
}

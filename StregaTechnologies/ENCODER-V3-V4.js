function Encoder(object, port) {
  function pad(num, len) {
    return ("00" + num).substr(-len);
  }
  function pad1(num, len) {
    return ("000" + num).substr(-len);
  }
  function pad2(num, len) {
    return ("0000" + num).substr(-len);
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
  var bytes = [];
  var ports = port;
  var Schl_on = 10;
  var Schl_off = 00;
  var Schl_m = 0;
  // open and close command
  if (port === 1) {
    bytes[0] = object.payload;
    return bytes;
  }
  // UL frequency time
  if (port === 11) {
    if (object.unit1 === 1) {
      bytes[0] = 128;
    } else {
      bytes[0] = 0;
    }
    bytes[1] = object.time1;
    if (object.unit2 === 1) {
      bytes[2] = 128;
    } else {
      bytes[2] = 0;
    }
    bytes[3] = object.time2;
    return bytes;
  }
  // Schedulers status setting
  if (port === 21) {
    bytes[0] = object.Schl_status;
    return bytes;
  }
  // Synchronizing RTC
  if (port === 13) {
    bytes[0] = object.Sync_RTC;
    return bytes;
  }
  if (port === 12) {
    var t0 = object.Sync_RTC;
    bytes[0] = parseInt(t0.substr(0, 1));
    bytes[1] = parseInt(t0.substr(1, 1));
    bytes[2] = parseInt(t0.substr(2, 1));
    bytes[3] = parseInt(t0.substr(3, 1));
    bytes[4] = parseInt(t0.substr(4, 1));
    bytes[5] = parseInt(t0.substr(5, 1));
    bytes[6] = parseInt(t0.substr(6, 1));
    bytes[7] = parseInt(t0.substr(7, 1));
    bytes[8] = parseInt(t0.substr(8, 1));
    bytes[9] = parseInt(t0.substr(9, 1));
    bytes[10] = parseInt(t0.substr(10, 1));
    bytes[11] = parseInt(t0.substr(11, 1));
    bytes[12] = parseInt(t0.substr(12, 1));
    bytes[13] = parseInt(t0.substr(13, 1));
    return bytes;
  }
  // Schedulers setting
  if (
    port === 14 ||
    port === 15 ||
    port === 16 ||
    port === 17 ||
    port === 18 ||
    port === 19 ||
    port === 20
  ) {
    bytes[0] = 255;
    if (object.schl1h_on === 255) {
      bytes[1] = 255;
    } else {
      var a = object.schl1h_on;
      var b = pad(a, 2);
      var c = b.substr(0, 1);
      var d = b.substr(1, 1);
      var e = pad(dec_to_bho(c, "B"), 2);
      var f = pad2(dec_to_bho(d, "B"), 4);
      var g = parseInt(Schl_on + e + f, 2);
      bytes[1] = g;
    }
    if (object.schl1m_on === 255) {
      bytes[2] = 255;
    } else {
      var a1 = object.schl1m_on;
      var b1 = pad(a1, 2);
      var c1 = b1.substr(0, 1);
      var d1 = b1.substr(1, 1);
      var e1 = pad1(dec_to_bho(c1, "B"), 3);
      var f1 = pad2(dec_to_bho(d1, "B"), 4);
      var g1 = parseInt(Schl_m + e1 + f1, 2);
      bytes[2] = g1;
    }
    bytes[3] = 255;
    if (object.schl1h_off === 255) {
      bytes[4] = 255;
    } else {
      var a2 = object.schl1h_off;
      var b2 = pad(a2, 2);
      var c2 = b2.substr(0, 1);
      var d2 = b2.substr(1, 1);
      var e2 = pad(dec_to_bho(c2, "B"), 2);
      var f2 = pad2(dec_to_bho(d2, "B"), 4);
      var g2 = parseInt(Schl_off + e2 + f2, 2);
      bytes[4] = g2;
    }
    if (object.schl1m_off === 255) {
      bytes[5] = 255;
    } else {
      var a3 = object.schl1m_off;
      var b3 = pad(a3, 2);
      var c3 = b3.substr(0, 1);
      var d3 = b3.substr(1, 1);
      var e3 = pad1(dec_to_bho(c3, "B"), 3);
      var f3 = pad2(dec_to_bho(d3, "B"), 4);
      var g3 = parseInt(Schl_m + e3 + f3, 2);
      bytes[5] = g3;
    }
    bytes[6] = 255;
    if (object.schl2h_on === 255) {
      bytes[7] = 255;
    } else {
      var a4 = object.schl2h_on;
      var b4 = pad(a4, 2);
      var c4 = b4.substr(0, 1);
      var d4 = b4.substr(1, 1);
      var e4 = pad(dec_to_bho(c4, "B"), 2);
      var f4 = pad2(dec_to_bho(d4, "B"), 4);
      var g4 = parseInt(Schl_on + e4 + f4, 2);
      bytes[7] = g4;
    }
    if (object.schl2m_on === 255) {
      bytes[8] = 255;
    } else {
      var a5 = object.schl2m_on;
      var b5 = pad(a5, 2);
      var c5 = b5.substr(0, 1);
      var d5 = b5.substr(1, 1);
      var e5 = pad1(dec_to_bho(c5, "B"), 3);
      var f5 = pad2(dec_to_bho(d5, "B"), 4);
      var g5 = parseInt(Schl_m + e5 + f5, 2);
      bytes[8] = g5;
    }
    bytes[9] = 255;
    if (object.schl2h_off === 255) {
      bytes[10] = 255;
    } else {
      var a6 = object.schl2h_off;
      var b6 = pad(a6, 2);
      var c6 = b6.substr(0, 1);
      var d6 = b6.substr(1, 1);
      var e6 = pad(dec_to_bho(c6, "B"), 2);
      var f6 = pad2(dec_to_bho(d6, "B"), 4);
      var g6 = parseInt(Schl_off + e6 + f6, 2);
      bytes[10] = g6;
    }
    if (object.schl2m_off === 255) {
      bytes[11] = 255;
    } else {
      var a7 = object.schl2m_off;
      var b7 = pad(a7, 2);
      var c7 = b7.substr(0, 1);
      var d7 = b7.substr(1, 1);
      var e7 = pad1(dec_to_bho(c7, "B"), 3);
      var f7 = pad2(dec_to_bho(d7, "B"), 4);
      var g7 = parseInt(Schl_m + e7 + f7, 2);
      bytes[11] = g7;
    }
    bytes[12] = 255;
    if (object.schl3h_on === 255) {
      bytes[13] = 255;
    } else {
      var a8 = object.schl3h_on;
      var b8 = pad(a8, 2);
      var c8 = b8.substr(0, 1);
      var d8 = b8.substr(1, 1);
      var e8 = pad(dec_to_bho(c8, "B"), 2);
      var f8 = pad2(dec_to_bho(d8, "B"), 4);
      var g8 = parseInt(Schl_on + e8 + f8, 2);
      bytes[13] = g8;
    }
    if (object.schl3m_on === 255) {
      bytes[14] = 255;
    } else {
      var a9 = object.schl3m_on;
      var b9 = pad(a9, 2);
      var c9 = b9.substr(0, 1);
      var d9 = b9.substr(1, 1);
      var e9 = pad1(dec_to_bho(c9, "B"), 3);
      var f9 = pad2(dec_to_bho(d9, "B"), 4);
      var g9 = parseInt(Schl_m + e9 + f9, 2);
      bytes[14] = g9;
    }
    bytes[15] = 255;
    if (object.schl3h_off === 255) {
      bytes[16] = 255;
    } else {
      var a10 = object.schl3h_off;
      var b10 = pad(a10, 2);
      var c10 = b10.substr(0, 1);
      var d10 = b10.substr(1, 1);
      var e10 = pad(dec_to_bho(c10, "B"), 2);
      var f10 = pad2(dec_to_bho(d10, "B"), 4);
      var g10 = parseInt(Schl_off + e10 + f10, 2);
      bytes[16] = g10;
    }
    if (object.schl3m_off === 255) {
      bytes[17] = 255;
    } else {
      var a11 = object.schl3m_off;
      var b11 = pad(a11, 2);
      var c11 = b11.substr(0, 1);
      var d11 = b11.substr(1, 1);
      var e11 = pad1(dec_to_bho(c11, "B"), 3);
      var f11 = pad2(dec_to_bho(d11, "B"), 4);
      var g11 = parseInt(Schl_m + e11 + f11, 2);
      bytes[17] = g11;
    }
    bytes[18] = 255;
    if (object.schl4h_on === 255) {
      bytes[19] = 255;
    } else {
      var a12 = object.schl4h_on;
      var b12 = pad(a12, 2);
      var c12 = b12.substr(0, 1);
      var d12 = b12.substr(1, 1);
      var e12 = pad(dec_to_bho(c12, "B"), 2);
      var f12 = pad2(dec_to_bho(d12, "B"), 4);
      var g12 = parseInt(Schl_on + e12 + f12, 2);
      bytes[19] = g12;
    }
    if (object.schl4m_on === 255) {
      bytes[20] = 255;
    } else {
      var a13 = object.schl4m_on;
      var b13 = pad(a13, 2);
      var c13 = b13.substr(0, 1);
      var d13 = b13.substr(1, 1);
      var e13 = pad1(dec_to_bho(c13, "B"), 3);
      var f13 = pad2(dec_to_bho(d13, "B"), 4);
      var g13 = parseInt(Schl_m + e13 + f13, 2);
      bytes[20] = g13;
    }
    bytes[21] = 255;
    if (object.schl4h_off === 255) {
      bytes[22] = 255;
    } else {
      var a14 = object.schl4h_off;
      var b14 = pad(a14, 2);
      var c14 = b14.substr(0, 1);
      var d14 = b14.substr(1, 1);
      var e14 = pad(dec_to_bho(c14, "B"), 2);
      var f14 = pad2(dec_to_bho(d14, "B"), 4);
      var g14 = parseInt(Schl_off + e14 + f14, 2);
      bytes[22] = g14;
    }
    if (object.schl4m_off === 255) {
      bytes[23] = 255;
    } else {
      var a15 = object.schl4m_off;
      var b15 = pad(a15, 2);
      var c15 = b15.substr(0, 1);
      var d15 = b15.substr(1, 1);
      var e15 = pad1(dec_to_bho(c15, "B"), 3);
      var f15 = pad2(dec_to_bho(d15, "B"), 4);
      var g15 = parseInt(Schl_m + e15 + f15, 2);
      bytes[23] = g15;
    }
    return bytes;
  }
}

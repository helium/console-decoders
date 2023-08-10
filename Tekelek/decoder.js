/*
    Please note this is a simplified version of the decoder.
    See the manual for the full specification.

    - Quick overview of the variables:

    Measurements uplink -> port 16
    ---------
    Example payload: 1000001800440BAA000000000000000000000000
    Decoded {
        ullage_cm: Defines the ullage reading in cms
        temp_C: Defines the temperature in °C
        src: Sonic Results Code (see manual)
        srssi: Sonic RSSI (see manual)
    }


    Status uplink -> port 48
    ---------
    Example payload: 300000010106360063006300040600181BAA
    Decoded {
        ullage_cm: Defines the ullage reading in cms
        temp_C: Defines the temperature in °C
        firmware: Defines the firmware revision
        contactReason: Defines last connection reason (see manual)
        lastReset: Defines the reason for the last reset (see manual)
        active: Defines active status
        bat_pct: Defines the remaining battery %
        txPeriod_h: Defines the schedule transmit period in hours
        sensorRSSI_dBm: Defines the sensor RSSI
        hw_id: hardware ID
    }
*/

function Decoder(bytes, port) {
    var decoded = {};
  
    if (port === 16) {
      let offset = 0;
      let ullage = (bytes[4] << 8) + bytes[5];
      let temp = bytes[6];
      if (temp > 50) {
        offset = 256;
      }
      let temperature = -(offset - temp);
      let src = bytes[7] >> 4;
      let srssi = bytes[7] & 0xF;
  
      decoded = {
        ullage_cm: ullage,
        temp_C: temperature,
        src: src,
        srssi: srssi,
      };
    } else if (port === 48) {
      let offset = 0;
      let ullage = (bytes[14] << 8) + bytes[15];
      let temp = bytes[16];
      if (temp > 50) {
        offset = 256;
      }
      let temperature = -(offset - temp);
      let hardware = bytes[3];
      let firmware = bytes[4] + "." + bytes[5];
      let reasonBytes = bytes[6];
      let contactReason = reasonBytes & 0x3;
      var contactReasonMsg = "";
      switch (contactReason) {
        case 0:
          contactReasonMsg = "Reset";
          break;
        case 1:
          contactReasonMsg = "Scheduled";
          break;
        case 2:
          contactReasonMsg = "Manual";
          break;
        case 3:
          contactReasonMsg = "Activation";
          break;
      }
      let lastReset = (reasonBytes >> 2) & 0x7;
      var lastResetMsg = "";
      switch (lastReset) {
        case 0:
          lastResetMsg = "Power on";
          break;
        case 1:
          lastResetMsg = "Brown out";
          break;
        case 2:
          lastResetMsg = "External";
          break;
        case 3:
          lastResetMsg = "Watchdog";
          break;
        case 4:
          lastResetMsg = "M3 lockup";
          break;
        case 5:
          lastResetMsg = "M3 system request";
          break;
        case 6:
          lastResetMsg = "EM4";
          break;
        case 7:
          lastResetMsg = "Backup mode";
          break;
      }
      let activeStatus = (reasonBytes >> 5) & 0x1;
      let battery = bytes[10];
      let txPeriod = bytes[13];
      let sensorRSSI = -bytes[8];
  
      decoded = {
        ullage_cm: ullage,
        temp_C: temperature,
        firmware: firmware,
        contactReason: contactReasonMsg,
        lastReset: lastResetMsg,
        active: activeStatus,
        bat_pct: battery,
        txPeriod_h: txPeriod,
        sensorRSSI_dBm: sensorRSSI,
        hw_id: hardware,
      };
    }
  
    return decoded;
  }
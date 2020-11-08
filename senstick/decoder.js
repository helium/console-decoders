/*
   _____                          __          _____                 __  _      __  
  / ___/___  ____  ________  ____/ /___ ____ / ___/___  ____  _____/ /_(_)____/ /__
  \__ \/ _ \/ __ \/ ___/ _ \/ __  / __ `/ _ \\__ \/ _ \/ __ \/ ___/ __/ / ___/ //_/
 ___/ /  __/ / / (__  )  __/ /_/ / /_/ /  __/__/ /  __/ / / (__  ) /_/ / /__/ ,<   
/____/\___/_/ /_/____/\___/\__,_/\__, /\___/____/\___/_/ /_/____/\__/_/\___/_/|_|  
                                /____/                                             

Senstick Microclimate - HWv2.2 FWv1.8

*/


function Decoder(bytes, port) {
  
  // If Config Packet
  if (bytes.length == 12) {
    
      var SendPeriod = (bytes[0] << 8) + bytes[1];
      var JoinRetries = (bytes[2] << 8) + bytes[3];
      var JoinRetryPeriod1 = (bytes[4] << 8) + bytes[5];
      var JoinRetryPeriod2 = (bytes[6] << 8) + bytes[7];      
      var EnableADR = bytes[8] >> 7;
      var DataRate = (bytes[8] >> 4) - 8*EnableADR;
      var AccEnabled = (bytes[8] >> 3) - 16*EnableADR - 2*DataRate; 
      var TempHumidityEnabled = (bytes[8] >> 2) - 32*EnableADR - 4*DataRate - 2*AccEnabled;
      var AirPressureEnabled = (bytes[8] >> 1) - 64*EnableADR - 8*DataRate - 4*AccEnabled - 2*TempHumidityEnabled;
      var VOCEnabled = bytes[8] - 128*EnableADR - 16*DataRate - 8*AccEnabled - 4*TempHumidityEnabled - 2*AirPressureEnabled;
      var AccThreshold = bytes[9];
      var PacketConformation = bytes[10];
      var FirmwareVersion = bytes[11]/10;      

    return {
      SendPeriod: SendPeriod,
      JoinRetries: JoinRetries,
      JoinRetryPeriod1: JoinRetryPeriod1,
      JoinRetryPeriod2: JoinRetryPeriod2,     
      EnableADR: EnableADR,
      DataRate: DataRate,
      AccEnabled: AccEnabled, 
      TempHumidityEnabled: TempHumidityEnabled,
      AirPressureEnabled: AirPressureEnabled,
      VOCEnabled: VOCEnabled,
      AccThreshold: AccThreshold,
      PacketConformation: PacketConformation,
      FirmwareVersion: FirmwareVersion

    };
  }  
  // If Data Packet
  else {
    
    // If Reduced Data Packet Format
    if (bytes.length == 8) {
  
      var S = bytes[0];
      var T = (bytes[1] << 8) + bytes[2];
      var H = (bytes[3] << 8) + bytes[4];
      var AP1 = bytes[5];
      var MOV = bytes[6];
      var BAT = bytes[7];  
      
      if (AP1 != 0) AP1 = AP1 + 845;
      
      return {
        Status: S,
        Temperature: sintToDec(T),
        Humidity: H / 100.0,
        AirPressure: AP1,
        Movement: MOV / 100,
        BatteryLevel: (BAT + 100) / 100
      };      
      
    }
    else {
      
      var S = bytes[0];
      var T = (bytes[1] << 8) + bytes[2];
      var H1 = (bytes[3] << 8) + bytes[4];
      var AP1 = bytes[5];
      var VOC = (bytes[6] << 8) + bytes[7];
      var H2 = (bytes[8] << 8) + bytes[9];
      var AP2 = bytes[10];  
      var MOV = bytes[11];
      var BAT = bytes[12];    
      
      if (AP1 != 0) AP1 = AP1 + 845;
      if (AP2 != 0) AP2 = AP2 + 845;      
      
      return {
        Status: S,
        Temperature: sintToDec(T),
        Humidity: H1 / 100.0,
        AirPressure: AP1,
        VOC: VOC * 135,
        Humidity2: H2 / 100.0,
        AirPressure2: AP2,
        Movement: MOV / 100,
        BatteryLevel: (BAT + 100) / 100
      };      
      
    }
    
  }
}

function sintToDec(T){
  if (T > 32767) {
    return ((T - 65536) / 100.0);
  }
  else {
    return (T / 100.0);
  }
}

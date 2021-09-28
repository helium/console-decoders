function Decoder(bytes, port) {
var mode=(bytes[6] & 0x7C)>>2;
var decode = {};

if(mode=='3')
{
  decode.Work_mode="DS18B20";
  decode.BatV=(bytes[0]<<8 | bytes[1])/1000;
  decode. ALARM_status=(bytes[6] & 0x01)? "TRUE":"FALSE";
  
  if((bytes[2]==0xff)&& (bytes[3]==0xff))
  {
    decode.Temp_Red="NULL";
  }
  else
  {
    decode.Temp_Red= parseFloat(((bytes[2]<<24>>16 | bytes[3])/10).toFixed(1));
  }

  if((bytes[7]==0xff)&& (bytes[8]==0xff))
  {
    decode.Temp_White="NULL";
  }
  else
  {
  	decode.Temp_White=parseFloat(((bytes[7]<<24>>16 | bytes[8])/10).toFixed(1));
  }
  
  if((bytes[9]==0xff)&& (bytes[10]==0xff))
  {
    decode.Temp_Black="NULL";
  }
  else
  {
  	decode.Temp_Black=parseFloat(((bytes[9]<<8 | bytes[10])/10) .toFixed(1)); 
  }
}
else if(mode=='31')
{
  decode.Work_mode="ALARM";
  decode.Temp_Red_MIN= bytes[4]<<24>>24;
  decode.Temp_Red_MAX= bytes[5]<<24>>24; 
  decode.Temp_White_MIN= bytes[7]<<24>>24;
  decode.Temp_White_MAX= bytes[8]<<24>>24; 
  decode.Temp_Black_MIN= bytes[9]<<24>>24;
  decode.Temp_Black_MAX= bytes[10]<<24>>24;  
}

  if(bytes.length==11)
  {
   return decode;
  }
}
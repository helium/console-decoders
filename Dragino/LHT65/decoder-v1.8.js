function str_pad(byte){
    var zero = '00';
    var hex= byte.toString(16);    
    var tmp  = 2-hex.length;
    return zero.substr(0,tmp) + hex + " ";
}

function Decoder(bytes, port) {
var Ext= bytes[6]&0x0F;
var poll_message_status=(bytes[6]&0x40)>>6;
var Connect=(bytes[6]&0x80)>>7;
var decode = {};

if(Ext==0x09)
{
  decode.TempC_DS=parseFloat(((bytes[0]<<24>>16 | bytes[1])/100).toFixed(2));
  decode.Bat_status=bytes[4]>>6;
}
else
{
  decode.BatV= ((bytes[0]<<8 | bytes[1]) & 0x3FFF)/1000;
  decode.Bat_status=bytes[0]>>6;
}

if(Ext!=0x0f)
{
  decode.TempC_SHT=parseFloat(((bytes[2]<<24>>16 | bytes[3])/100).toFixed(2));
  decode.Hum_SHT=parseFloat((((bytes[4]<<8 | bytes[5])&0xFFF)/10).toFixed(1));
}
if(Connect=='1')
{
  decode.No_connect="Sensor no connection";
}

if(Ext=='0')
{
  decode.Ext_sensor ="No external sensor";
}
else if(Ext=='1')
{
  decode.Ext_sensor ="Temperature Sensor";
  decode.TempC_DS=parseFloat(((bytes[7]<<24>>16 | bytes[8])/100).toFixed(2));
}
else if(Ext=='4')
{
  decode.Work_mode="Interrupt Sensor send";
  decode.Exti_pin_level=bytes[7] ? "High":"Low";  
  decode.Exti_status=bytes[8] ? "True":"False";
}
else if(Ext=='5')
{
  decode.Work_mode="Illumination Sensor";
  decode.ILL_lx=bytes[7]<<8 | bytes[8];
  
}
else if(Ext=='6')
{
  decode.Work_mode="ADC Sensor";
  decode.ADC_V=(bytes[7]<<8 | bytes[8])/1000;
}
else if(Ext=='7')
{
  decode.Work_mode="Interrupt Sensor count";
  decode.Exit_count=bytes[7]<<8 | bytes[8];
}
else if(Ext=='8')
{
  decode.Work_mode="Interrupt Sensor count";
  decode.Exit_count=bytes[7]<<24 | bytes[8]<<16 | bytes[9]<<8 | bytes[10];
}
else if(Ext=='9')
{
  decode.Work_mode="DS18B20 & timestamp";
  decode.Systimestamp=(bytes[7]<<24 | bytes[8]<<16 | bytes[9]<<8 | bytes[10] );
}
else if(Ext=='15')
{
  decode.Work_mode="DS18B20ID";
  decode.ID=str_pad(bytes[2])+str_pad(bytes[3])+str_pad(bytes[4])+str_pad(bytes[5])+str_pad(bytes[7])+str_pad(bytes[8])+str_pad(bytes[9])+str_pad(bytes[10]);
}

if(poll_message_status===0)
{
  if(bytes.length==11)
  {
    return decode;
  }
}

}
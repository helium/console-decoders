function datalog(i,bytes){
   var aa=(bytes[0+i]&0x02)?"TRUE":"FALSE"; 
   var bb=(bytes[0+i]&0x01)?"OPEN":"CLOSE";  
   var cc=(bytes[1+i]<<16 | bytes[2+i]<<8 | bytes[3+i]).toString(10);
   var dd=(bytes[4+i]<<16 | bytes[5+i]<<8 | bytes[6+i]).toString(10);
   var ee= getMyDate((bytes[7+i]<<24 | bytes[8+i]<<16 | bytes[9+i]<<8 | bytes[10+i]).toString(10));
   var string='['+aa+','+bb+','+cc+','+dd+','+ee+']'+',';  
   
   return string;
 }
 
 function getzf(c_num){ 
   if(parseInt(c_num) < 10)
     c_num = '0' + c_num; 
 
   return c_num; 
 }
 
 function getMyDate(str){ 
   var c_Date;
   if(str > 9999999999)
      c_Date = new Date(parseInt(str));
   else 
      c_Date = new Date(parseInt(str) * 1000);
   
   var c_Year = c_Date.getFullYear(), 
   c_Month = c_Date.getMonth()+1, 
   c_Day = c_Date.getDate(),
   c_Hour = c_Date.getHours(), 
   c_Min = c_Date.getMinutes(), 
   c_Sen = c_Date.getSeconds();
   var c_Time = c_Year +'-'+ getzf(c_Month) +'-'+ getzf(c_Day) +' '+ getzf(c_Hour) +':'+ getzf(c_Min) +':'+getzf(c_Sen); 
   
   return c_Time;
 }
 
 function Decoder(bytes, port) {
   if(port==0x02)
   { 
     var alarm=(bytes[0]&0x02)?"TRUE":"FALSE"; 
     var door_open_status=(bytes[0]&0x01)?"OPEN":"CLOSE";  
     var open_times=bytes[1]<<16 | bytes[2]<<8 | bytes[3];
     var open_duration=bytes[4]<<16 | bytes[5]<<8 | bytes[6];
     var data_time= getMyDate((bytes[7]<<24 | bytes[8]<<16 | bytes[9]<<8 | bytes[10]).toString(10));
     
     if(bytes.length==11)
     {
       return {
       ALARM:alarm,
       DOOR_OPEN_STATUS:door_open_status,
       DOOR_OPEN_TIMES:open_times,
       LAST_DOOR_OPEN_DURATION:open_duration,
       TIME:data_time
       }
     }
   }
   else if(port==0x03)
   {
     for(var i=0;i<bytes.length;i=i+11)
     {
       var data= datalog(i,bytes);
       if(i=='0')
         data_sum=data;
       else
         data_sum+=data;
     }
     return{
     DATALOG:data_sum
     }
   }
   else if(port==0x04)
   {
     var tdc= bytes[0]<<16 | bytes[1]<<8 | bytes[2];
     var disalarm= bytes[3]&0x01;
     var keep_status= bytes[4]&0x01;
     var keep_time= bytes[5]<<8 | bytes[6];
     
     return {
     TDC:tdc,
     DISALARM:disalarm,
     KEEP_STATUS:keep_status,
     KEEP_TIME:keep_time
     }
   }
   else if(port==0x05)
   {
     var sub_band;
     var freq_band;
     
     if(bytes[0]==0x0A)
       var sensor= "LDS03A";
       
     if(bytes[4]==0xff)
       sub_band="NULL";
     else
       sub_band=bytes[4];
     
     if(bytes[3]==0x01)
       freq_band="EU868";
     else if(bytes[3]==0x02)
       freq_band="US915";
     else if(bytes[3]==0x03)
       freq_band="IN865";
     else if(bytes[3]==0x04)
       freq_band="AU915";
     else if(bytes[3]==0x05)
       freq_band="KZ865";
     else if(bytes[3]==0x06)
       freq_band="RU864";
     else if(bytes[3]==0x07)
       freq_band="AS923";
     else if(bytes[3]==0x08)
       freq_band="AS923_1";
     else if(bytes[3]==0x09)
       freq_band="AS923_2";
     else if(bytes[3]==0x0A)
       freq_band="AS923_3";
     else if(bytes[3]==0x0B)
       freq_band="CN470";
     else if(bytes[3]==0x0C)
       freq_band="EU433";
     else if(bytes[3]==0x0D)
       freq_band="KR920";
     else if(bytes[3]==0x0E)
       freq_band="MA869";
       
     var firm_ver= (bytes[1]&0x0f)+'.'+(bytes[2]>>4&0x0f)+'.'+(bytes[2]&0x0f);
     var bat= (bytes[5]<<8 | bytes[6])/1000;
     
     return {
     SENSOR_MODEL:sensor,
     FIRMWARE_VERSION:firm_ver,
     FREQUENCY_BAND:freq_band,
     SUB_BAND:sub_band,
     BAT:bat,
     }
   }
 }
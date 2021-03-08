function Decoder(bytes, port) {
//Payload Formats of LHT65 Deveice
  return {
    
       //External sensor
       Ext_sensor:
       {
         "0":"No external sensor",
         "1":"Temperature Sensor",
         "4":"Interrupt Sensor send",
         "5":"Illumination Sensor",
         "6":"ADC Sensor",
         "7":"Interrupt Sensor count",
       }[bytes[6]&0x7F],
       
       //Battery,units:V
       BatV:((bytes[0]<<8 | bytes[1]) & 0x3FFF)/1000,
       
       //SHT20,temperature,units:â„ƒ
       TempC_SHT:((bytes[2]<<24>>16 | bytes[3])/100).toFixed(2),
       
       //SHT20,Humidity,units:%
       Hum_SHT:((bytes[4]<<8 | bytes[5])/10).toFixed(1),
       
       //DS18B20,temperature,units:â„ƒ
       TempC_DS:
       {
         "1":((bytes[7]<<24>>16 | bytes[8])/100).toFixed(2),
       }[bytes[6]&0xFF],       
       
       //Exti pin level,PA4
       Exti_pin_level:
       {
         "4":bytes[7] ? "High":"Low",
       }[bytes[6]&0x7F], 
       
       //Exit pin status,PA4
       Exti_status:
       {
         "4":bytes[8] ? "True":"False",
       }[bytes[6]&0x7F],    
       
       //BH1750,illumination,units:lux
       ILL_lux:
       {
         "5":bytes[7]<<8 | bytes[8],
       }[bytes[6]&0x7F],  

        //ADC,PA4,units:V
        ADC_V:
       {
         "6":(bytes[7]<<8 | bytes[8])/1000,
       }[bytes[6]&0x7F],  
       
        //Exti count,PA4,units:times
        Exit_count:
        {
          "7":bytes[7]<<8 | bytes[8],
        }[bytes[6]&0x7F],  
        
        //Applicable to working mode 4567,and working mode 467 requires short circuit PA9 and PA10
        No_connect:
        {
          "1":"Sensor no connection",
        }[(bytes[6]&0x80)>>7],  
  };
}

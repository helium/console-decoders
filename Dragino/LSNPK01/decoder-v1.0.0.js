function Decoder(bytes, port) {
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields.
    var value=(bytes[0]<<8 | bytes[1]) & 0x3FFF;
    var batV=value/1000;//Battery,units:V

    value=bytes[2]<<8 | bytes[3];
    if(bytes[2] & 0x80)
    {value |= 0xFFFF0000;}
    var temp_DS18B20=(value/10).toFixed(2);//DS18B20,temperature

    value=bytes[4]<<8 | bytes[5];
    var N=value;	//Unit:mg/kg

    value=bytes[6]<<8 | bytes[7];
    var P=value;	//Unit:mg/kg

    value=bytes[8]<<8 | bytes[9];
    var K=value;	//Unit:mg/kg

    var mes_type = bytes[10]>>4;
    var i_flag = bytes[10]&0x0F;
    return {
        Bat:batV,
        TempC_DS18B20:temp_DS18B20,
        N_SOIL:N,
        P_SOIL:P,
        K_SOIL:K,
        Interrupt_flag:i_flag,
        Message_type:mes_type
    };
}
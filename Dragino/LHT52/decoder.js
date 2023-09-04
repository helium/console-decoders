/* 
* Payload decoder for the Dragino LHT52 temperature sensor
*/

function Decoder(bytes, port) {

    // The sensor supports multiple different payload types sent on predetermined ports.
    if (port == 2) {
        return decodeSensorData(bytes);
    } else if (port == 5) {
        return decodeDeviceStatus(bytes);
    }

    var output = {};
    output.port = port;
    return output;
}

function str_pad(byte){
    var zero = '0';
    var hex= byte.toString(16);    
    var tmp  = 2-hex.length;
    return zero.substr(0,tmp) + hex;
}

/**
 * Decode sensor data
 */
function decodeSensorData(bytes) {
    // Temperature
    temperature = (((bytes[0] & 0xFF) << 8) | (bytes[1] & 0xFF)) / 100;

    // Humidity
    humidity = (((bytes[2] & 0xFF) << 8) | (bytes[3] & 0xFF)) / 10;

    // External temperature
    externalTemperature = (((bytes[4] & 0xFF) << 8) | (bytes[5] & 0xFF)) / 100;

    // Ext
    ext = bytes[6]; 

    // Timestamp
    timestamp = (bytes[7]<<24 | bytes[8]<<16 | bytes[9]<<8 | bytes[10]);

    // Decoder output
    var output = {};
    output.temperature = temperature;
    output.humidity = humidity;
    output.external_temperature = externalTemperature;
    output.ext = ext;
    output.timestamp = timestamp;

    return output;
}

/**
 * Decode device status
 */
function decodeDeviceStatus(bytes) {
    // Sensor Model
    sensorModel = bytes[0];

    // Firmware Version
    firmwareVersion = str_pad((bytes[1]<<8)|bytes[2]);

    // Frequency Band
    frequencyBand = bytes[3];

    // Sub band
    subBand = bytes[4];

    // Battery Voltage (in V)
    batVoltage = (bytes[5]<<8|bytes[6]) / 1000;

    // Decoder output
    var output = {};
    output.sensor_model = sensorModel;
    output.firmware_version = firmwareVersion;
    output.frequency_band = frequencyBand;
    output.sub_band = subBand;
    output.battery_voltage = batVoltage;
 
    return output;
}
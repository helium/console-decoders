/* 
* Payload decoder for the Browan TBDW100 Door and Window sensor.
*/

function Decoder(bytes, port) {

    // Decoder output
    var output = {};

    // Door open/close status in various formats
    statusValue = bytes[0] & 0x1;
    // 1: open, 0: closed
    statusReadble = "open";
    statusBoolean = true;
    if (statusValue == 0) {
        statusReadble = "closed";
        statusBoolean = false;
    }

    // Battery voltage
    batteryVoltage = bytes[1] & 0x0f;

    batteryVoltage = (25 + batteryVoltage) / 10;
    batteryCapacity = (batteryCapacity / 15) * 100;

    // PCB temperature measurement
    temperature = bytes[2] & 0x7f;

    // Temperature in °C = t - 32.
    temperature = temperature - 32;

    // Time elapsed since the last event-triggered
    time = (bytes[4] << 8) | bytes[3];

    // Total count of event-triggered (since boot)
    count = ((bytes[7] << 16) | (bytes[6] << 8)) | bytes[5];

    // Output construction
    output.status_raw = statusValue;
    output.status_readable = statusReadble;
    output.status_open_boolean = statusBoolean;
    output.battery_voltage = batteryVoltage;
    output.temperature = temperature;
    output.time = time;
    output.count = count;
    output.port = port;

    return output;
}

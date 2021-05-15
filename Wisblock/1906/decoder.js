// https://github.com/RAKWireless/WisBlock/blob/master/examples/RAK4630/solutions/Environment_Monitoring/Environment_Monitoring.ino
function Decoder(bytes, port) {
    var decoded = {};

    decoded.temperature = (bytes[1] << 8 | (bytes[2])) / 100;
    decoded.humidity = (bytes[3] << 8 | (bytes[4])) / 100;
    decoded.pressure = (bytes[8] | (bytes[7] << 8) | (bytes[6] << 16) | (bytes[5] << 24)) / 100;
    decoded.gas = bytes[12] | (bytes[11] << 8) | (bytes[10] << 16) | (bytes[9] << 24);

    return decoded;
}
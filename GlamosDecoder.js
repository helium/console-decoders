//GLAMOS Combined Decoder for Mappers, Cargo and Helium Vision

function Decoder(bytes, port) {

    var decoded = {};
    var position = {};

    position.lat = ((bytes[0] << 16) >>> 0) + ((bytes[1] << 8) >>> 0) + bytes[2];
    position.lat = (position.lat / 16777215.0 * 180) - 90;
    position.lat = position.lat.toFixed(7);
    position.lng = ((bytes[3] << 16) >>> 0) + ((bytes[4] << 8) >>> 0) + bytes[5];
    position.lng = (position.lng / 16777215.0 * 360) - 180;
    position.lng = position.lng.toFixed(7);

    var altValue = ((bytes[6] << 8) >>> 0) + bytes[7];
    var sign = bytes[6] & (1 << 7);

    if (sign) {
        position.altitude = 0xFFFF0000 | altValue;
    } else {
        position.altitude = altValue;
    }

    decoded.latitude = position.lat;
  	decoded.longitude = position.lng;
    decoded.altitude = position.altitude;
    decoded.accuracy = 3;	
	  decoded.antenna = bytes[8];

    if (Object.getOwnPropertyNames(position).length > 0) {
        decoded.position = position;
    }

    return decoded;
}

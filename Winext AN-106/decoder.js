function Decoder(bytes, port) {

var lat = ((bytes[0] << 16) | (bytes[1] << 8) | bytes[2])

if (lat & 0x800000)
    lat |= ~0xffffff;
    
var lon = ((bytes[3] << 16) | (bytes[4] << 8) | bytes[5])

if (lon & 0x800000)
    lon |= ~0xffffff;
    
  return {
    latitude: lat / (2.**23 - 1) * 90,
    longitude: lon / (2.**23 - 1) * 180,
    altitude: (bytes[6] << 8) | bytes[7],
    accuracy: 0
  };
}

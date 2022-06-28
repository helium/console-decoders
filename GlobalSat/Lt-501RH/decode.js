function Decoder(bytes) {
var Report = bytes[0];
    if (Report == 128) {
        var d = (bytes[5]<<24) | (bytes[4]<<16) | (bytes[3]<<8) | (bytes[2]);
        var e = (bytes[9]<<24) | (bytes[8]<<16) | (bytes[7]<<8) | (bytes[6]);
        var Longitude = parseInt(d) * 0.000001;
        var Latitude = parseInt(e) * 0.000001;
        var Geolocation = (Latitude + "," + Longitude)
        var Status = "Short Report"
        var Statustxt = Status

        
    } else if (Report == 12) {
        var d = (bytes[6]<<24) | (bytes[5]<<16) | (bytes[4]<<8) | (bytes[3]);
        var e = (bytes[10]<<24) | (bytes[9]<<16) | (bytes[8]<<8) | (bytes[7]);
        var Longitude = parseInt(d) * 0.000001;
        var Latitude = parseInt(e) * 0.000001;
        var Geolocation = (Latitude + "," + Longitude)
        var Status = bytes[12]
        var Statustxt = "Battery " + Status + "%"

        
    }
return {Latitude:Latitude,Longitude:Longitude,Geolocation:Geolocation,Statustxt:Statustxt};
}

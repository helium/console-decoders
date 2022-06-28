function Decoder(bytes) {
var d = (bytes[5]<<24) | (bytes[4]<<16) | (bytes[3]<<8) | (bytes[2]);
var e = (bytes[9]<<24) | (bytes[8]<<16) | (bytes[7]<<8) | (bytes[6]);
var Longitude = parseInt(d) * 0.000001;
var Latitude = parseInt(e) * 0.000001;
var Geolocation = (Latitude + "," + Longitude)

var Status = bytes[10]

if (Status == 65) {
        Statustxt = 'Ping report';
    } else if (Status == 1) {
            Statustxt = 'Ping report';
    } else if (Status == 66) {
            Statustxt = 'Periodic mode report';
    } else if (Status == 68) {
            Statustxt = 'Motion mode static report';
    } else if (Status == 69) {
            Statustxt = 'Motion mode moving report';
    } else if (Status == 70) {
            Statustxt = 'Motion mode static to moving report';
    } else if (Status == 6) {
            Statustxt = 'Motion mode moving to static report';
    } else if (Status == 71) {
            Statustxt = 'Motion mode moving to static report';
    } else if (Status == 15) {
            Statustxt = 'Low battery alarm report';
    } else if (Status == 23) {
            Statustxt = 'Power on (temperature)';
    } else if (Status == 25) {
            Statustxt = 'Power off (low battery)';
    } else if (Status == 32) {
            Statustxt = 'Power off (temperature)';
    } else if (Status == 37) {
            Statustxt = 'External GPS antenna fail report';
    } else if (Status == 38) {
            Statustxt = 'Schedule report';
       } else {
            Statustxt = Status + 'Unknown';
       }

return {Latitude:Latitude,Longitude:Longitude,Geolocation:Geolocation,Statustxt:Statustxt};
}

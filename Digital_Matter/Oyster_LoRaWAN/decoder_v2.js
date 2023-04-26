// This is an adapted version of latest Oyster3 decoder from Digital Matter to work on Helium
// This decoder includes all the uplink ports from the Oyster3
function MakeBitParser(bytes, offset, length) {
   return {
       bits: bytes.slice(offset, offset + length),
       offset: 0,
       bitLength: length * 8,
       U32LE: function U32LE(bits) {
           if (bits > 32)
               throw ("Invalid argument!");
           if (this.offset + bits > this.bitLength)
               throw ("Read past end of data!");
           var out = 0;
           var total = 0;
           while (bits > 0) {
               var byteNum = Math.floor(this.offset / 8);
               var discardLSbs = this.offset & 7;
               var avail = Math.min(8 - discardLSbs, bits);
               var extracted = (this.bits[byteNum] >>> discardLSbs);
               var masked = (extracted << (32 - avail)) >>> (32 - avail);
               out |= ((masked << total) >>> 0);
               total += avail;
               bits -= avail;
               this.offset += avail;
           }
           return out;
       },
       S32LE: function S32LE(bits) {
           return (this.U32LE(bits) << (32 - bits)) >> (32 - bits);
       }
   };
}

function ResolveTime(timestamp15, approxReceptionTime) {
   if (timestamp15 === 127)
       return null;
   var approxUnixTime = Math.round(approxReceptionTime.getTime() / 1000);
   // Device supplies: round(unix time / 15) modulo 127.
   // We're assuming that the uplink was sent some time BEFORE refTime,
   // and got delayed by network lag. We'll resolve the timestamp
   // in the window [approxReceptionTime - 21m, approxReceptionTime + 10m],
   // to allow for 10m of error in approxReceptionTime, and 10m of network lag.
   // So refTime = approxReceptionTime + 10m.
   var refTime = approxUnixTime + 600;
   timestamp = timestamp15 * 15;
   // refTime
   // v
   // [ | | | ]
   // ^ ^ ^ ^
   // timestamp timestamp timestamp timestamp
   // refTime
   // v
   // [ | | | ]
   // ^ ^ ^ ^
   // timestamp timestamp timestamp timestamp
   // We want the timestamp option immediately to the left of refTime.
   var refTimeMultiple = Math.floor(refTime / (127 * 15));
   var refTimeModulo = refTime % (127 * 15);
   var closestUnixTime = 0;
   if (refTimeModulo > timestamp)
       closestUnixTime = refTimeMultiple * (127 * 15) + timestamp;
   else
       closestUnixTime = (refTimeMultiple - 1) * (127 * 15) + timestamp;
   return new Date(closestUnixTime * 1000).toISOString();
}

function Decoder(bytes, port) {
   var p = port;
   var b = MakeBitParser(bytes, 0, bytes.length);
   var decoded = {};
   var w = [];
   if (p === 1) {
       decoded._type = "position";
       var l = {};
       l.latitudeDeg = Number((b.S32LE(32) / 1e7).toFixed(7)); // decimal scaling
       l.longitudeDeg = Number((b.S32LE(32) / 1e7).toFixed(7));
       decoded.inTrip = (b.U32LE(1) !== 0);
       decoded.fixFailed = (b.U32LE(1) !== 0);
       l.headingDeg = Number((b.U32LE(6) * 5.625).toFixed(2));
       l.speedKmph = b.U32LE(8);
       decoded.batV = Number((b.U32LE(8) * 0.025).toFixed(3));
       decoded.inactivityAlarm = null;
       decoded.batCritical = null;
       if (decoded.fixFailed) {
           decoded.cached = l;
           //w.push("fix failed");
       } else {
           decoded = Object.assign(decoded, l);
       }
   } else if (p === 2) {
       decoded._type = "downlink ack";
       decoded.sequence = b.U32LE(7);
       decoded.accepted = (b.U32LE(1) !== 0);
       decoded.fwMaj = b.U32LE(8);
       decoded.fwMin = b.U32LE(8);
       if (input.bytes.length < 6) {
           decoded.prodId = null;
           decoded.hwRev = null;
           decoded.port = null;
       } else {
           decoded.prodId = b.U32LE(8);
           decoded.hwRev = b.U32LE(8);
           decoded.port = b.U32LE(8);
       }
   } else if (p === 3) {
       decoded._type = "stats";
       decoded.initialBatV = Number((4.0 + 0.1 * b.U32LE(4)).toFixed(2));
       decoded.txCount = 32 * b.U32LE(11);
       decoded.tripCount = 32 * b.U32LE(13);
       decoded.gnssSuccesses = 32 * b.U32LE(10);
       decoded.gnssFails = 32 * b.U32LE(8);
       decoded.aveGnssFixS = b.U32LE(9);
       decoded.aveGnssFailS = b.U32LE(9);
       decoded.aveGnssFreshenS = b.U32LE(8);
       decoded.wakeupsPerTrip = b.U32LE(7);
       decoded.uptimeWeeks = b.U32LE(9);
   } else if (p === 4) {
       decoded._type = "position";
       var l = {};
       // decimal scaling, truncated integer
       l.latitudeDeg = Number((256 * b.S32LE(24) / 1e7).toFixed(7));
       l.longitudeDeg = Number((256 * b.S32LE(24) / 1e7).toFixed(7));
       l.headingDeg = 45 * b.U32LE(3);
       l.speedKmph = 5 * b.U32LE(5);
       decoded.batV = b.U32LE(8);
       decoded.inTrip = (b.U32LE(1) !== 0);
       decoded.fixFailed = (b.U32LE(1) !== 0);
       decoded.inactivityAlarm = (b.U32LE(1) !== 0);
       if (b.U32LE(1) === 0)
           decoded.batV = Number((0.025 * decoded.batV).toFixed(3));
       else
           decoded.batV = Number((3.5 + 0.032 * decoded.batV).toFixed(3));
       crit = b.U32LE(2);
       if (crit === 0)
           decoded.batCritical = null;
       else if (crit === 1)
           decoded.batCritical = false;
       else
           decoded.batCritical = true;
       if (decoded.fixFailed) {
           decoded.cached = l;
           //w.push("fix failed");
       } else {
           decoded = Object.assign(decoded, l);
       }
   } else if (p === 30) {
       decoded._type = "hello";
       decoded.fwMaj = b.U32LE(8);
       decoded.fwMin = b.U32LE(8);
       decoded.prodId = b.U32LE(8);
       decoded.hwRev = b.U32LE(8);
       decoded.resetPowerOn = (b.U32LE(1) !== 0);
       decoded.resetWatchdog = (b.U32LE(1) !== 0);
       decoded.resetExternal = (b.U32LE(1) !== 0);
       decoded.resetSoftware = (b.U32LE(1) !== 0);
       b.U32LE(4);
       decoded.watchdogReason = b.U32LE(16);
       decoded.initialBatV = Number((3.5 + 0.032 * b.U32LE(8)).toFixed(2));
   } else if (p === 31) {1
       decoded._type = "stats v3";
       decoded.ttff = b.U32LE(8);
       decoded.wakeupsPerTrip = b.U32LE(8);
       decoded.initialBatV = Number((3.5 + 0.032 * b.U32LE(8)).toFixed(3));
       decoded.currentBatV = Number((3.5 + 0.032 * b.U32LE(8)).toFixed(3));
       decoded.batCritical = (b.U32LE(1) !== 0);
       decoded.batLow = (b.U32LE(1) !== 0);
       decoded.tripCount = 32 * b.U32LE(14);
       decoded.uptimeWeeks = b.U32LE(10);
       decoded.mWhUsed = 10 * b.U32LE(10);
       decoded.percentLora = 100 / 32 * b.U32LE(5);
       decoded.percentGnssSucc = 100 / 32 * b.U32LE(5);
       decoded.percentGnssFail = 100 / 32 * b.U32LE(5);
       decoded.percentSleepDis = 100 / 32 * b.U32LE(5);
       decoded.percentOther = 100 - decoded.percentLora - decoded.percentGnssSucc -
           decoded.percentGnssFail - decoded.percentSleepDis;
   } else if (p === 33) {
       decoded.type = "position";
       var l = {};
       decoded.fixFailed = (b.U32LE(1) !== 0);
       l.latitude = Number((180 * b.S32LE(23) / (1 << 23)).toFixed(7)); // binary scaling
       l.longitude = Number((360 * b.S32LE(24) / (1 << 24)).toFixed(7));
       decoded.inTrip = (b.U32LE(1) !== 0);
       decoded.timestamp = b.U32LE(7);
       decoded.time = ResolveTime(decoded.timestamp, new Date());
       decoded.batCritical = (b.U32LE(1) !== 0);
       decoded.inactivityAlarm = (b.U32LE(1) !== 0);
       mins = 2 * b.U32LE(14); // lower bound
       decoded.inactiveDuration = Math.floor(mins / 1440) + 'd' +
           Math.floor((mins % 1440) / 60) + 'h' + (mins % 60) + 'm';
       decoded.batV = Number((3.5 + 0.032 * b.U32LE(8)).toFixed(3));
       l.headingDeg = 45 * b.U32LE(3);
       l.speedKmph = 5 * b.U32LE(5);
       if (decoded.fixFailed) {
           decoded.cached = l;
           //w.push("fix failed");
       } else {
           decoded = Object.assign(decoded, l);
       }
   } else {
       return {
           warnings: ['unknown FPort'],
       };
   }
   return decoded
}

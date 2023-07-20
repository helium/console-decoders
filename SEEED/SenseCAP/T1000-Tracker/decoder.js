function Decoder(bytes, port) {
  var bytes = bytes2HexString(bytes).toLocaleUpperCase();
  var messages = messageAnalyzed(bytes);
  var decoded = {
    valid: true,
    err: 0,
    hexPayload: bytes,
    ...messages
  };
  return decoded;
}

function messageAnalyzed(messageValue) {
    try {
        let frames = unpack(messageValue);
        let measurementResults = {};
        for (let i = 0; i < frames.length; i++) {
            let item = frames[i];
            let dataId = item.dataId;
            let dataValue = item.dataValue;
            let measurementObj = deserialize(dataId, dataValue);
            Object.assign(measurementResults, measurementObj);
        }
        return measurementResults;
    } catch (e) {
        return e.toString();
    }
}

function unpack (messageValue) {
    let frameArray = []

    for (let i = 0; i < messageValue.length; i++) {
        let remainMessage = messageValue
        let dataId = remainMessage.substring(0, 2).toUpperCase()
        let dataValue
        let dataObj = {}
        let packageLen
        switch (dataId) {
            case '01':
                packageLen = 94
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            case '02':
                packageLen = 32
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            case '03':
                packageLen = 64
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                break
            case '04':
                packageLen = 20
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            case '05':
                packageLen = 10
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            case '06':
                packageLen = 44
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            case '07':
                packageLen = 84
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            case '08':
                packageLen = 70
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            case '09':
                packageLen = 36
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            case '0A':
                packageLen = 76
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            case '0B':
                packageLen = 62
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            case '0C':
                packageLen = 2
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                break
            case '0D':
                packageLen = 10
                if (remainMessage.length < packageLen) {
                    return frameArray
                }
                dataValue = remainMessage.substring(2, packageLen)
                messageValue = remainMessage.substring(packageLen)
                dataObj = {
                    'dataId': dataId, 'dataValue': dataValue
                }
                break
            default:
                return frameArray
        }
        if (dataValue.length < 2) {
            break
        }
        frameArray.push(dataObj)
    }
    return frameArray
}

function deserialize (dataId, dataValue) {
    let measurements = {}
    let eventList = []
    let collectTime = 0
    switch (dataId) {
        case '01':
            measurements = getUpShortInfo(dataValue)
            break
        case '02':
            measurements = getUpShortInfo(dataValue)
            break
        case '03':
            break
        case '04':
            measurements = {
                work_mode: getWorkingMode(dataValue.substring(0, 2)),
                heartbeat_interval: getOneWeekInterval(dataValue.substring(4, 8)),
                periodic_interval: getOneWeekInterval(dataValue.substring(8, 12)),
                event_interval: getOneWeekInterval(dataValue.substring(12, 16)),
                sos_mode: getSOSMode(dataValue.substring(16, 18))
            }
            break;
        case '05':
            measurements = {
                battery: getBattery(dataValue.substring(0, 2)),
                work_mode: getWorkingMode(dataValue.substring(2, 4)),
                sos_mode: getSOSMode(dataValue.substring(6, 8))
            }
            break
        case '06':
            eventList = getEventStatus(dataValue.substring(0, 6))
            collectTime = getUTCTimestamp(dataValue.substring(8, 16))
            measurements = {
                sos_event: eventList[6],
                longitude: getSensorValue(dataValue.substring(16, 24), 1000000),
                latitude: getSensorValue(dataValue.substring(24, 32), 1000000),
                air_temperature: getSensorValue(dataValue.substring(32, 36), 10),
                light: getSensorValue(dataValue.substring(36, 40)),
                battery: getBattery(dataValue.substring(40, 42)),
                timestamp: collectTime
            }
            break
        case '07':
            eventList = getEventStatus(dataValue.substring(0, 6))
            collectTime = getUTCTimestamp(dataValue.substring(8, 16))
            measurements = {
                sos_event: eventList[6],
                wifi_scan: getMacAndRssiObj(dataValue.substring(16, 72)),
                air_temperature: getSensorValue(dataValue.substring(72, 76), 10),
                light: getSensorValue(dataValue.substring(76, 80)),
                battery: getBattery(dataValue.substring(80, 82)),
                timestamp: collectTime
            }
            break
        case '08':
            eventList = getEventStatus(dataValue.substring(0, 6))
            collectTime = getUTCTimestamp(dataValue.substring(8, 16))
            measurements = {
                sos_event: eventList[6],
                ble_scan: getMacAndRssiObj(dataValue.substring(16, 58)),
                air_temperature: getSensorValue(dataValue.substring(58, 62), 10),
                light: getSensorValue(dataValue.substring(62, 66)),
                battery: getBattery(dataValue.substring(66, 68)),
                timestamp: collectTime
            }
            break
        case '09':
            eventList = getEventStatus(dataValue.substring(0, 6))
            collectTime = getUTCTimestamp(dataValue.substring(8, 16))
            measurements = {
                sos_event: eventList[6],
                longitude: getSensorValue(dataValue.substring(16, 24), 1000000),
                latitude: getSensorValue(dataValue.substring(24, 32), 1000000),
                battery: getBattery(dataValue.substring(32, 34)),
                timestamp: collectTime
            }
            break
        case '0A':
            eventList = getEventStatus(dataValue.substring(0, 6))
            collectTime = getUTCTimestamp(dataValue.substring(8, 16))
            measurements = {
                sos_event: eventList[6],
                wifi_scan: getMacAndRssiObj(dataValue.substring(16, 72)),
                battery: getBattery(dataValue.substring(72, 74)),
                timestamp: collectTime
            }
            break
        case '0B':
            eventList = getEventStatus(dataValue.substring(0, 6))
            collectTime = getUTCTimestamp(dataValue.substring(8, 16))
            measurements = {
                sos_event: eventList[6],
                ble_scan: getMacAndRssiObj(dataValue.substring(16, 58)),
                battery: getBattery(dataValue.substring(58, 60)),
                timestamp: collectTime
            }
            break
        case '0D':
            let errorCode = getInt(dataValue)
            let error = ''
            switch (errorCode) {
                case 0:
                    error = 'THE GNSS SCAN TIME OUT'
                    break
                case 1:
                    error = 'THE WI-FI SCAN TIME OUT'
                    break
                case 2:
                    error = 'THE WI-FI+GNSS SCAN TIME OUT'
                    break
                case 3:
                    error = 'THE GNSS+WI-FI SCAN TIME OUT'
                    break
                case 4:
                    error = 'THE BEACON SCAN TIME OUT'
                    break
                case 5:
                    error = 'THE BEACON+WI-FI SCAN TIME OUT'
                    break
                case 6:
                    error = 'THE BEACON+GNSS SCAN TIME OUT'
                    break
                case 7:
                    error = 'THE BEACON+WI-FI+GNSS SCAN TIME OUT'
                    break
                case 8:
                    error = 'FAILED TO OBTAIN THE UTC TIMESTAMP'
                    break
            }
            measurements.push({errorCode, error})
    }
    return measurements
}

function getUpShortInfo (messageValue) {
    return [
        {
            battery: getBattery(messageValue.substring(0, 2))
        }, {
            firmware_version: getSoftVersion(messageValue.substring(2, 6))
        }, {
            hardware_version: getHardVersion(messageValue.substring(6, 10))
        }, {
            work_mode: getWorkingMode(messageValue.substring(10, 12))
        }, {
            heartbeat_interval: getOneWeekInterval(messageValue.substring(14, 18))
        }, {
            periodic_interval: getOneWeekInterval(messageValue.substring(18, 22))
        }, {
            event_interval: getOneWeekInterval(messageValue.substring(22, 26))
        }, {
            sos_mode: getSOSMode(messageValue.substring(28, 30))
        }
    ]
}
function getBattery (batteryStr) {
    return loraWANV2DataFormat(batteryStr)
}
function getSoftVersion (softVersion) {
    return `${loraWANV2DataFormat(softVersion.substring(0, 2))}.${loraWANV2DataFormat(softVersion.substring(2, 4))}`
}
function getHardVersion (hardVersion) {
    return `${loraWANV2DataFormat(hardVersion.substring(0, 2))}.${loraWANV2DataFormat(hardVersion.substring(2, 4))}`
}

function getOneWeekInterval (str) {
    return loraWANV2DataFormat(str) * 60
}
function getSensorValue (str, dig) {
    if (str === '8000') {
        return null
    } else {
        return loraWANV2DataFormat(str, dig)
    }
}

function bytes2HexString (arrBytes) {
    var str = ''
    for (var i = 0; i < arrBytes.length; i++) {
        var tmp
        var num = arrBytes[i]
        if (num < 0) {
            tmp = (255 + num + 1).toString(16)
        } else {
            tmp = num.toString(16)
        }
        if (tmp.length === 1) {
            tmp = '0' + tmp
        }
        str += tmp
    }
    return str
}
function loraWANV2DataFormat (str, divisor = 1) {
    let strReverse = bigEndianTransform(str)
    let str2 = toBinary(strReverse)
    if (str2.substring(0, 1) === '1') {
        let arr = str2.split('')
        let reverseArr = arr.map((item) => {
            if (parseInt(item) === 1) {
                return 0
            } else {
                return 1
            }
        })
        str2 = parseInt(reverseArr.join(''), 2) + 1
        return '-' + str2 / divisor
    }
    return parseInt(str2, 2) / divisor
}

function bigEndianTransform (data) {
    let dataArray = []
    for (let i = 0; i < data.length; i += 2) {
        dataArray.push(data.substring(i, i + 2))
    }
    return dataArray
}

function toBinary (arr) {
    let binaryData = arr.map((item) => {
        let data = parseInt(item, 16)
            .toString(2)
        let dataLength = data.length
        if (data.length !== 8) {
            for (let i = 0; i < 8 - dataLength; i++) {
                data = `0` + data
            }
        }
        return data
    })
    return binaryData.toString().replace(/,/g, '')
}

function getSOSMode (str) {
    return loraWANV2DataFormat(str)
}

function getMacAndRssiObj (pair) {
    let pairs = []
    if (pair.length % 14 === 0) {
        for (let i = 0; i < pair.length; i += 14) {
            let mac = getMacAddress(pair.substring(i, i + 12))
            if (mac) {
                let rssi = getInt8RSSI(pair.substring(i + 12, i + 14))
                pairs.push({mac: mac, rssi: rssi})
            } else {
                continue
            }
        }
    }
    return pairs
}

function getMacAddress (str) {
    if (str.toLowerCase() === 'ffffffffffff') {
        return null
    }
    let macArr = []
    for (let i = 1; i < str.length; i++) {
        if (i % 2 === 1) {
            macArr.push(str.substring(i - 1, i + 1))
        }
    }
    let mac = ''
    for (let i = 0; i < macArr.length; i++) {
        mac = mac + macArr[i]
        if (i < macArr.length - 1) {
            mac = mac + ':'
        }
    }
    return mac
}

function getInt8RSSI (str) {
    return loraWANV2DataFormat(str)
}

function getInt (str) {
    return parseInt(str)
}

/**
 *  1.MOVING_STARTING
 *  2.MOVING_END
 *  3.DEVICE_STATIC
 *  4.SHOCK_EVENT
 *  5.TEMP_EVENT
 *  6.LIGHTING_EVENT
 *  7.SOS_EVENT
 *  8.CUSTOMER_EVENT
 * */
function getEventStatus (str) {
    let bitStr = getByteArray(str)
    let event = []
    for (let i = bitStr.length; i >= 0; i--) {
        if (i === 0) {
            event[i] = bitStr.substring(0)
        } else {
            event[i] = bitStr.substring(i - 1, i)
        }
    }
    return event.reverse()
}

function getByteArray (str) {
    let bytes = []
    for (let i = 0; i < str.length; i += 2) {
        bytes.push(str.substring(i, i + 2))
    }
    return toBinary(bytes)
}

function getWorkingMode (workingMode) {
    return getInt(workingMode)
}

function getUTCTimestamp(str){
    return parseInt(loraWANV2PositiveDataFormat(str)) * 1000
}

function loraWANV2PositiveDataFormat (str, divisor = 1) {
    let strReverse = bigEndianTransform(str)
    let str2 = toBinary(strReverse)
    return parseInt(str2, 2) / divisor
}
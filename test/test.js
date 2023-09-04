/* eslint-env node, mocha */

const assert = require('assert');

describe('Decoder', () => {

  // Run the complete test suite on both the default (ES6) as the TTN parser
  let runs = [
    {decoderName: 'default', decoder: require('../decoder') },
    {decoderName: 'ttn', decoder: require('../decoder_ttn')}
  ]

  runs.forEach(function (run) {

    // Define (shortcut) parse function, to be used in all tests
    function parse(hex) {
      const cleanedHex = hex.replace(/\s/g, '');
      const buffer = Buffer.from(cleanedHex, 'hex');
      return run.decoder(buffer);
    }

    describe('#' + run.decoderName, function () {
      it('testDefaultMessage', () => {
        const payload = parse('0000FE');

        assert(Object.prototype.hasOwnProperty.call(payload, 'batteryLevel'));
        assert.equal(254, payload.batteryLevel);
        assert.equal(false, payload.uplinkReasonButton);
        assert.equal(false, payload.uplinkReasonGpio);
        assert.equal(false, payload.uplinkReasonMovement);
      });

      it('testTemperature1', () => {
        // no gpio, temp sensor(25 degree), no uplink reason, empty CRC, full battery
        const payload = parse('1000FE010904');
        assert(Object.prototype.hasOwnProperty.call(payload, 'batteryLevel'));
        assert.equal(254, payload.batteryLevel);
        assert.equal(false, payload.uplinkReasonButton);
        assert.equal(false, payload.uplinkReasonGpio);
        assert.equal(false, payload.uplinkReasonMovement);
        assert(Object.prototype.hasOwnProperty.call(payload, 'temperature'));
        assert.equal(23.08, payload.temperature); // TODO: 25 volgens Ruud?
      });

      it('testTemperature2', () => {
        // (tested, 20 degree)
        const payload = parse('1000FE0107D0');
        assert(Object.prototype.hasOwnProperty.call(payload, 'batteryLevel'));
        assert.equal(254, payload.batteryLevel);
        assert.equal(false, payload.uplinkReasonButton);
        assert.equal(false, payload.uplinkReasonGpio);
        assert.equal(false, payload.uplinkReasonMovement);
        assert(Object.prototype.hasOwnProperty.call(payload, 'temperature'));
        assert.equal(20, payload.temperature);

        // no gpio, light sensor, no uplink reason, empty CRC, fulll battery
        // TODO
      });

      // it('testGPIONoExternal', function() {
      //   //with gpio, 1 analog input, battery powered, 1 analog sensor sensors, no uplink reason,
      //   // empty CRC, full battery
      //   let payload = parse('2000FE000101000FF8');
      //   assert.equal(false, payload['uplinkReasonButton']);
      //   assert.equal(false, payload['uplinkReasonGpio']);
      //   assert.equal(false, payload['uplinkReasonMovement']);
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'batteryLevel'));
      //   assert.equal(254, payload['batteryLevel']);
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'gpio'));
      //
      //   let gpioPayload = payload['gpio'];
      //   assert.equal(true, gpioPayload['d0']);
      //   assert.equal(false, gpioPayload['d1']);
      //   assert.equal(false, gpioPayload['d2']);
      //   assert.equal(false, gpioPayload['d3']);
      //   assert.equal(false, gpioPayload['d4']);
      //   assert.equal(false, gpioPayload['d5']);
      //   assert.equal(false, gpioPayload['d6']);
      //   assert.equal(false, gpioPayload['d7']);
      //   assert.equal(4088, gpioPayload['a0']);
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'powerInfo'));
      //   assert.equal('battery', payload['powerInfo']['source']);
      //   assert.equal('none', payload['powerInfo']['externalMux']);
      // });
      //
      // it('testGPIOvplus', function() {
      //   let payload = parse('2000FE000101A2670FF7');
      //   assert.equal(false, payload['uplinkReasonButton']);
      //   assert.equal(false, payload['uplinkReasonGpio']);
      //   assert.equal(false, payload['uplinkReasonMovement']);
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'batteryLevel'));
      //   assert.equal(254, payload['batteryLevel']);
      //   //0001 => 1 analog input
      //   //01 => digital inputs (gpio 0 pulled up => high)
      //   //00 => battery powered
      //   //0FF7 => analog input data  (allmost max due to pull-up)
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'gpio'));
      //   let gpioPayload = payload['gpio'];
      //   assert.equal(true, gpioPayload['d0']);
      //   assert.equal(false, gpioPayload['d1']);
      //   assert.equal(false, gpioPayload['d2']);
      //   assert.equal(false, gpioPayload['d3']);
      //   assert.equal(false, gpioPayload['d4']);
      //   assert.equal(false, gpioPayload['d5']);
      //   assert.equal(false, gpioPayload['d6']);
      //   assert.equal(false, gpioPayload['d7']);
      //   assert.equal(4087, gpioPayload['a0']);
      //   //
      //   //2000FE000101 A267 0FF7
      //   //A267 => A => 1010 => pwr source 10 -> 2 -> V+; external mux 10 -> 2 -> V+
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'powerInfo'));
      //   assert.equal('vplus', payload['powerInfo']['source']);
      //   assert.equal('vplus', payload['powerInfo']['externalMux']);
      //   //    pwr source != battery => next byte includes 8 lsb of V+ voltage
      //   //267 = 615 => 6,15V (measured 6,091 thus ok)
      //   assert.equal(6.15, payload['powerInfo']['vplus']);
      // });
      //
      // it('testGPIOVoltage', function() {
      //   //2200FE000101 A967 0FF6 (also moved)
      //   //A967 => V+ voltage = 24,07 (measured 24,01)
      //   let payload = parse('2200FE000101A9670FF6');
      //   assert.equal(true, payload['uplinkReasonMovement']);
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'powerInfo'));
      //   assert.equal('vplus', payload['powerInfo']['source']);
      //   assert.equal('vplus', payload['powerInfo']['externalMux']);
      //   assert.equal(24.07, payload['powerInfo']['vplus']);
      // });
      //
      // it('testGPIOUsb', function() {
      //   //2000FE000100 51FF 0561
      //   //51FF => USB powered, 1FF -> 5,11V
      //   //0561 => 1337 (of 4096) (10K potmeter with 10K pull-up results that
      //   //         range is from 0 to 4096/2(full-scale/2)
      //   let payload = parse('2000FE00010051FF0561');
      //   assert.equal(false, payload['uplinkReasonMovement']);
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'powerInfo'));
      //   assert.equal('usb', payload['powerInfo']['source']);
      //   assert.equal('5v', payload['powerInfo']['externalMux']);
      //   assert.equal(5.11, payload['powerInfo']['vplus']);
      //
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'gpio'));
      //   let gpioPayload = payload['gpio'];
      //   assert.equal(1377, gpioPayload['a0']);
      // });
      //
      // it('testGPIOIrq', function() {
      //   let payload = parse('3200FE0002000000140107D0');
      //   //counter data (GPIO and onboard sensors (temperature), moved)
      //   assert.equal(true, payload['uplinkReasonMovement']);
      //   //3200FE 0002 00 00 0014 01 07D0
      //   //0002 => GPIO counter on GPIO[0]
      //   //00 => digital input data
      //
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'gpio'));
      //   let gpioPayload = payload['gpio'];
      //   assert.equal(false, gpioPayload['d0']);
      //   assert.equal(20, gpioPayload['i0']);
      //
      //   //00 => Battery powered and external mux none
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'powerInfo'));
      //   assert.equal('battery', payload['powerInfo']['source']);
      //   assert.equal('none', payload['powerInfo']['externalMux']);
      //
      //   //0014 => counter value of GPIO[0]
      //   //01 => onboard sensors, temperature sensor
      //   //07D0 => 20 degrees celcius
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'temperature'));
      //   assert.equal(20, payload['temperature']);
      // });
      //
      // it('testGPioTriggered', function() {
      //   let payload = parse('3600FE00060000002007970107D0');
      //   //triggered on GPIO (GPIO and (GPIO and onboard sensors (temperature),
      //   // moved AND GPIO triggered)
      //   assert.equal(true, payload['uplinkReasonGpio']);
      //
      //   //3600FE 0006 00 00 0020 0797 01 07D0
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'gpio'));
      //   let gpioPayload = payload['gpio'];
      //   //00 => digital input data
      //   gpioPayload['d0'];
      //   //0006 => GPIO counter on GPIO[0], analog input on GPIO[1]
      //   //00 => Battery powered and external mux none
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'powerInfo'));
      //   assert.equal('battery', payload['powerInfo']['source']);
      //   assert.equal('none', payload['powerInfo']['externalMux']);
      //   //0020 => counter value of GPIO[0] (32)
      //   assert.equal(32, gpioPayload['i0']);
      //   //0797 => analog value of GPIO[1] potmeter, which triggered high limit of 1750. (1943)
      //   assert.equal(1943, gpioPayload['a1']);
      //   //01 => onboard sensors, temperature sensor
      //   //07D0 => 20 degrees celcius
      //   assert(Object.prototype.hasOwnProperty.call(payload, 'temperature'));
      //   assert.equal(20, payload['temperature']);
      //
      // });

      it('testWifiPayload', () => {
        const payload = parse('1200FE 11 0904 23 E48D8CB311C7 CB FC528DC02247 C6 FE528DC02248 C5');

        // onboard sensors(temp + wifi), moved uplink reason, empty CRC, full battery

        // 12 00 FE => onboard sensor, moved, full battery
        assert.equal(true, payload.uplinkReasonMovement);
        assert.equal(254, payload.batteryLevel);
        // 11 => onboard sensors: temperature + wifi

        // 0904 => temp sensor(23,08 degree)
        assert.equal(23.08, payload.temperature);

        assert.equal(3, payload.wifiInfo.accessPoints.length);
        assert.equal('success', payload.wifiInfo.status);
        // 23 => Wifi status: RSSI added to package; Wifi succesfull; Nr. of adresses = 3
        // E48D8CB311C7 CB => Mac address with strongest signal strength (RSSI)
        const accessPoint = payload.wifiInfo.accessPoints[0];
        assert.equal('e4:8d:8c:b3:11:c7', accessPoint.macAddress);
        assert.equal(-53, accessPoint.signalStrength);
        // FC528DC02247 C6 => Mac adress second strongest
        // FE528DC02248 C5 => 3rd best mac adress
        // (location should be add ruud his home adress)
      });

      it('testEmptyWifiPayload', () => {
        const payload = parse('1200FE110904 28 28');
        // onboard sensors(temp + wifi), moved uplink reason, empty CRC, full battery
        // Wifi status: RSSI added to package; Wifi no accesspoints found; Nr. of adresses = 0
        assert.equal(0, payload.wifiInfo.accessPoints.length);
        assert.equal('no_access_points', payload.wifiInfo.status);
      });

      it('testInvalidPayload', () => {
        try {
          parse('1000fe13eeee12e48d8cb311c7CBFC528DC02247C6');
          assert.fail('exception not thrown');
        } catch (e) {
          assert.ok('exception thrown');
        }
      });

      it('testLightIntensityPayload', () => {
        const payload = parse('1000fe03096024de');
        assert(Object.prototype.hasOwnProperty.call(payload, 'lightIntensity'));
        assert.equal(49.84, payload.lightIntensity);
      });

      it('testAccelerometerPayload', () => {
        // payload with onboard sensors temperature and light, and current XYZ
        const payload = parse('1010d2 07 0a8e 0000 0032 0064 FC18');
        // X => 50; Y=> 100; Z=>-1000;
        assert(Object.prototype.hasOwnProperty.call(payload, 'accelerometer'));
        // $this->assertNull(payload['maxAccelerationNew']);
        assert(!Object.prototype.hasOwnProperty.call(payload, 'maxAccelerationNew'));
        assert(!Object.prototype.hasOwnProperty.call(payload, 'maxAccelerationHistory'));
        assert.equal(0.05, payload.accelerometer.x);
        assert.equal(0.1, payload.accelerometer.y);
        assert.equal(-1, payload.accelerometer.z);
      });

      it('testAccelerometerPayload2', () => {
        // payload with onboard sensors temperature and light, and current XYZ
        const payload = parse('1010d2 0B 0a8e 0000 07D0 0834');
        // max G => 2000;
        assert(!Object.prototype.hasOwnProperty.call(payload, 'accelerometer'));
        assert.equal(2, payload.maxAccelerationNew);
        assert.equal(2.1, payload.maxAccelerationHistory);
      });

      it('testAccelerometerPayload3', () => {
        // payload with current XYZ and maximum (from firmware)
        const payload = parse('1200FE0F0B4C11FF00000000003C02640834');
        // X => 0; Y=> 0; Z=>60;
        // maximum 612;
        assert.equal(0, payload.accelerometer.x);
        assert.equal(0, payload.accelerometer.y);
        assert.equal(0.06, payload.accelerometer.z);
        assert.equal(0.612, payload.maxAccelerationNew);
        assert.equal(2.100, payload.maxAccelerationHistory);
      });

      it('testBluetoothPayload00', () => {
        /*
           * 1000FE normale header met batterij en CRC van 00
           * 8301 is eerst de onboard package sensor content (met de waarde 83) waar de 3
           * staat voor temperatuur + licht, en de 8 voor er komt nog een byte sensor content,
           * en dan 01 is die volgende byte met bluetooth
           * dan volgt temperatuur en licht
           * dan 01 status met aantal bluetooth beacons, 44 is de rssi van eerste beacon
           * dan 2 laatste bytes van de UUID, de major en de minor
           */
        const payload = parse('1000FE 8301 0A7224C9 01 44 1005 031C 8AF1');

        assert(Object.prototype.hasOwnProperty.call(payload, 'bluetoothInfo'));
        assert.equal('success', payload.bluetoothInfo.status);
        assert.equal(0, payload.bluetoothInfo.addSlotInfo);
        assert.equal(1, payload.bluetoothInfo.beacons.length);

        // 0x44 = 1000100
        const beacon0 = payload.bluetoothInfo.beacons[0];
        assert.equal('ibeacon', beacon0.type);
        assert.equal(-7, beacon0.rssi);
        assert.equal('1005', beacon0.uuid.toUpperCase());
        assert.equal('031C', beacon0.major.toUpperCase());
        assert.equal('8AF1', beacon0.minor.toUpperCase());
      });

      it('testBluetoothPayloadMultiple', () => {
        const payload = parse('1000FE83010A4A336A02D90123456789ABE41005031C8AF1');
        assert.equal(2, payload.bluetoothInfo.beacons.length);
        const beacon0 = payload.bluetoothInfo.beacons[0];
        assert.equal('eddystone', beacon0.type);
        assert.equal('0123456789AB', beacon0.instance.toUpperCase());

        const beacon1 = payload.bluetoothInfo.beacons[1];
        assert.equal('ibeacon', beacon1.type);
        assert.equal('1005', beacon1.uuid.toUpperCase());
        assert.equal('031C', beacon1.major.toUpperCase());
        assert.equal('8AF1', beacon1.minor.toUpperCase());
      });

      it('testBluetoothPayload01', () => {
        /**
         * 21  is de status, die 2 is nieuw zeg maar, die geeft aan dat er een full data volgt
         * C8 is de result status van beacon 1, op dezelfde manier als die voor de 6B grote data.
         * daarna volgt de volle UUID, (16Byte), dan de major dan de minor
         */
        const payload = parse('1100FD8301093100A2 21 C8 0066D726F52DDFB9D9888B51A8001005031C8AF8');

        assert(Object.prototype.hasOwnProperty.call(payload, 'bluetoothInfo'));
        assert.equal('success', payload.bluetoothInfo.status);
        assert.equal(1, payload.bluetoothInfo.beacons.length);
        assert.equal(1, payload.bluetoothInfo.addSlotInfo);

        const beacon0 = payload.bluetoothInfo.beacons[0];
        assert.equal('ibeacon', beacon0.type);
        assert.equal(-73, beacon0.rssi);
        assert.equal('0066D726F52DDFB9D9888B51A8001005', beacon0.uuid.toUpperCase());
        assert.equal('031C', beacon0.major.toUpperCase());
        assert.equal('8AF8', beacon0.minor.toUpperCase());

        const payload2 = parse('1100FD8B01095712F10000030021D1793262296DDF445F65360123456789AB');
        assert.equal(1, payload2.bluetoothInfo.beacons.length);
      });

      it('testBluetoothPayload01MultipleBeacons', () => {
        const payload = parse('1100FD830108C4123322C2B98F6F32CA404CDB99046D500EF6834D00030001D5793262296DDF445F65360123456789AB');

        assert(Object.prototype.hasOwnProperty.call(payload, 'bluetoothInfo'));
        assert.equal('success', payload.bluetoothInfo.status);
        assert.equal(2, payload.bluetoothInfo.beacons.length);
        assert.equal(1, payload.bluetoothInfo.addSlotInfo);

        const beacon0 = payload.bluetoothInfo.beacons[0];
        assert.equal('altbeacon', beacon0.type);
        assert.equal(-69, beacon0.rssi);
        assert.equal('B98F6F32CA404CDB99046D500EF6834D', beacon0.id1.toUpperCase());
        assert.equal('0003', beacon0.id2.toUpperCase());
        assert.equal('0001', beacon0.id3.toUpperCase());

        const beacon1 = payload.bluetoothInfo.beacons[1];
        assert.equal('eddystone', beacon1.type);
        assert.equal(-79, beacon1.rssi);
        assert.equal('793262296DDF445F6536', beacon1.namespace.toUpperCase());
        assert.equal('0123456789AB', beacon1.instance.toUpperCase());
      });

      it('testBluetoothPayload02', () => {
        /*
           * 41 is de status, de 4 staat voor result + slot
           * daarom is nu wat volgt 2 bytes en niet 1. 00 geeft beacon type en
           * slot match aan( ibeacon en slot 0), en 35 staat voor de RSSI.
           * (zie ook dataspec screenshot hieronder)
           */
        const payload = parse('1100FD8301092C00A5 41 0035 00010002');

        assert(Object.prototype.hasOwnProperty.call(payload, 'bluetoothInfo'));
        assert.equal('success', payload.bluetoothInfo.status);
        assert.equal(1, payload.bluetoothInfo.beacons.length);
        assert.equal(2, payload.bluetoothInfo.addSlotInfo);

        const beacon0 = payload.bluetoothInfo.beacons[0];
        assert.equal('ibeacon', beacon0.type);
        assert.equal(-79, beacon0.rssi);
        assert.equal(0, beacon0.slot);
        assert.equal('0001', beacon0.major.toUpperCase());
        assert.equal('0002', beacon0.minor.toUpperCase());

        const payload2 = parse('11f6fd8b01090d037300a000a04105350123456789ab');
        const beacon20 = payload2.bluetoothInfo.beacons[0];
        assert.equal(1, beacon20.slot);
      });

      it('testHumidity', () => {
        const payload = parse('1000DB CB02 0925 25A6 00800090 0A0FC70FBA 17C7');

        assert(Object.prototype.hasOwnProperty.call(payload, 'externalSensor'));
        assert.equal('battery', payload.externalSensor.type);
        assert.equal(0x0FC7, payload.externalSensor.batteryA);
        assert.equal(0x0FBA, payload.externalSensor.batteryB);

        assert(Object.prototype.hasOwnProperty.call(payload, 'relativeHumidity'));
        assert.equal(60.87, payload.relativeHumidity);
      });

      it('testAirPressure', () => {
        const payload = parse('1100DBC30608F614BE0A0FC20FBB18A10186C2');

        assert(Object.prototype.hasOwnProperty.call(payload, 'airPressure'));
        assert.equal(100034, payload.airPressure);
      });

      it('testDetectSwitch', () => {
        const payload = parse('1000FDC1010908650100');

        assert(Object.prototype.hasOwnProperty.call(payload, 'externalSensor'));
        assert.equal('detectSwitch', payload.externalSensor.type);
        assert.equal(0x01, payload.externalSensor.value);
      });

      it('testManDown1', () => {
        const payload = parse('1400FD8708085E0316002003D000A000');
        assert(Object.prototype.hasOwnProperty.call(payload, 'manDown'));
        assert.equal('ok', payload.manDown.state);
        assert.equal(false, payload.manDown.positionAlarm);
        assert.equal(false, payload.manDown.movementAlarm);
      });

      it('testManDown2', () => {
        const payload = parse('1700FD870809920316004003C0004001');
        assert(Object.prototype.hasOwnProperty.call(payload, 'manDown'));
        assert.equal('sleeping', payload.manDown.state);
      });

      it('testManDown3', () => {
        const payload = parse('1400FD870808670316002003E000A023');
        assert(Object.prototype.hasOwnProperty.call(payload, 'manDown'));
        assert.equal(false, payload.manDown.positionAlarm);
        assert.equal(true, payload.manDown.movementAlarm);
      })

      it('testGps', () => {
        const payload = parse('1903fd83080a47358601031eaac2bf03994faf0513131d00000000080a');
        assert(Object.prototype.hasOwnProperty.call(payload, 'gps'));
        assert.equal(3, payload.gps.navStat);
        assert.equal(51.4507455, payload.gps.latitude);
        assert.equal(6.0379055, payload.gps.longitude);
        assert.equal(129.9, payload.gps.altRef);
        assert.equal(19, payload.gps.hAcc);
        assert.equal(29, payload.gps.vAcc);
        assert.equal(0, payload.gps.sog);
        assert.equal(0, payload.gps.cog);
        assert.equal(0.8, payload.gps.hdop);
        assert.equal(10, payload.gps.numSvs);
      })
    });
  })


});

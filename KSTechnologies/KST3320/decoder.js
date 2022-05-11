/** 
 * @file     decoder.js
 * @brief    KST3320 Decoder for use on Helium
 * @author   DS
 * @version  1.0.0
 * @date     2022-03-29
 */
/* {{{ ------------------------------------------------------------------ */
/** 
 * @licence
 * Copyright (c) 2019 - 2022, KS Technologies, LLC
 * 
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form, except as embedded into a KS Technologies
 *    product or a software update for such product, must reproduce the above 
 *    copyright notice, this list of conditions and the following disclaimer in 
 *    the documentation and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of KS Technologies nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 * 
 * 4. This software, with or without modification, must only be used with a
 *    KS Technologies, LLC product.
 * 
 * 5. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 * 
 * THIS SOFTWARE IS PROVIDED BY KS TECHNOLOGIES LLC "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL KS TECHNOLOGIES, LLC OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
/* ------------------------------------------------------------------ }}} */

function Decoder(bytes, port, uplink_info) {

    /*
        The following examples show how to parse the various KST3320 uplinks.
        The below are the data types for the KST3320:
        0x82 = Distance
        0x78 = Battery
        0x88 = GPS & Extended GPS (If ADR is supported)
        
        The first byte will be the LoRa Channel which will equal 0x01 for each data type.
        
        Here is an example of a Distance uplink: 
        01 82 00 36
         0  1  2  3
        
        Decoded, that appears as:
        * LoRa Channel: 0x01 = 1
        * Distance Data Type: 0x82 = 130
        * Distance: 0x0036 = 54mm
         
        Here is an example of the Battery uplink:
        01 78 63
         0  1  2
        
        Decoded, that appears as:
        * LoRa Channel: 0x01 = 1
        * Battery Data Type: 0x78 = 120
        * Battery: 0x63 = 99%
        
        Here is an example of a GPS uplink:
        01 88 05 F3 71 F0 06 17 03 72 EE
         0  1  2  3  4  5  6  7  8  9 10
        
        Decoded, that appears as:
        * LoRa Channel: 0x01 = 1
        * GPS Data Type: 0x88 = 136
        * Latitude: 0x05F371 = 39.0001°
        * Longitude: 0xF00617 = 104.7016°
        * Altitude: 0x0372EE = 2260.30 meters
        
        Here is an example of an Extended GPS uplink:
        01 88 05 F3 71 F0 06 17 03 72 EE 00 01 8D 80 00 00 FA 36 04
         0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
        
        Decoded, that appears as:
        * LoRa Channel: 0x01 = 1
        * GPS Data Type: 0x88 = 136
        * Latitude: 0x05F371 = 39.0001°
        * Longitude: 0xF00617 = 104.7016°
        * Altitude: 0x0372EE = 2260.30 meters
        * Horizontal Accuracy: 0x00018D80 = 101.760 meters
        * Vertical Accuracy: 0x0000FA36 = 64.054 meters
        * # of Satellites: 0x04 = 4
        
        Helium Console offers the ability to test your decoder by using the
        Script Validator. It is encouraged that you paste the Byte-level
        examples above and ensure your decoder is correct before deploying
        to your server.
        */

    // LoRa Channel
    var loraChan = bytes[0];

    // Data Type
    var dataType = bytes[1];

    // Parsing through the various Data Types
    // 0x82 = Distance (130)
    // 0x78 = Battery (120)
    // 0x88 = GPS & Extended GPS (136)
    if (dataType == 0x82) {
        var distance = bytes[2] << 8 | bytes[3];

        // Fill Level
        /*
            If you would like to calculate the Distance as a percentage based on your application,
            you can use the following to do so directly in the decoder.

            The heightAboveFillLine is the distance from the bottom of the KST3320 to the top of
            the application that you are measuring.

            The distanceToBottom is the total height of the application that you are measuring.

            If you wish not to use the Fill Level within the decoder, feel free to comment it out.
        */
        var heightAboveFillLine = 0;
        var distanceToBottom = 4000;
        var calculatedPercentage;

        calculatedPercentage = 100 - (100 * ((distance - heightAboveFillLine) / distanceToBottom));

        if (calculatedPercentage >= 100) calculatedPercentage = 100;
        if (calculatedPercentage < 0) calculatedPercentage = 0;

        var fillLevel = calculatedPercentage;

    } else if (dataType == 0x78) {
        var battery = bytes[2];

    } else if (dataType == 0x88 && bytes.length == 11) {
        var gps = bytes[2] << 16 | bytes[3] << 8 | bytes[4];
        if (gps > 0x80000) {
            gps -= 0xFFFFFF
        }
        var lat = gps / 10000

        var gps = bytes[5] << 16 | bytes[6] << 8 | bytes[7];
        if (gps > 0x80000) {
            gps -= 0xFFFFFF
        }
        var lon = gps / 10000

        var location = "(" + lat + "," + lon + ")"

        var gps = bytes[8] << 16 | bytes[9] << 8 | bytes[10];
        var alt = gps / 100

    } else if (dataType == 0x88 && bytes.length == 20) {
        var gpsext = bytes[2] << 16 | bytes[3] << 8 | bytes[4];
        if (gpsext > 0x80000) {
            gpsext -= 0xFFFFFF
        }
        var lat = gpsext / 10000

        var gpsext = bytes[5] << 16 | bytes[6] << 8 | bytes[7];
        if (gpsext > 0x80000) {
            gpsext -= 0xFFFFFF
        }
        var lon = gpsext / 10000

        var location = "(" + lat + "," + lon + ")"

        var gpsext = bytes[8] << 16 | bytes[9] << 8 | bytes[10];
        var alt = gpsext / 100

        var gpsext = bytes[11] << 24 | bytes[12] << 16 | bytes[13] << 8 | bytes[14];
        var accuHorz = gpsext / 1000

        var gpsext = bytes[15] << 24 | bytes[16] << 16 | bytes[17] << 8 | bytes[18];
        var accuVert = gpsext / 1000

        var gpsext = bytes[19];
        var satellites = gpsext

    } else {

    }

    return {
        data: {
            loraChan: loraChan,
            dataType: dataType,
            distance: distance,
            fillLevel: fillLevel,
            battery: battery,
            lat: lat,
            lon: lon,
            location: location,
            altitude: alt,
            horizontalAccuracy: accuHorz,
            verticalAccuracy: accuVert,
            satellites: satellites
        }
    }

}
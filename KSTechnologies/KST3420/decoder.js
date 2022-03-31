/** 
 * @file     decoder.js
 * @brief    KST3420 Decoder for use on Helium
 * @author   DS
 * @author   BK
 * @version  1.0.0
 * @date     2022-03-28
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
        The following examples show how to parse the distance uplink.
        KST uses concatenated Key-Length-Value decoding for all of its
        LoRaWAN Uplinks. Following are the keys for the KST4620:
        0x0082 = Distance
        0x0089 = Relative Refletivity of the Detected Object
        0x0065 = Relative Ambient Light Level
        0x0078 = Battery
        
        Following every 2-byte Key is a 1-byte Length indicating how
        many bytes follow. Any payload that is in error consists of 0xFF
        and matches the Length of that standard payload.
        
        And, finally, the Value follows the Length and equal to the
        number of bytes specified in the Length.
           
        Here is an example of an uplink -
        00 82 02 00 41 00 89 02 38 35 00 65 02 94 00 00 78 02 11 46
         0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5  6  7  8  9

        Decoded, that appears as ...
        * Distance: 0x0041 > 65mm
        * Reflection: 0x3835 > 14,389 mcps (we suggest showing it as 14380/65535 = 0.219)
        * Ambient: 0x9400 > 37,888 mcps (we suggest showing it as 37888/65535 = 0.578 )
        * Battery: 0x1146 > 4,422mV (we suggest showing it as 4.422V)
        
        Helium Console offers the ability to test your decoder by using the
        Script Validator. It is encouraged that you paste the Byte-level
        examples above and ensure your decoder is correct before deploying
        to your server.
        */

    // Initialize variables
    var distanceInt = 0xFFFF;
    var reflectivityFloat = 0xFFFF;
    var ambientFloat = 0xFFFF;
    var batteryFloat = 0xFFFF;
    var errorDistance = 1;
    var errorReflectivity = 1;
    var errorAmbient = 1;

    // Battery (mV): Mask to make sure your final answer is just 2-bytes
    batteryFloat = ((bytes[18] & 0x00FF) << 8) | (bytes[19] & 0x00FF);
    if (batteryFloat == 0xFFFF) {
        error = 1;
    } else if (batteryFloat > 0x0000) {
        error = 0;
    }

    // Distance (mm): Mask to make sure your final answer is just 2-bytes
    distanceInt = ((bytes[3] & 0x00FF) << 8) | (bytes[4] & 0x00FF);
    if (distanceInt >= 0xFDE8) {
        errorDistance = 1;
    } else if (distanceInt > 0x0000) {
        errorDistance = 0;
    }

    // Reflectivity
    reflectivityFloat = ((bytes[8] & 0x00FF) << 8) | (bytes[9] & 0x00FF);
    if (reflectivityFloat == 0xFFFF) {
        errorReflectivity = 1;
    } else if (reflectivityFloat > 0x0000) {
        reflectivityFloat = reflectivityFloat / 65535.0
        reflectivityFloat = Number(reflectivityFloat.toFixed(3))
        errorReflectivity = 0;
    }

    // Ambient
    ambientFloat = ((bytes[13] & 0x00FF) << 8) | (bytes[14] & 0x00FF);
    if (ambientFloat == 0xFFFF) {
        errorAmbient = 1;
    } else if (ambientFloat > 0x0000) {
        ambientFloat = ambientFloat / 65535.0
        ambientFloat = Number(ambientFloat.toFixed(3))
        errorAmbient = 0;
    }

    // JSON Packet gets set to the server
    return {
        data: {
            distance: distanceInt,
            reflectivity: reflectivityFloat,
            ambient: ambientFloat,
            battery: batteryFloat,
            errorDistance: errorDistance,
            errorReflectivity: errorReflectivity,
            errorAmbient: errorAmbient

        }
    };
}
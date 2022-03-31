/** 
 * @file     decoder.js
 * @brief    KST3620 Decoder for use on Helium
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
        The following examples show how to parse the temperature uplink.
        KST uses concatenated Key-Length-Value decoding for all of its
        LoRaWAN Uplinks. Following are the keys for the KST3620:
        0x0067 = Temperature
        0x0078 = Battery
        
        Following every 2-byte Key is a 1-byte Length indicating how
        many bytes follow.
        
        And, finally, the Value follows the Length and equal to the
        number of bytes specified in the Length.
        
        Temperature is expressed in 2's Complement Notation and is
        multiplied by 16 to account for floating point numbers.
        Therefore, after taking the 2's Complement, divide by 16
        to get the final temperature in Celsius.
        
        Here is an example of an uplink with a negative temperature.
        00 67 02 FE 84 00 78 02 11 75 (Byte-level payload in Hex)
         0  1  2  3  4  5  6  7  8  9 (Byte Index)
        The 2-byte temperature payload is 0xFE84. Its value, then, is -380.
        Divide -380 by 16 to decipher final temperature as -23.75degC.
        
        Here is an example of an uplink with a positive temperature.
        00 67 02 01 59 00 78 02 11 75 (Byte-level payload in Hex)
         0  1  2  3  4  5  6  7  8  9 (Byte Index)
        After decoding, the temperature in this payload is +21.5625degC.
        
        The battery is easily decoded as 0x1175, or 4469mV. The number is
        never negative. A payload of 0xFFFF indicates an error condition.
        
        Helium Console offers the ability to test your decoder by using the
        Script Validator. It is encouraged that you paste the Byte-level
        examples above and ensure your decoder is correct before deploying
        to your server.
        */

    // Initialize variables
    var temperatureFloat = 0xFFFF;
    var batteryFloat = 0xFFFF;
    var error = 1;

    // Grab the MSB to determine if the temperature is positive or negative
    var tempMSB = bytes[3] >> 7;

    // If the tempMSB is equal to 1, the temperature is negative. Else positive.
    if (tempMSB == 0x01) {
        // Makes sure temperatureFloat is 2-bytes.
        temperatureFloat = ((bytes[3] & 0x00FF) << 8) | (bytes[4] & 0x00FF);

        // Take its 2's Complement
        temperatureFloat = -temperatureFloat;

        // Ensure the final answer is still just two bytes
        temperatureFloat = 0xFFFF & temperatureFloat;

        // Calculate the final temperature
        temperatureFloat = -1 * (temperatureFloat / 16.0);

        // All is well.
        error = 0;

    } else {
        temperatureFloat = ((bytes[3] & 0x00FF) << 8) | (bytes[4] & 0x00FF);
        temperatureFloat = temperatureFloat / 16.0;
        error = 0;
    }

    // Battery (mV): Mask to make sure your final answer is just 2-bytes
    batteryFloat = ((bytes[8] & 0x00FF) << 8) | (bytes[9] & 0x00FF);
    if (batteryFloat == 0xFFFF) {
        error = 1;
    } else if (batteryFloat > 0x0000) {
        error = 0;
    }

    return {
        data: {
            temperature: temperatureFloat,
            battery: batteryFloat,
            error: error
        }
    };
}
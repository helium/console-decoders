# ioTracker Payload Decoder

This repository contains a sample implementation for a parser that can decode the
payload that is sent by the trackers.

*Note*: This is not the actual decoder that is run on the ioTracker backend; so
payloads may differ from the results you receive from the ioTracker API.

## Usage
The `Decoder` function in the `decoder.js` is a self contained function, that
takes a `Buffer` as it's input and returns an `Object` containing the decoded payload.

### TTN compatibility
For TTN, `decoder_ttn.js` is required to be used instead of `decoder.js`. The reason is that TTN requires an older javascript version.

To re-generate the `decoder_ttn.js` from the base file; run `npm run build-ttn`.

## Testing
Make sure you also have all dev-dependencies installed, then run `npm test`

## Commandline testing
Execute `node test.js <payload>`, e.g., `node test.js 17ecfb8b010b1100001d804000430031520f9f680032520b45090034520f9722` to see the parsed result commandline

## Info
For the latest version/information, please refer to https://github.com/ioTracker/decoder-js

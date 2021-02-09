function Decoder(bytes, port) {
  // Decode plain text from hex.
  return {
      key_press: String.fromCharCode.apply(null, bytes)
  };
}

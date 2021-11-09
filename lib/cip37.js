"use strict";

try {
  var _require = require('@conflux-dev/conflux-address-rust'),
      _encode = _require.encode,
      _decode = _require.decode;

  module.exports = {
    encode: function encode(hexAddress, netId) {
      var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (Buffer.isBuffer(hexAddress)) {
        hexAddress = hexAddress.toString('hex');
      }

      return _encode(hexAddress, netId, verbose);
    },
    decode: function decode(base32) {
      var decoded = _decode(base32);

      if (!decoded) throw new Error('Decode failed');
      decoded.hexAddress = Buffer.from(decoded.hexAddress.slice(2), 'hex');
      return decoded;
    }
  };
} catch (e) {
  console.log('@conflux-dev/conflux-address-rust is not installed use purejs version');
  module.exports = require('./pure-js-cip37.js');
}
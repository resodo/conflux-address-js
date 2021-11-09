try {
  const { encode, decode } = require('@conflux-dev/conflux-address-rust')
  module.exports = {
    encode: function (hexAddress, netId, verbose = false) {
      if (Buffer.isBuffer(hexAddress)) {
        hexAddress = hexAddress.toString('hex')
      }
      return encode(hexAddress, netId, verbose)
    },
    decode
  }
} catch (e) {
  console.log('@conflux-dev/conflux-address-rust is not installed use purejs version')
  module.exports = require('./pure-js-cip37.js')
}

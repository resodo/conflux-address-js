try {
  const { encode, decode } = require('@conflux-dev/conflux-address-rust')
  module.exports = {
    encode: function (hexAddress, netId, verbose = false) {
      if (Buffer.isBuffer(hexAddress)) {
        hexAddress = hexAddress.toString('hex')
      }
      return encode(hexAddress, netId, verbose)
    },
    decode: function (base32) {
      const decoded = decode(base32)
      if (!decoded) throw new Error('Decode failed')
      decoded.hexAddress = Buffer.from(decoded.hexAddress.slice(2), 'hex')
      return decoded
    }
  }
} catch (e) {
  console.log('@conflux-dev/conflux-address-rust is not installed use purejs version')
  module.exports = require('./pure-js-cip37.js')
}

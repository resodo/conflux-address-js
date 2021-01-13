'use strict';
/** global: Buffer */

const VERSION_BYTE = 0;
const NET_ID_LIMIT = 0xFFFFFFFF;

let base32 = require('./base32');

function encodeNetId(netId) {
  if (!Number.isInteger(netId)) {
    throw new Error("netId should be passed as an integer")
  }
  if (netId <= 0 || netId > NET_ID_LIMIT) {
    throw new Error("netId should be passed as in range [1, 0xFFFFFFFF]")
  }

  switch (netId) {
    case 1:
      return "cfxtest";
    case 1029:
      return "cfx";
    default:
      return `net${netId}`
  }
}

function isValidNetId(netId) {
  return /^([1-9]\d*)$/.test(netId) && Number(str) <= NET_ID_LIMIT
}

function decodeNetId(payload) {
  switch (payload) {
    case "cfxtest":
      return 1;
    case "cfx":
      return 1029;
    default:
      let prefix = payload.slice(0, 3);
      let netId = payload.slice(3);
      if (prefix !== "net" || !isValidNetId(netId)) {
        throw new Error("netId prefix should be passed by 'cfx', 'cfxtest' or 'net[n]' ")
      }
      if (Number(netId) === 1 || Number(netId) === 1029) {
        throw new Error("net1 or net1029 are invalid")
      }
      return Number(netId)
  }
}

function encodePayload(hexAddress) {
  return Buffer.concat([Buffer.from([VERSION_BYTE]), hexAddress])
}

function decodePayload(payload) {
  if (payload[0] !== VERSION_BYTE) {
    throw new Error("Can not recognize version byte")
  }
  return Buffer.from(payload.slice(1))
}

function encode(hexAddress, netId) {
  if (!(hexAddress instanceof Buffer)) {
    throw new Error("hexAddress should be passed as a Buffer")
  }

  return base32.encode(
    encodeNetId(netId),
    base32.toWords(encodePayload(hexAddress))
  )
}

function decode(address) {
  let result = base32.decode(address);
  let data = base32.fromWords(result.words);
  if (data.length < 1) {
    throw new Error("Empty payload in address")
  }

  return {
    hexAddress: decodePayload(data),
    netId: decodeNetId(result.prefix)
  }
}

module.exports = {decode: decode, encode: encode};

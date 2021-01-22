'use strict';
/** global: Buffer */

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var VERSION_BYTE = 0;
var NET_ID_LIMIT = 0xFFFFFFFF;

var base32 = require('./base32');

function encodeNetId(netId) {
  if (!Number.isInteger(netId)) {
    throw new Error('netId should be passed as an integer');
  }

  if (netId <= 0 || netId > NET_ID_LIMIT) {
    throw new Error('netId should be passed as in range [1, 0xFFFFFFFF]');
  }

  switch (netId) {
    case 1:
      return 'cfxtest';

    case 1029:
      return 'cfx';

    default:
      return "net".concat(netId);
  }
}

function isValidNetId(netId) {
  return /^([1-9]\d*)$/.test(netId) && Number(netId) <= NET_ID_LIMIT;
}

function decodeNetId(payload) {
  switch (payload) {
    case 'cfxtest':
      return 1;

    case 'cfx':
      return 1029;

    default:
      {
        var prefix = payload.slice(0, 3);
        var netId = payload.slice(3);

        if (prefix !== 'net' || !isValidNetId(netId)) {
          throw new Error("netId prefix should be passed by 'cfx', 'cfxtest' or 'net[n]' ");
        }

        if (Number(netId) === 1 || Number(netId) === 1029) {
          throw new Error('net1 or net1029 are invalid');
        }

        return Number(netId);
      }
  }
}

function encodePayload(hexAddress) {
  return Buffer.concat([Buffer.from([VERSION_BYTE]), hexAddress]);
}

function decodePayload(payload) {
  if (payload[0] !== VERSION_BYTE) {
    throw new Error('Can not recognize version byte');
  }

  return Buffer.from(payload.slice(1));
}

function getAddressType(hexAddress) {
  if (hexAddress.length < 1) {
    throw new Error('Empty payload in address');
  }

  switch (hexAddress[0] & 0xf0) {
    case 0x10:
      return 'user';

    case 0x80:
      return 'contract';

    case 0x00:
      var _iterator = _createForOfIteratorHelper(hexAddress),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var x = _step.value;

          if (x !== 0x00) {
            return 'builtin';
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return 'null';

    default:
      throw new Error('hexAddress should start with 0x0, 0x1 or 0x8');
  }
}

function encode(hexAddress, netId) {
  var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!(hexAddress instanceof Buffer)) {
    throw new Error('hexAddress should be passed as a Buffer');
  }

  if (hexAddress.length < 20) {
    throw new Error('hexAddress should be at least 20 bytes');
  }

  var addressType = getAddressType(hexAddress);
  var encodedAddress = base32.encode(encodeNetId(netId), base32.toWords(encodePayload(hexAddress)));

  if (verbose) {
    var _encodedAddress$split = encodedAddress.split(':'),
        _encodedAddress$split2 = _slicedToArray(_encodedAddress$split, 2),
        prefix = _encodedAddress$split2[0],
        payload = _encodedAddress$split2[1];

    encodedAddress = [prefix, "type.".concat(addressType), payload].join(':').toUpperCase();
  }

  return encodedAddress;
}

function decode(address) {
  // don't allow mixed case
  var lowered = address.toLowerCase();
  var uppered = address.toUpperCase();

  if (address !== lowered && address !== uppered) {
    throw new Error('Mixed-case address ' + address);
  }

  var splits = address.split(':');
  var shouldHaveType = '';
  var reducedAddress = address;

  if (splits.length === 3) {
    shouldHaveType = splits[1];
    reducedAddress = [splits[0], splits[2]].join(':');
  }

  var result = base32.decode(reducedAddress);
  var data = base32.fromWords(result.words);

  if (data.length < 1) {
    throw new Error('Empty payload in address');
  }

  var returnValue = {
    hexAddress: decodePayload(data),
    netId: decodeNetId(result.prefix),
    type: getAddressType(decodePayload(data))
  };

  if (shouldHaveType !== '' && "type.".concat(returnValue.type) !== shouldHaveType.toLowerCase()) {
    throw new Error('Type of address doesn\'t match');
  }

  return returnValue;
}

module.exports = {
  decode: decode,
  encode: encode
};
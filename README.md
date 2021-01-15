# conflux-address-js
The simple encoder and decoder for Conflux address.

Check [CIP-37](https://github.com/Conflux-Chain/CIPs/pull/53/) for the protocols.

## Usage

### Encoding

```javascript
const confluxAddr = require('conflux-address-js')
const hexBuffer = Buffer.from('106d49f8505410eb4e671d51f7d96d2c87807b09', 'hex')
const netId = 1029 // Conflux main-net

console.log(confluxAddr.encode(hexBuffer, netId))
// cfx:0086ujfsa1a11uuecwen3xytdmp8f03v140ypk3mxc

console.log(confluxAddr.encode(hexBuffer, netId, true)) // verbose mode to generate address with type
// cfx:type=user:0086ujfsa1a11uuecwen3xytdmp8f03v140ypk3mxc
```

### Decoding
```javascript
const confluxAddr = require('conflux-address-js')
console.log(confluxAddr.decode('cfx:0086ujfsa1a11uuecwen3xytdmp8f03v140ypk3mxc'))
/*
{ hexAddress:
   <Buffer 10 6d 49 f8 50 54 10 eb 4e 67 1d 51 f7 d9 6d 2c 87 80 7b 09>,
  netId: 1029,
  type: 'user' }
 */


console.log(confluxAddr.decode('cfx:type=user:0086ujfsa1a11uuecwen3xytdmp8f03v140ypk3mxc'))
/*
{ hexAddress:
   <Buffer 10 6d 49 f8 50 54 10 eb 4e 67 1d 51 f7 d9 6d 2c 87 80 7b 09>,
  netId: 1029,
  type: 'user' }
 */
```

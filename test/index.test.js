const conflux_addr = require('../lib/index.js');

function verify(hexAddress, netId, base32Address) {
  let hexBuffer = Buffer.from(hexAddress, 'hex');
  expect(conflux_addr.encode(hexBuffer, netId)).toBe(base32Address);
  expect(conflux_addr.decode(base32Address).hexAddress).toStrictEqual(hexBuffer);
  expect(conflux_addr.decode(base32Address).netId).toBe(netId);
}

test('test examples in CIP-37', () => {
  verify('106d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:0086ujfsa1a11uuecwen3xytdmp8f03v140ypk3mxc');
});

test('test examples in conflux-rust#2034', () => {
  verify('F5BF48B397DAE70BE82B3CCA4793F8EB2B6CDAC9', 1029, 'cfx:03uvyj5kjzdee2z85cycmhwkz3njpv6ut404kg24d3');
  verify('F5BF48B397DAE70BE82B3CCA4793F8EB2B6CDAC9', 1, 'cfxtest:03uvyj5kjzdee2z85cycmhwkz3njpv6ut4af004e99');
});

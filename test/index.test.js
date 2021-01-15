const conflux_addr = require('../lib/index.js')

function verify (hexAddress, netId, base32Address) {
  let verbose = false
  if (base32Address.split(':').length === 3) {
    verbose = true
  }

  const hexBuffer = Buffer.from(hexAddress, 'hex')
  expect(conflux_addr.encode(hexBuffer, netId, verbose)).toBe(base32Address)
  expect(conflux_addr.decode(base32Address).hexAddress).toStrictEqual(hexBuffer)
  expect(conflux_addr.decode(base32Address).netId).toBe(netId)
  if (verbose) {
    expect(`type.${conflux_addr.decode(base32Address).type}`).toBe(base32Address.split(':')[1])
  }
}

test('test examples in different types', () => {
  verify('106d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:0086ujfsa1a11uuecwen3xytdmp8f03v140ypk3mxc')
  verify('106d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:type.user:0086ujfsa1a11uuecwen3xytdmp8f03v140ypk3mxc')
  verify('806d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:0206ujfsa1a11uuecwen3xytdmp8f03v14ksvfyh2z')
  verify('806d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:type.contract:0206ujfsa1a11uuecwen3xytdmp8f03v14ksvfyh2z')
  verify('006d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:0006ujfsa1a11uuecwen3xytdmp8f03v1400dt9usz')
  verify('006d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:type.builtin:0006ujfsa1a11uuecwen3xytdmp8f03v1400dt9usz')
})

test('test examples in different networks', () => {
  verify('106d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:0086ujfsa1a11uuecwen3xytdmp8f03v140ypk3mxc')
  verify('806d49f8505410eb4e671d51f7d96d2c87807b09', 1, 'cfxtest:0206ujfsa1a11uuecwen3xytdmp8f03v14tk8zsv6n')
  verify('006d49f8505410eb4e671d51f7d96d2c87807b09', 10086, 'net10086:0006ujfsa1a11uuecwen3xytdmp8f03v14bdr0cv6c')
})

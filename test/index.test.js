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
    expect(`type.${conflux_addr.decode(base32Address).type}`).toBe(base32Address.split(':')[1].toLowerCase())
  }
}

test('test examples in different types', () => {
  verify('1a2f80341409639ea6a35bbcab8299066109aa55', 1029, 'cfx:aarc9abycue0hhzgyrr53m6cxedgccrmmyybjgh4xg')
  verify('1a2f80341409639ea6a35bbcab8299066109aa55', 1029, 'CFX:TYPE.USER:AARC9ABYCUE0HHZGYRR53M6CXEDGCCRMMYYBJGH4XG')
  verify('106d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:aajg4wt2mbmbb44sp6szd783ry0jtad5bea80xdy7p')
  verify('106d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'CFX:TYPE.USER:AAJG4WT2MBMBB44SP6SZD783RY0JTAD5BEA80XDY7P')
  verify('806d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:acag4wt2mbmbb44sp6szd783ry0jtad5bex25t8vc9')
  verify('806d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'CFX:TYPE.CONTRACT:ACAG4WT2MBMBB44SP6SZD783RY0JTAD5BEX25T8VC9')
  verify('006d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:aaag4wt2mbmbb44sp6szd783ry0jtad5beaar3k429')
  verify('006d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'CFX:TYPE.BUILTIN:AAAG4WT2MBMBB44SP6SZD783RY0JTAD5BEAAR3K429')
  verify('0000000000000000000000000000000000000000', 1029, 'cfx:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0sfbnjm2')
  verify('0000000000000000000000000000000000000000', 1029, 'CFX:TYPE.NULL:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0SFBNJM2')
})

test('test examples in different networks', () => {
  verify('106d49f8505410eb4e671d51f7d96d2c87807b09', 1029, 'cfx:aajg4wt2mbmbb44sp6szd783ry0jtad5bea80xdy7p')
  verify('806d49f8505410eb4e671d51f7d96d2c87807b09', 1, 'cfxtest:acag4wt2mbmbb44sp6szd783ry0jtad5be3xj925gz')
  verify('006d49f8505410eb4e671d51f7d96d2c87807b09', 10086, 'net10086:aaag4wt2mbmbb44sp6szd783ry0jtad5benr1ap5gp')
})

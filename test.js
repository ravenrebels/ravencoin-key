const RavencoinHandler = require("./dist/main");
test("Random mnemonic should contain 12 words", () => {
  const mnemonic = RavencoinHandler.generateMnemonic();

  expect(mnemonic.split(" ").length).toBe(12);
});

test("Validate address", () => {
  const mnemonic =
    "orphan resemble brain dwarf bus fancy horn among cricket logic duty crater";
  const address = RavencoinHandler.getDerivedAddress(mnemonic, 0, 1);
  expect(address.external.address).toBe("RKbP9SMo2KTKWsiTrEDhTWPuaTwfuPiN8G");
});


test("Validate Wallet Import Format (WIF) ", () => {
  const mnemonic =
    "orphan resemble brain dwarf bus fancy horn among cricket logic duty crater";
  const address = RavencoinHandler.getDerivedAddress(mnemonic, 0, 1);
  console.log(address);
  expect(address.external.WIF).toBe("KyWuYcev1hJ7YJZTjWx8coXNRm4jRbMEhgVVVC8vDcTaKRCMASUE");
});

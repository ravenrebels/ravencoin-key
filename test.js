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

const RavencoinKey = require("./dist/main");

test("Random mnemonic should contain 12 words", () => {
  const mnemonic = RavencoinKey.generateMnemonic();
  expect(mnemonic.split(" ").length).toBe(12);
});

test("Validate address on main-net", () => {
  const network = "rvn";
  const mnemonic =
    "orphan resemble brain dwarf bus fancy horn among cricket logic duty crater";
  const address = RavencoinKey.getAddressPair(network, mnemonic, 0, 1);
  expect(address.external.address).toBe("RKbP9SMo2KTKWsiTrEDhTWPuaTwfuPiN8G");
});

test("Validate address on test-net", () => {
  const network = "rvn-test";
  const mnemonic =
    "orphan resemble brain dwarf bus fancy horn among cricket logic duty crater";
  const address = RavencoinKey.getAddressPair(network, mnemonic, 0, 1);
  expect(address.external.address).toBe("mqq9MyZVEX61Dypt6dCxBuH2gC5nCUpTg6");
});

test("Validate Wallet Import Format (WIF) main-net ", () => {
  const network = "rvn";
  const mnemonic =
    "orphan resemble brain dwarf bus fancy horn among cricket logic duty crater";
  const address = RavencoinKey.getAddressPair(network, mnemonic, 0, 1);

  expect(address.internal.address).toBe("RLnvUoy29k3QiQgtR6PL416rSNfHTuwhyU");
  expect(address.external.WIF).toBe(
    "KyWuYcev1hJ7YJZTjWx8coXNRm4jRbMEhgVVVC8vDcTaKRCMASUE"
  );
});

test("Validate Wallet Import Format (WIF) test-net ", () => {
  const network = "rvn-test";
  const mnemonic =
    "orphan resemble brain dwarf bus fancy horn among cricket logic duty crater";
  const address = RavencoinKey.getAddressPair(network, mnemonic, 0, 1);

  expect(address.external.WIF).toBe(
    "cPsu1XemSkzNhk2j7vmFz82S3zN963SvmidxbcbRij7aaAFdPAnj"
  );
});

test("Validate get public address from Wallet Import Format (WIF) main-et ", () => {
  const network = "rvn";
  const WIF = "KyWuYcev1hJ7YJZTjWx8coXNRm4jRbMEhgVVVC8vDcTaKRCMASUE";
  const addressObject = RavencoinKey.getAddressByWIF(network, WIF);

  expect(addressObject.address).toBe("RKbP9SMo2KTKWsiTrEDhTWPuaTwfuPiN8G");
});

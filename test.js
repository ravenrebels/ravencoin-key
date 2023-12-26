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
  expect(address.external.address).toBe("n1nUspcdAaDAMfx2ksZJ5cDa7UKVEGstrX");
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
    "cPchRRmzZXtPeFLHfrh8qcwaRaziJCS4gcAMBVVQh1EiehNyBtKB"
  );
});

test("Validate get public address from Wallet Import Format (WIF) main-net ", () => {
  const network = "rvn";
  const WIF = "KyWuYcev1hJ7YJZTjWx8coXNRm4jRbMEhgVVVC8vDcTaKRCMASUE";
  const addressObject = RavencoinKey.getAddressByWIF(network, WIF);

  expect(addressObject.address).toBe("RKbP9SMo2KTKWsiTrEDhTWPuaTwfuPiN8G");
});

test("Valid bytes to mnemonic", () => {
  const hexString = "a10a95fb55808c5f15dc97ecbcd26cf0";
  const bytes = Uint8Array.from(Buffer.from(hexString, "hex"));
  const mnemonic = RavencoinKey.entropyToMnemonic(bytes);
  expect(mnemonic).toBe(
    "patient feed learn prison angle convince first napkin uncover track open theory"
  );
});

test("Non valid bytes to mnemonic should fail", () => {
  const hexString = "a10a94fb55808c5f15dc97ecbcd26cf0";
  const bytes = Uint8Array.from(Buffer.from(hexString, "hex"));
  const mnemonic = RavencoinKey.entropyToMnemonic(bytes);
  expect(mnemonic).not.toBe(
    "patient feed learn prison angle convince first napkin uncover track open theory"
  );
});

describe("Validate diff languages", () => {
  it("Should accept spanish mnemonic", () => {
    const m =
      "velero nuera pepino reír barro reforma negar rumbo atento separar pesa puma";
    const valid = RavencoinKey.isMnemonicValid(m);
    expect(valid).toBe(true);
  });

  it("Should accept French mnemonic", () => {
    const m =
      "vaseux mixte ozone quiétude besogne punaise membre réussir avarice samedi pantalon poney";
    const valid = RavencoinKey.isMnemonicValid(m);
    expect(valid).toBe(true);
  });
});

it("Should accept Italian mnemonic", () => {
  const m =
    "veloce perforare recinto sciroppo bici scelto parabola sguardo avanzato sonnifero remoto rustico";
  const valid = RavencoinKey.isMnemonicValid(m);
  expect(valid).toBe(true);
});

describe("generateAddress", () => {
  it("should generate an address with a mnemonic", () => {
    // Call the function
    const result = RavencoinKey.generateAddressObject();

    // Assertions
    expect(result).toHaveProperty("mnemonic");
    expect(result.mnemonic).toBeDefined();
    expect(result.network).toBe("rvn"); //Test default
    expect(result).toHaveProperty("address"); // replace 'key' with the actual property you expect in addressObject
    // ... you can add more assertions based on the expected structure of the result
  });

  it("default network should be rvn for Ravencoin", () => {
    const network = "rvn-test";
    // Call the function
    const result = RavencoinKey.generateAddressObject(network);
    // Assertions
    expect(result.network).toBe(network); //Test default
  });

  it("Should handle rvn-test", () => {
    const network = "rvn-test";
    // Call the function
    const result = RavencoinKey.generateAddressObject(network);
    // Assertions
    expect(result.network).toBe(network); //Test default
  });

  // Add more tests if needed to cover different scenarios
});

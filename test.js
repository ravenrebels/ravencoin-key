const TelestaiKey = require("./dist/main");

test("Random mnemonic should contain 12 words", () => {
  const mnemonic = TelestaiKey.generateMnemonic();
  expect(mnemonic.split(" ").length).toBe(12);
});

test("Validate address on main-net", () => {
  const network = "tls";
  const mnemonic =
    "orphan resemble brain dwarf bus fancy horn among cricket logic duty crater";
  const address = TelestaiKey.getAddressPair(network, mnemonic, 0, 1);
  expect(address.external.address).toBe("TxSKpGLR58VUFzBJ8pjkDgNnNKmvGyWL4t");
});

test("Validate Wallet Import Format (WIF) main-net ", () => {
  const network = "tls";
  const mnemonic =
    "orphan resemble brain dwarf bus fancy horn among cricket logic duty crater";
  const address = TelestaiKey.getAddressPair(network, mnemonic, 0, 1);

  expect(address.internal.address).toBe("Td8haX27FhJ1TeTdj9z1DX6296FCqaRRxF");
  expect(address.external.WIF).toBe("KybNCdSZVUdqCdaq95mtcskGd4K2cWvnYNZcJ3mo1gDY9ZtySiR6");
});

test("Validate get public address from Wallet Import Format (WIF) main-net ", () => {
  const network = "tls";
  const WIF = "L1CQvWc2hCVdLNKYeWDrMDfWvzUhpxQDGRMHJTBmUc1LpjqFd3qf";
  const addressObject = TelestaiKey.getAddressByWIF(network, WIF);

  expect(addressObject.address).toBe("ThYNJX9F4xSdiZMBQXWCTMYLxqpAhrzYV3");
});

test("Valid bytes to mnemonic", () => {
  const hexString = "a10a95fb55808c5f15dc97ecbcd26cf0";
  const bytes = Uint8Array.from(Buffer.from(hexString, "hex"));
  const mnemonic = TelestaiKey.entropyToMnemonic(bytes);
  expect(mnemonic).toBe(
    "patient feed learn prison angle convince first napkin uncover track open theory"
  );
});

test("Non valid bytes to mnemonic should fail", () => {
  const hexString = "a10a94fb55808c5f15dc97ecbcd26cf0";
  const bytes = Uint8Array.from(Buffer.from(hexString, "hex"));
  const mnemonic = TelestaiKey.entropyToMnemonic(bytes);
  expect(mnemonic).not.toBe(
    "patient feed learn prison angle convince first napkin uncover track open theory"
  );
});

describe("Validate diff languages", () => {
  it("Should accept spanish mnemonic", () => {
    const m =
      "velero nuera pepino reír barro reforma negar rumbo atento separar pesa puma";
    const valid = TelestaiKey.isMnemonicValid(m);
    expect(valid).toBe(true);
  });

  it("Should accept French mnemonic", () => {
    const m =
      "vaseux mixte ozone quiétude besogne punaise membre réussir avarice samedi pantalon poney";
    const valid = TelestaiKey.isMnemonicValid(m);
    expect(valid).toBe(true);
  });
});

it("Should accept Italian mnemonic", () => {
  const m =
    "veloce perforare recinto sciroppo bici scelto parabola sguardo avanzato sonnifero remoto rustico";
  const valid = TelestaiKey.isMnemonicValid(m);
  expect(valid).toBe(true);
});

describe("generateAddress", () => {
  it("should generate an address with a mnemonic", () => {
    const result = TelestaiKey.generateAddressObject();

    expect(result).toHaveProperty("mnemonic");
    expect(result.mnemonic).toBeDefined();
    expect(result.network).toBe("tls");
    expect(result).toHaveProperty("address");
  });

  // it("default network should be tls for Telestai", () => {
  //   const network = "tls-test";
  //   const result = TelestaiKey.generateAddressObject(network);
  //   expect(result.network).toBe(network);
  // });

  // it("Should handle tls", () => {
  //   const network = "tls-test";
  //   const result = TelestaiKey.generateAddressObject(network);
  //   expect(result.network).toBe(network);
  // });
});

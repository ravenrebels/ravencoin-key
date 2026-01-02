# @ravenrebels/ravencoin-key

Generate Ravencoin and Evrmore addresses from a mnemonic phrase following the standards **BIP32**, **BIP39**, and **BIP44**.

Professional, lightweight, and easy-to-use library for handling hierarchical deterministic (HD) keys and addresses.

---

## Quick Start

The easiest way to generate a new wallet with a random mnemonic:

```typescript
import RavencoinKey from "@ravenrebels/ravencoin-key";

const wallet = RavencoinKey.generateAddressObject("rvn");
console.log(wallet);
```

**Output:**
```json
{
  "address": "RKbP9SMo2KTKWsiTrEDhTWPuaTwfuPiN8G",
  "mnemonic": "orphan resemble brain dwarf bus fancy horn among cricket logic duty crater",
  "privateKey": "a5592434532a09a73350906f7846d272135a56b5a34d900659b31d2bb1aa6dfe",
  "publicKey": "038949bfe6150838e253966636bf6dc374d8036cd699a81fbdd96b0042978145cb",
  "WIF": "KyWuYcev1hJ7YJZTjWx8coXNRm4jRbMEhgVVVC8vDcTaKRCMASUE",
  "network": "rvn",
  "path": "m/44'/175'/0'/0/0"
}
```

---

## Supported Networks

| Network Code | Description |
| :--- | :--- |
| `rvn` | Ravencoin Mainnet |
| `rvn-test` | Ravencoin Testnet |
| `evr` | Evrmore Mainnet |
| `evr-test` | Evrmore Testnet |

---

## Features & Examples

### Get External and Internal (Change) Addresses
Derive standard BIP44 address pairs.

```typescript
const mnemonic = "wrong breeze brick wrestle exotic erode news clown copy install marble promote";
const ACCOUNT = 0;
const POSITION = 0;

const addressPair = RavencoinKey.getAddressPair("rvn", mnemonic, ACCOUNT, POSITION);

// Returns custom objects for both internal (change) and external addresses
console.log(addressPair.external);
```

### High Performance Derivation
If you need to derive thousands of addresses, reuse the `hdKey` object for maximum performance.

```typescript
const hdKey = RavencoinKey.getHDKey("rvn", mnemonic);
const path = "m/44'/175'/0'/0/0";
const address = RavencoinKey.getAddressByPath("rvn", hdKey, path);
```

### Import via WIF (Wallet Import Format)
Get public info from a private WIF key.

```typescript
const WIF = "KyWuYcev1hJ7YJZTjWx8coXNRm4jRbMEhgVVVC8vDcTaKRCMASUE";
const addressObj = RavencoinKey.getAddressByWIF("rvn", WIF);

console.log(addressObj.address); // RKbP9...
console.log(addressObj.publicKey); // 03894...
```

---

## Installation

```bash
npm install @ravenrebels/ravencoin-key
```

---

## Technical Details

### BIP Standards Support
This library follows industry standards for HD wallets:
- **BIP32**: Hierarchical Deterministic Wallets.
- **BIP39**: Mnemonic code for generating deterministic keys.
- **BIP44**: Multi-Account Hierarchy for Deterministic Wallets.

### BIP44 Path Structure
`m / purpose' / coin_type' / account' / change / address_index`

For Ravencoin:
- **Purpose**: `44'`
- **Coin Type**: `175'`
- **Account**: `0'` (Default)
- **Change**: `0` (External) or `1` (Internal/Change)

---

## Development

### Build
Generate distribution files:
```bash
npm run build
```

### Test
Run the test suite (requires build):
```bash
npm test
```

---

## License
MIT

---
*Maintained by Raven Rebels / Dick Henrik Larsson*

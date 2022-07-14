# ravencoin-key

Generate Ravencoin addresses from a mnemonic phrase following the standards BIP32, BIP39, BIP44.

That is, use your 12 words to get addresses for Ravencoin main and test-net.

This package uses coininfo, hdkey and coinkey to generate Ravencoin addresses.

## Example get external and internal (change) addresses by path

A simple and "spot on" way to generate/derive addresses.

If you need brutal performance check out getAddressByPath example below.

```
import RavencoinKey from "@ravenrebels/ravencoin-key";
//Or import as CommonsJS module
//const RavencoinKey = require("@ravenrebels/ravencoin-key");

const mnemonic = RavencoinKey.generateMnemonic();
const ACCOUNT = 0; //default is zero
const POSITION = 0; //the first address for this wallet
const network = "rvn"; //or rvn-test for test-net
const addressPair = RavencoinKey.getAddressPair(
  network,
  mnemonic,
  ACCOUNT,
  POSITION
);

console.info("Mnemonic", mnemonic);

console.log(addressPair);
```

Outputs

```
Mnemonic opera mix rain frog renew come where basket inject manage choice book
{
  internal: {
    address: 'REj8jn44GxUGxtYvarnzUsZZPvGtjnUPd8',
    path: "m/44'/175'/0'/1/0",
    privateKey: <Buffer 59 1f 25 b5 8c 95 34 4e ee 61 c7 96 d0 d3 3a 0b 6c 7e 2b d9 f2 3d da 6e cb 57 1d 68 5a 48 e1 f5>,
    WIF: 'KzCx9yVMaMzbQZBW8qYY7p9hiptwJkbpr4nT5PsncfUpXFMM2rR2'
  },
  external: {
    address: 'RDR8m2Stop1VfZV2zZgT2RZjvQMsTpYyfZ',
    path: "m/44'/175'/0'/0/0",
    privateKey: <Buffer 23 a5 f4 47 99 d4 54 01 79 26 96 e4 7c 0a 01 2e 46 25 b7 17 bc ae 2a 73 16 49 c5 4b ee cc f5 02>,
    WIF: 'KxR1KukR5DiqKQecUnXFQwQ8NJxiaWyswz2E93dsCgbziYaVEA1f'
  },
  position: 0
}
```

## Example get the first public address for a wallet by BIP44 path

Note this is the fastest way to generate/derive addresses since we can re-use the hdKey object.

BUT its more technical since you have to provide the full BIP44 path.

```
import RavencoinKey from "@ravenrebels/ravencoin-key";

//use RavencoinKey.generateMnemonic() to generate mnemonic codes
const mnemonic =
  "Mnemonic erosion total live dial hamster helmet top response cash obey anger balcony";
const path = "m/44'/175'/0'/0/0";
const network = "rvn"; //or rvn-test for test-net
const hdKey = RavencoinKey.getHDKey("rvn", mnemonic);

const address = RavencoinKey.getAddressByPath(network, hdKey, path);

console.log(address);

```

Outputs

```
{
  address: 'RWj697pj6PijkEcJLW3BLPG4GKre3BtgRP',
  path: "m/44'/175'/0'/0/0",
  privateKey: <Buffer a5 59 24 34 53 2a 09 a7 33 50 90 6f 78 46 d2 72 13 5a 56 b5 a3 4d 90 06 59 b3 1d 2b b1 aa 6d fe>,
  WIF: 'L2m8GmGYVAkvUEtLdhbFidQW2Zn3fULpE7sbWgmXChygNEBPd1PK'
}
```

## How to import into your project
### ES6 module
```
//As ES6 module
import RavencoinKey from "@ravenrebels/ravencoin-key";
```
### CommonsJS module
```
//As CommonsJS module
const RavencoinKey = require("@ravenrebels/ravencoin-key");
```
### Browserify
```
//A browseriy:d version, with all the dependencies bundled for the web
<html>
  <body>
    <script src="./node_modules/@ravenrebels/ravencoin-key/dist/RavencoinKey.js"></script>
    <script>
      alert(RavencoinKey.generateMnemonic());
    </script>
  </body>
</html>
```

## install

` npm install @ravenrebels/ravencoin-key`

## build

` npm run build`

## test

`npm test`

Note, the tests run on the built version, so you need to build before you run the tests

## BIP32

> BIP32 is the specification which introduced the standard for hierarchical deterministic (HD) wallets and extended keys to Bitcoin. Deterministic wallets can generate multiple "child" key pair chains from a master private "root" key in a deterministic way.[5][6] With the adoption of this standard, keys could be transferred between wallet software with a single extended private key (xprv), greatly improving the interoperability of wallets.

Quote from: https://en.m.wikipedia.org/wiki/Bitcoin_Improvement_Proposals#BIP32

Source: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki

## BIP39

> BIP39 is a proposal describing the use of plain language words chosen from a specific word list,[8] and the process for using such a string to derive a random seed used to generate a wallet as described in BIP32. This approach of utilizing a mnemonic phrase offered a much more user friendly experience for backup and recovery of cryptocurrency wallets.

Quote from: https://en.m.wikipedia.org/wiki/Bitcoin_Improvement_Proposals#BIP39

Source: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki

## BIP44

> BIP44 defines a logical hierarchy for deterministic wallets based on an algorithm described in BIP32 and purpose scheme described in BIP43. It allows the handling of multiple coins, multiple accounts, external and internal chains per account and millions of addresses per chain

Quote from: https://en.m.wikipedia.org/wiki/Bitcoin_Improvement_Proposals#BIP44

Source: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki

`m / purpose' / coin_type' / account' / change / address_index`

So in the case of Ravencoin the path m/44'/175'/0'/0/0 says "give me the first address"

The first part m/44'/175' says that the purpose is to use BIP44 with Ravencoin (175). Consider that static code.

Accounts is deprecated and should be 0

Change: should be 0 or 1, 0 for external addresses and 1 for the change address

### Address gap limit

> Address gap limit is currently set to 20. If the software hits 20 unused addresses in a row, it expects there are no used addresses beyond this point and stops searching the address chain. We scan just the external chains, because internal chains receive only coins that come from the associated external chains.
>
> Wallet software should warn when the user is trying to exceed the gap limit on an external chain by generating a new address.

Source: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki

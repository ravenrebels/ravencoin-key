# ravencoin-key

Generate Ravencoin addresses from a mnemonic phrase following the standards BIP32, BIP39, BIP44.

That is, use your 12 words to get addresses for Ravencoin mainnet and testnet.
The library also support Evrmorecoin EVR, both mainnet and testnet.


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
const network = "rvn"; //or rvn-test for testnet
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
Mnemonic wrong breeze brick wrestle exotic erode news clown copy install marble promote
{
  internal: {
    address: 'RC7Vn28tGaNrJtBm8MX5RCeCvzMpqZ1MgG',
    path: "m/44'/175'/0'/1/0",
    privateKey: 'a2c71a4284ed6792debd68d830a10515051fd166ce00535bf9fd19573ed5413b',
    WIF: 'L2g8U3ZNBLBQcy5f6C67h2eosps3MGkNmeNnk6Y8fZiMdSB9TuCJ'
  },
  external: {
    address: 'RE8YxTSYYcftnbX56rnAEwaiddqaqt8UgX',
    path: "m/44'/175'/0'/0/0",
    privateKey: 'b998a218e6bfde7162460893f79afc14b82b14e368507f5a85de28848ea96439',
    WIF: 'L3SV871B2mpUPTvj4U38UEp3Ah3wCVukF7tG2btHgjkiUSXRftSw'
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
const network = "rvn"; //or rvn-test for testnet
const hdKey = RavencoinKey.getHDKey("rvn", mnemonic);

const address = RavencoinKey.getAddressByPath(network, hdKey, path);

console.log(address);

```

Outputs

```
{
  address: 'RWj697pj6PijkEcJLW3BLPG4GKre3BtgRP',
  path: "m/44'/175'/0'/0/0",
  privateKey: 'a5592434532a09a73350906f7846d272135a56b5a34d900659b31d2bb1aa6dfe',
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

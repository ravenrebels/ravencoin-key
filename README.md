# ravencoin-key

Generate Ravencoin addresses from a mnemonic phrase following the standards BIP32, BIP39, BIP44.

That is, use your 12 words to get addresses for Ravencoin main and test-net.

This package uses coinkey, hdkey and coinkey to generate Ravencoin addresses.

## Example get external and internal (change) addresses by path

A simple and "spot on" way to generate/derive addresses. 

If you need brutal performance check out getAddressByPath example below.
```
import RavencoinKey from "@ravenrebels/ravencoin-key";

const mnemonic = RavencoinKey.generateMnemonic();
const ACCOUNT = 0; //default is zero
const POSITION = 1; //the first address for this wallet
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
Mnemonic orphan medal tortoise can pioneer mirror road scrub sort chimney pig taxi
{
  internal: {
    address: 'RW2sBPBKikPyn1hgwnYtfALQF6ZsX26qsF',
    path: "m/44'/175'/0'/1/1",
    privateKey: <Buffer 64 ad 31 24 a5 7e 13 e4 62 ba 6c f2 f6 96 3b f4 59 51 bf b7 c2 35 94 32 24 a8 8c 0f a8 63 21 f0>,
    WIF: 'KzbQuFn3uhpkSPV39TGfAksoSJHSCeuejF3NYvbo6oCY9kzntXSf'
  },
  external: {
    address: 'RWCDqxekxfHX7RbgkpQ2NnWPR3VMAacP55',
    path: "m/44'/175'/0'/0/1",
    privateKey: <Buffer d9 8c b7 4a ff d4 09 91 5e d0 bc 1c e7 20 d8 5e d0 cf 8e 88 84 41 4b 57 47 88 64 e1 5e 29 66 24>,
    WIF: 'L4WbhLhhG8NbuNaH4HpWAumYvGJ9RsneS2DyaHLv8orLEKircVKh'
  },
  position: 1
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
const path = "m/44'/175'/0'/0/1";
const network = "rvn"; //or rvn-test for test-net
const hdKey = RavencoinKey.getHDKey("rvn", mnemonic);

const address = RavencoinKey.getAddressByPath(network, hdKey, path);

console.log(address);

```

Outputs

```
{
  address: 'RHNTijkjfM5jim31wj52suQPGEJpdC7s1r',
  path: "m/44'/175'/0'/0/1",
  privateKey: <Buffer d8 51 e3 d6 9c d3 76 a6 a2 0c 3d 30 fd 04 d7 f9 4b c4 3c 56 66 27 e0 22 42 5b 1a 4b 91 20 ae 2a>,
  WIF: 'L4UD3XsHkQ8huhbWeTFmqEb6FTLQQiPquB7CJkaN4fT9iL85GRW7'
}
```

## How to import into your project

```
//As ES6 module
import RavencoinKey from "@ravenrebels/ravencoin-key";
```

```
//As CommonsJS module
const RavencoinKey = require("@ravenrebels/ravencoin-key");
```

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

So in the case of Ravencoin the path m/44'/175'/0'/0/1 says "give me the first address"

The first part m/44'/175' says that the purpose is to use BIP44 with Ravencoin (175). Consider that static code.

Accounts is deprecated and should be 0

Change: should be 0 or 1, 0 for external addresses and 1 for the change address

### Address gap limit

> Address gap limit is currently set to 20. If the software hits 20 unused addresses in a row, it expects there are no used addresses beyond this point and stops searching the address chain. We scan just the external chains, because internal chains receive only coins that come from the associated external chains.
>
> Wallet software should warn when the user is trying to exceed the gap limit on an external chain by generating a new address.

Source: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki

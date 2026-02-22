//Gives us meta data about coins/chains
import { chains } from "@hyperbitjs/chains";

//bip39 from mnemonic to seed
import * as bip39 from "bip39";

import { Buffer } from "buffer";
// @ts-ignore: bs58check ESM exports a default but types do not
import bs58check from "bs58check";
import * as wif from "wif";

//From seed to key
//const HDKey = require("hdkey");
// @ts-ignore: esModuleInterop is not enabled for this project
import HDKey from "hdkey";
import { IAddressObject } from "./types";

//Could not declare Network as enum, something wrong with parcel bundler
export type Network = "rvn" | "rvn-test" | "evr" | "evr-test";

function getNetwork(name: Network) {
  const c = name.toLowerCase() as Network; //Just to be sure
  const map: Record<Network, any> = {
    rvn: (chains.rvn.mainnet as any).versions,
    "rvn-test": (chains.rvn.testnet as any)?.versions,
    evr: (chains.evr.mainnet as any).versions,
    "evr-test": (chains.evr.testnet as any)?.versions,
  };

  const network = map[c];
  if (!network) {
    throw new Error("network must be of value " + Object.keys(map).toString());
  }
  return network;
}
/**
 *
 * @param network
 * @returns the coin type for the network (blockchain), for example Ravencoin has coin type 175
 */
export function getCoinType(network: Network) {
  const chain = getNetwork(network);
  return chain.bip44;
}
/**
 * @param network - should have value "rvn", "rvn-test", "evr" or "evr-test"
 * @param mnemonic - your mnemonic
 * @param account - accounts in BIP44 starts from 0, 0 is the default account
 * @param position - starts from 0
 */
export function getAddressPair(
  network: Network,
  mnemonic: string,
  account: number,
  position: number
) {
  const hdKey = getHDKey(network, mnemonic);
  const coin_type = getCoinType(network);

  //https://github.com/satoshilabs/slips/blob/master/slip-0044.md

  //Syntax of BIP44
  //m / purpose' / coin_type' / account' / change / address_index
  const externalPath = `m/44'/${coin_type}'/${account}'/0/${position}`;
  const externalAddress = getAddressByPath(network, hdKey, externalPath);

  //change address
  const internalPath = `m/44'/${coin_type}'/${account}'/1/${position}`;
  const internalAddress = getAddressByPath(network, hdKey, internalPath);
  return {
    internal: internalAddress,
    external: externalAddress,
    position,
  };
}

export function getHDKey(network: Network, mnemonic: string): any {
  const chain = getNetwork(network);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const hdKey = HDKey.fromMasterSeed(seed, chain.bip32);
  return hdKey;
}

export function getAddressByPath(
  network: Network,
  hdKey: any,
  path: string
): IAddressObject {
  const chain = getNetwork(network);
  const derived = hdKey.derive(path);

  const pubKeyHashVersion = Buffer.from([chain.public]);
  // @ts-ignore - identifier exists on HDKey instances but not in types
  const addressBuffer = Buffer.concat([pubKeyHashVersion, derived.identifier]);
  const address = bs58check.encode(Uint8Array.from(addressBuffer));

  const wifString = wif.encode({
    version: chain.private,
    privateKey: derived.privateKey,
    compressed: true
  });

  return {
    address: address,
    path: path,
    privateKey: derived.privateKey!.toString("hex"),
    publicKey: derived.publicKey!.toString("hex"),
    WIF: wifString,
  };
}

export function generateMnemonic() {
  return bip39.generateMnemonic();
}

export function isMnemonicValid(mnemonic: string) {
  //Check all languages
  const wordlists = Object.values(bip39.wordlists);

  //If mnemonic is valid in any language, return true, otherwise false
  for (const wordlist of wordlists) {
    const v = bip39.validateMnemonic(mnemonic, wordlist);
    if (v === true) {
      return true;
    }
  }
  return false;
}
/**
 *
 * @param privateKeyWIF
 * @param network  should be "rvn" or "rvn-test"
 * @returns object {address, privateKey (hex), WIF}
 */

export function getAddressByWIF(network: Network, privateKeyWIF: string) {
  const chain = getNetwork(network);
  const decoded = wif.decode(privateKeyWIF);
  if (decoded.version !== chain.private) {
    throw new Error("Invalid WIF version for this network");
  }

  const hk = new HDKey();
  hk.privateKey = Buffer.from(decoded.privateKey);

  const pubKeyHashVersion = Buffer.from([chain.public]);
  // @ts-ignore - identifier exists on HDKey instances but not in types
  const addressBuffer = Buffer.concat([pubKeyHashVersion, (hk as any).identifier]);
  const address = bs58check.encode(Uint8Array.from(addressBuffer));

  return {
    address: address,
    privateKey: hk.privateKey!.toString("hex"),
    publicKey: hk.publicKey!.toString("hex"),
    WIF: privateKeyWIF,
  } as IAddressObject;
}

export const entropyToMnemonic = bip39.entropyToMnemonic;

export function generateAddressObject(
  network: Network = "rvn"
): IAddressObject {
  const mnemonic = generateMnemonic();
  const account = 0;
  const position = 0;
  const addressPair = getAddressPair(network, mnemonic, account, position);
  const addressObject = addressPair.external;

  const result = {
    ...addressObject,
    mnemonic,
    network,
  };
  return result;
}

/**
 * Generates a random Address Object
 *
 * @deprecated use generateAddressObject
 * @param network
 * @returns
 */
export function generateAddress(network: Network = "rvn") {
  return generateAddressObject(network);
}
const RavencoinKey = {
  entropyToMnemonic,
  generateAddress,
  generateAddressObject,
  generateMnemonic,
  getAddressByPath,
  getAddressByWIF,
  getAddressPair,
  getCoinType,
  getHDKey,
  isMnemonicValid,
};

export default RavencoinKey;

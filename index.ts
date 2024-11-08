//Gives us meta data about coins/chains
import { chains } from "@hyperbitjs/chains";

//bip39 from mnemonic to seed
import * as bip39 from "bip39";

const CoinKey = require("coinkey");

//From seed to key
//const HDKey = require("hdkey");
import HDKey from "hdkey";
import { IAddressObject } from "./types";

//Could not declare Network as enum, something wrong with parcel bundler
export type Network = "tls";

function getNetwork(name: Network) {
  if (name !== "tls") {
    throw new Error("network must be 'tls'");
  }

  return {
    bip32: {
      private: 0x0488ade4,
      public: 0x0488b21e,
    },
    bip44: 10117,
    private: 0x80,
    public: 0x42,
    scripthash: 0x7F,
  };
}
/**
 *
 * @param network
 * @returns the coin type for the network (blockchain)
 */
export function getCoinType(network: Network) {
  const chain = getNetwork(network);
  return chain.bip44;
}
/**
 * @param network - should have value "tls"
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
  const seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
  //From the seed, get a hdKey, can we use CoinKey instead?
  const hdKey = HDKey.fromMasterSeed(Buffer.from(seed, "hex"), chain.bip32);
  return hdKey;
}

export function getAddressByPath(
  network: Network,
  hdKey: any,
  path: string
): IAddressObject {
  const chain = getNetwork(network);
  const derived = hdKey.derive(path);
  var ck2 = new CoinKey(derived.privateKey, chain);

  return {
    address: ck2.publicAddress,
    path: path,
    privateKey: ck2.privateKey.toString("hex"),
    WIF: ck2.privateWif,
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
  const coinKey = CoinKey.fromWif(privateKeyWIF);
  coinKey.versions = getNetwork(network);

  return {
    address: coinKey.publicAddress,
    privateKey: coinKey.privateKey.toString("hex"),
    WIF: coinKey.privateWif,
  };
}

export const entropyToMnemonic = bip39.entropyToMnemonic;

export function generateAddressObject(
  network: Network = "tls"
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
export function generateAddress(network: Network = "tls") {
  return generateAddressObject(network);
}
export default {
  entropyToMnemonic,
  generateAddress,
  generateMnemonic,
  getAddressByPath,
  getAddressByWIF,
  getAddressPair,
  getCoinType,
  getHDKey,
  isMnemonicValid,
};

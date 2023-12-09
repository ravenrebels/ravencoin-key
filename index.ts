//Gives us meta data about coins/chains
import { chains } from "@hyperbitjs/chains";

//bip39 from mnemonic to seed
import * as bip39 from "bip39";

const CoinKey = require("coinkey");

//From seed to key
//const HDKey = require("hdkey");
import HDKey from "hdkey";

//Could not declare Network as enum, something wrong with parcel bundler
export type Network = "rvn" | "rvn-test" | "evr" | "evr-test";

function getNetwork(name: Network) {
  const c = name.toLowerCase(); //Just to be sure
  const map = {
    rvn: chains.rvn.mainnet.versions,
    "rvn-test": chains.rvn.testnet?.versions,
    evr: chains.evr.mainnet.versions,
    "evr-test": chains.evr.testnet?.versions,
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
  const seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
  //From the seed, get a hdKey, can we use CoinKey instead?
  const hdKey = HDKey.fromMasterSeed(Buffer.from(seed, "hex"), chain.bip32);
  return hdKey;
}

export function getAddressByPath(network: Network, hdKey: any, path: string) {
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
  return bip39.validateMnemonic(mnemonic);
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

export function generateAddress(network: Network = "rvn") {
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

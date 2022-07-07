//coininfo gives us meta data about a bunch of crypto currencies, including Ravencoin
import coininfo from "coininfo";

//bip39 from mnemonic to seed
import * as bip39 from "bip39";

const CoinKey = require("coinkey");

//From seed to key
const HDKey = require("hdkey");



//Could not declare Network as enum, something wrong with parcel bundler
export type Network = "rvn" | "rvn-test";

function getNetwork(name: Network) {
  const c = name.toLowerCase(); //Just to be sure

  if (c === "rvn") {
    return coininfo("RVN").versions;
  } else if (c === "rvn-test") {
    return coininfo("RVN-TEST").versions;
  }
  throw new Error("network must be of value 'rvn' or 'rvn-test'");
}

/** 
 * @param network - should have value "rvn" for main-net and "rvn-test" for test-net
 * @param mnemonic - your mnemonic
 * @param account - accounts in BIP44 starts from 0, 0 is the default account
 * @param position - starts from 1
 */
export function getAddressPair(
  network: Network,
  mnemonic: string,
  account: number,
  position: number
) {
  const hdKey = getHDKey(network, mnemonic);

  //Syntax of BIP44
  //m / purpose' / coin_type' / account' / change / address_index
  const externalPath = `m/44'/175'/${account}'/0/${position}`;
  const externalAddress = getAddressByPath(network, hdKey, externalPath);

  //change address
  const internalPath = `m/44'/175'/${account}'/1/${position}`;
  const internalAddress = getAddressByPath(network, hdKey, internalPath);
  return {
    internal: internalAddress,
    external: externalAddress,
    position,
  };
}

export function getHDKey(network: Network, mnemonic: string): any {
  const ravencoin = getNetwork(network);
  const seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
  //From the seed, get a hdKey, can we use CoinKey instead?
  const hdKey = HDKey.fromMasterSeed(Buffer.from(seed, "hex"), ravencoin.bip32);
  return hdKey;
}

export function getAddressByPath(network: Network, hdKey: any, path: string) {
  const ravencoin = getNetwork(network);
  const derived = hdKey.derive(path);
  var ck2 = new CoinKey(derived.privateKey, ravencoin);

  return {
    address: ck2.publicAddress,
    path: path,
    privateKey: derived.privateKey,
    WIF: ck2.privateWif,
  };
}

export function generateMnemonic() {
  return bip39.generateMnemonic();
}

export function isMnemonicValid(mnemonic) {
  return bip39.validateMnemonic(mnemonic);
}

export default {
  getAddressByPath,
  getAddressPair,
  generateMnemonic,
  isMnemonicValid,
};

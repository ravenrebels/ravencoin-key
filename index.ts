//coininfo gives us meta data about a bunch of crypto currencies, including Ravencoin
import coininfo from "coininfo";

//bip39 from mnemonic to seed
import * as bip39 from "bip39";

const CoinKey = require("coinkey");

//From seed to key
const HDKey = require("hdkey");

const ravencoin = coininfo("RAVENCOIN").versions;

/**  */
export function getDerivedAddress(
  mnemonic: string,
  account: number,
  position: number
) {
  const seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
  //From the seed, get a hdKey, can we use CoinKey instead?
  const hdKey = HDKey.fromMasterSeed(Buffer.from(seed, "hex"), ravencoin.bip32);

  //Syntax of BIP44
  //m / purpose' / coin_type' / account' / change / address_index
  const externalPath = `m/44'/175'/${account}'/0/${position}`;
  const externalAddress = getAddressByPath(hdKey, externalPath);

  //change address
  const internalPath = `m/44'/175'/${account}'/1/${position}`;
  const internalAddress = getAddressByPath(hdKey, internalPath);
  return {
    internal: internalAddress,
    external: externalAddress,
    position,
  };
}

export function getAddressByPath(hdKey, path) {
  const derived = hdKey.derive(path);
  var ck2 = new CoinKey(derived.privateKey, ravencoin);
  return {
    address: ck2.publicAddress,
    path: path,
    privateKey: derived.privateKey,
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
  generateMnemonic,
  getDerivedAddress,
  isMnemonicValid,
};

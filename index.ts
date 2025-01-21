//Gives us meta data about coins/chains
import { chains } from "@hyperbitjs/chains";

//bip39 from mnemonic to seed
import * as bip39 from "bip39";

//From seed to key
import { HDKey } from '@scure/bip32';
import { IAddressObject } from "./types";
import { ec as EC } from 'elliptic';
import bs58check from 'bs58check';
import { createHash } from 'crypto';

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

  const ec = new EC('secp256k1');
  const keyPair = ec.keyFromPrivate(derived.privateKey);
  const publicKey = keyPair.getPublic().encodeCompressed('hex');

  const sha256Hash = createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest();
  const publicKeyHash = createHash('ripemd160').update(sha256Hash).digest();

  const address = bs58check.encode(Buffer.concat([Buffer.from([chain.public]), publicKeyHash]));

  const wifBuffer = Buffer.concat([Buffer.from([chain.private]), derived.privateKey, Buffer.from([0x01])]);
  const wif = bs58check.encode(wifBuffer);

  return {
    address: address,
    path: path,
    privateKey: derived.privateKey.toString('hex'),
    WIF: wif,
  };
}

export function generateMnemonic() {
  return bip39.generateMnemonic();
}

export function isMnemonicValid(mnemonic: string) {
  const wordlists = Object.values(bip39.wordlists);

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
  const decoded = bs58check.decode(privateKeyWIF);
  const privateKey = Buffer.from(decoded.slice(1, 33));

  const ec = new EC('secp256k1');
  const keyPair = ec.keyFromPrivate(privateKey);
  const publicKey = keyPair.getPublic().encodeCompressed('hex');

  const sha256Hash = createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest();
  const publicKeyHash = createHash('ripemd160').update(sha256Hash).digest();

  const chain = getNetwork(network);
  const address = bs58check.encode(Buffer.concat([Buffer.from([chain.public]), publicKeyHash]));

  return {
    address: address,
    privateKey: privateKey.toString('hex'),
    WIF: privateKeyWIF,
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

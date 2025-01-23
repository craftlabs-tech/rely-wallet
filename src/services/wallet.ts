import type { NetworkId } from 'mina-signer';
import type { BitcoinWallet, EVMWallet, MinaWallet, SolanaWallet } from '@/store/wallet';

import ecc from '@bitcoinerlab/secp256k1';
import { BIP32Factory } from 'bip32';
import * as bip39 from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import * as bs58check from 'bs58check';
import * as ed25519 from 'ed25519-hd-key';
import { encodeBase58, ethers, isAddress, Mnemonic } from 'ethers';
import Client from 'mina-signer';
import nacl from 'tweetnacl';

import { ErrorLog, logger } from '@/services/logger';

export const generateMnemonic = () => bip39.generateMnemonic();

export const validateMnemonic = (mnemonic: string) => bip39.validateMnemonic(mnemonic);

export const validatePrivateKey = (privateKey: string) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    if (isAddress(wallet.address)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const createEVMWallet = (phrase: string, index = 0): Promise<EVMWallet> => {
  try {
    const derivationPath = `m/44'/60'/0'/0/${index}`;
    const mnemonic = Mnemonic.fromPhrase(phrase);
    const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic, derivationPath);

    return Promise.resolve({
      balance: 0,
      address: wallet.address,
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    });
  } catch (error) {
    logger.error(new ErrorLog(`Failed to create EVM wallet: ${JSON.stringify(error)}`), { type: 'error' });
    throw new Error('Failed to create EVM wallet');
  }
};

export const createSolanaWallet = (phrase: string, index = 0): Promise<SolanaWallet> => {
  try {
    const derivationPath = `m/44'/501'/${index}'/0'`;
    const seed = bip39.mnemonicToSeedSync(phrase);
    const derivedKey = ed25519.derivePath(derivationPath, seed.toString('hex'));
    const keyPair = nacl.sign.keyPair.fromSeed(derivedKey.key);
    const wallet = {
      balance: 0,
      address: encodeBase58(keyPair.publicKey),
      publicKey: encodeBase58(keyPair.publicKey),
      secretKey: encodeBase58(keyPair.secretKey),
      nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
    };
    return Promise.resolve(wallet);
  } catch (error) {
    logger.error(new ErrorLog(`Failed to create Solana wallet: ${JSON.stringify(error)}`), { type: 'error' });
    throw new Error('Failed to create Solana wallet');
  }
};

export const createMinaWallet = (phrase: string, network: NetworkId, index = 0): Promise<MinaWallet> => {
  try {
    const bip32 = BIP32Factory(ecc);
    const minaClient = new Client({ network });

    const derivationPath = `m/44'/12586'/${index}'/0/0`;
    const seed = bip39.mnemonicToSeedSync(phrase);
    const masterNode = bip32.fromSeed(seed);
    const childNode = masterNode.derivePath(derivationPath);

    if (childNode.privateKey) {
      // eslint-disable-next-line no-bitwise
      childNode.privateKey[0] &= 0x3f;
      const childPrivateKey = Buffer.from(childNode.privateKey).reverse();
      const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`;
      const privateKey = bs58check.default.encode(Buffer.from(privateKeyHex, 'hex'));
      const publicKey = minaClient.derivePublicKey(privateKey);
      const wallet = {
        publicKey,
        privateKey,
        address: publicKey,
        balance: 0,
        nativeCurrency: { name: 'MINA', symbol: 'MINA', decimals: 9 },
      };
      return Promise.resolve(wallet as MinaWallet);
    }
    return Promise.reject(new Error('No private key found'));
  } catch (error) {
    logger.error(new ErrorLog(`Failed to create Mina wallet: ${JSON.stringify(error)}`), { type: 'error' });
    throw new Error('Failed to create Mina wallet');
  }
};

export const createBitcoinWallet = async (phrase: string, index = 0): Promise<BitcoinWallet> => {
  try {
    const bip32 = BIP32Factory(ecc);
    const derivationPath = `m/84'/0'/0'/0/${index}`;
    const seed = await bip39.mnemonicToSeed(phrase);
    const keyPair = bip32.fromSeed(seed).derivePath(derivationPath);

    const wallet = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey });

    return {
      balance: 0,
      address: wallet.address as string,
      publicKey: wallet.address as string,
      nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 8 },
    };
  } catch (error) {
    logger.error(new ErrorLog(`Failed to create Bitcoin wallet: ${JSON.stringify(error)}`), { type: 'error' });
    throw new Error('Failed to create Bitcoin wallet');
  }
};

export const createWallet = async (phrase: string, index = 0) => {
  const wallets = await Promise.all([
    createEVMWallet(phrase, index),
    createSolanaWallet(phrase, index),
    createBitcoinWallet(phrase, index),
    createMinaWallet(phrase, 'mainnet', index),
  ]);
  return wallets;
};

import {
  decodeAminoPubkey,
  decodeBech32Pubkey,
  encodeAminoPubkey,
  encodeBech32Pubkey,
  encodeEd25519Pubkey,
  encodeSecp256k1Pubkey,
} from '@cosmjs/amino';
import { WalletAccount } from '@cosmos-kit/core';
import { useChain } from '@cosmos-kit/react';
import { arrayify } from '@ethersproject/bytes';
import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { toCanonicalJSONBytes } from '@tendermint/belt';
import {
  createSignature,
  createWalletFromMnemonic,
  sha256,
  sign,
  verifySignatureBytes,
} from '@tendermint/sig';
import { bech32 } from 'bech32';
import { Address as EthereumUtilsAddress } from 'ethereumjs-util';
import { Wallet } from 'ethers';
import React, { useEffect, useState } from 'react';
import {
  ecdsaVerify,
  ecdsaSign as secp256k1EcdsaSign,
  publicKeyCreate as secp256k1PublicKeyCreate,
} from 'secp256k1';

import './NotifiCard.css';
import { getEthereumMessage, verifyCosmos } from './verifyCosmos';

export const CosmosCard: React.FC = () => {
  const { signDirect, signAmino, address, getAccount } = useChain('injective');

  const [account, setAccount] = useState<WalletAccount | undefined>(undefined);

  useEffect(() => {
    if (address === undefined) {
      return;
    }
    getAccount()
      .then((acct) => {
        setAccount(acct);
      })
      .catch(() => {
        setAccount(undefined);
      });
  }, [address, getAccount]);

  if (account === undefined) {
    return null;
  }
  const pkey = Buffer.from(account.pubkey).toString('base64');

  return (
    <div className="container">
      <button
        onClick={async () => {
          const timestamp = Math.round(Date.now() / 1000);
          const msg = getEthereumMessage({
            walletPublicKey: pkey,
            dappAddress: 'junitest.xyz',
            timestamp,
          });

          const signDoc = {
            chain_id: '',
            account_number: '0',
            sequence: '0',
            fee: { gas: '0', amount: [] },
            memo: '',
            msgs: [
              {
                type: 'sign/MsgSignData',
                value: {
                  signer: account.address,
                  data: Buffer.from(msg).toString('base64'),
                },
              },
            ],
          };

          console.log('signing', account.address, pkey);

          const result = await signAmino(account.address, signDoc);
          console.log('result', result, result.signature.signature);

          const verified = verifyCosmos(
            {
              walletPublicKey: pkey,
              dappAddress: 'junitest.xyz',
              timestamp,
            },
            result.signature.signature,
          );

          console.log('verified:', verified);
        }}
      >
        CLICK ME
      </button>
      <NotifiContext
        dappAddress="junitest.xyz"
        walletBlockchain="ETHEREUM"
        env="Development"
        walletPublicKey={pkey}
        signMessage={async (msg) => {
          throw new Error('stop login');
        }}
      >
        <NotifiSubscriptionCard
          darkMode
          inputs={{ userWallet: address }}
          cardId="b469c6029e3f40aaab49ddd78fe7f228"
          onClose={() => alert('nope you must stay')}
          copy={{
            FetchedStateCard: {
              SubscriptionCardV1: {
                signUpHeader: 'Please sign up',
                EditCard: {
                  AlertListPreview: {
                    description:
                      'Get your alerts here!!! you can subscribe to any of the following:',
                  },
                },
              },
            },
          }}
        />
      </NotifiContext>
    </div>
  );
};

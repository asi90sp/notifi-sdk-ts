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
import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { verifySignatureBytes } from '@tendermint/sig';
import React, { useEffect, useState } from 'react';

import './NotifiCard.css';

export const CosmosCard: React.FC = () => {
  const { signAmino, address, getAccount } = useChain('injective');

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
      <NotifiContext
        dappAddress="junitest.xyz"
        walletBlockchain="ETHEREUM"
        env="Development"
        walletPublicKey={pkey}
        signMessage={async (msg) => {
          console.log('signing', account.address, pkey);

          console.log('msg', msg, Buffer.from(msg).toString('utf8'));
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

          const result = await signAmino(account.address, signDoc);
          console.log('result', signDoc, result);

          const stdSignMsg = {
            fee: { amount: [], gas: '0' },
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
            chain_id: '',
            account_number: '0',
            sequence: '0',
          };

          const verified = verifySignatureBytes(
            stdSignMsg,
            Buffer.from(result.signature.signature, 'base64'),
            Buffer.from(pkey, 'base64'),
          );

          console.log('Verifysignature', verified);

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

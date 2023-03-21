import { StdSignature, verifySignatureBytes } from '@tendermint/sig';

export const SIGNING_MESSAGE = `Sign in with Notifi \n\n    No password needed or gas is needed. \n\n    Clicking “Approve” only means you have proved this wallet is owned by you! \n\n    This request will not trigger any transaction or cost any gas fees. \n\n    Use of our website and service is subject to our terms of service and privacy policy. \n \n 'Nonce:' `;

export type CosmosSignatureParams = Readonly<{
  walletPublicKey: string;
  dappAddress: string;
  timestamp: number;
}>;

export const getEthereumMessage = (
  params: CosmosSignatureParams,
): Uint8Array => {
  const { walletPublicKey, dappAddress, timestamp } = params;
  const messageBuffer = new TextEncoder().encode(
    `${SIGNING_MESSAGE}${walletPublicKey}${dappAddress}${timestamp.toString()}`,
  );

  return messageBuffer;
};

export const verifyCosmos = (
  initialParams: CosmosSignatureParams,
  signature: string,
): boolean => {
  const msg = getEthereumMessage(initialParams);
  const stdSignMsg = {
    fee: { amount: [], gas: '0' },
    memo: '',
    msgs: [
      {
        type: 'sign/MsgSignData',
        value: {
          signer: initialParams.walletPublicKey,
          data: Buffer.from(msg).toString('base64'),
        },
      },
    ],
    chain_id: '',
    account_number: '0',
    sequence: '0',
  };

  return verifySignatureBytes(
    stdSignMsg,
    Buffer.from(signature, 'base64'),
    Buffer.from(initialParams.walletPublicKey, 'hex'),
  );
};

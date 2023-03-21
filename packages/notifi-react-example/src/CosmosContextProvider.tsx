import { wallets } from '@cosmos-kit/keplr';
import { ChainProvider, useChain, useWallet } from '@cosmos-kit/react';
import { assets, chains } from 'chain-registry';
import React, { PropsWithChildren } from 'react';

const BaseButton = React.forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements['button']
>((props, ref) => {
  return <button style={{ display: 'block' }} {...props} ref={ref} />;
});

const ConnectButton: React.FC = () => {
  const { connect } = useChain('injective');
  return (
    <BaseButton
      onClick={async () => {
        await connect();
      }}
    >
      Connect Wallet
    </BaseButton>
  );
};

const DisconnectButton: React.FC = () => {
  const { disconnect } = useChain('injective');
  return (
    <BaseButton
      onClick={async () => {
        await disconnect();
      }}
    >
      Disconnect
    </BaseButton>
  );
};

export const WalletButton: React.FC = () => {
  const { status } = useWallet();
  switch (status) {
    case 'Connecting':
      return <BaseButton disabled>Connecting</BaseButton>;
    case 'Connected':
      return <DisconnectButton />;
    case 'Disconnected':
    default:
      return <ConnectButton />;
  }
};

export const CosmosContextProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}: PropsWithChildren<{}>) => {
  return (
    <ChainProvider
      chains={chains} // supported chains
      assetLists={assets} // supported asset lists
      wallets={wallets} // supported wallets
    >
      <WalletButton />
      {children}
    </ChainProvider>
  );
};

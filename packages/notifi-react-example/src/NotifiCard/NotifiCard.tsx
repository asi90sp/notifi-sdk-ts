import '@notifi-network/notifi-react-card/dist/index.css';
import React from 'react';

import { AcalaWalletContextProvider } from '../AcalaWalletContextProvider';
import { EthosWalletProvider } from '../EthosWalletProvider';
import { KeplrWalletProvider } from '../KeplrWalletProvider';
import { SolanaWalletProvider } from '../SolanaWalletProvider';
import { WalletConnectProvider } from '../WalletConnectProvider';
import { DemoPrviewCard } from './DemoPreviewCard';
import { KeplrCard } from './KeplrCard';
import './NotifiCard.css';
import { PolkadotCard } from './PolkadotCard';
import { SolanaCard } from './SolanaCard';
import { SuiNotifiCard } from './SuiNotifiCard';
import { WalletConnectCard } from './WalletConnectCard';

enum ESupportedViews {
  DemoPreview = 'Dummy Demo Preview',
  Solana = 'Solana',
  WalletConnect = 'WalletConnect',
  Polkadot = 'Polkadot',
  Sui = 'Sui',
  Keplr = 'keplr',
}

const supportedViews: Record<ESupportedViews, React.ReactNode> = {
  [ESupportedViews.DemoPreview]: <DemoPrviewCard />,
  [ESupportedViews.Solana]: <SolanaCard />,
  [ESupportedViews.WalletConnect]: <WalletConnectCard />,
  [ESupportedViews.Polkadot]: <PolkadotCard />,
  [ESupportedViews.Sui]: <SuiNotifiCard />,
  [ESupportedViews.Keplr]: <KeplrCard />,
};

export const NotifiCard: React.FC = () => {
  const [view, setView] = React.useState<React.ReactNode>(<DemoPrviewCard />);

  const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value as ESupportedViews;
    const v = supportedViews[selected];
    if (v === undefined) {
      throw new Error('Unsupported type');
    }

    setView(v);
  };

  return (
    <div className="container">
      <select onChange={handleViewChange}>
        {Object.keys(supportedViews).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <WalletConnectProvider>
        <SolanaWalletProvider>
          <EthosWalletProvider>
            <AcalaWalletContextProvider>
              <KeplrWalletProvider>{view}</KeplrWalletProvider>
            </AcalaWalletContextProvider>
          </EthosWalletProvider>
        </SolanaWalletProvider>
      </WalletConnectProvider>
    </div>
  );
};

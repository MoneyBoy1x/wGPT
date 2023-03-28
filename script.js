import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
  apiKey: 'jQqpY89MAF6kRdp0QT_of9a2lv8_PHgD',
  network: Network.ETH_MAINNET,
};

export const alchemy = new Alchemy(settings);

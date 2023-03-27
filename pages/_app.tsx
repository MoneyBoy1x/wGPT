import '@/styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <main className={inter.className}>
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    </main>
  );
}

export default appWithTranslation(App);

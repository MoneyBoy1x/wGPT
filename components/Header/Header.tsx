import React from 'react';

type Props = {};

import { Logo } from '../../assets/logo';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { IoMdWallet } from 'react-icons/io';
import { IconChevronDown } from '@tabler/icons-react';

export default function Header({}: Props) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  return (
    <div className="overflow-none z-10 flex items-center  justify-between border-b border-slate-800   bg-[#071018] px-3">
      <Logo className="" />
      <div className="flex flex-col">
        {address ? (
          <button
            className="flex-start flex items-center space-x-2 rounded border border-slate-800 bg-[#101A27]  py-0.5 px-2 text-xs text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={() => disconnect()}
          >
            <IoMdWallet className="font-bod  h-6 w-6  rounded-full border border-white p-1 text-gray-200" />{' '}
            <div className=" flex flex-col items-start justify-start text-[9px] tracking-widest text-gray-100  ">
              <div className="m-0 -mb-1 text-[13px] font-semibold tracking-widest		">
                {' '}
                Main Account
              </div>
              {address.slice(0, 7) + '...' + address.slice(-7)}
            </div>
            <IconChevronDown className="h-4" />
          </button>
        ) : (
          <button
            className="rounded bg-[#101A27] py-3 px-2.5 text-sm font-medium text-black shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={() => connect()}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

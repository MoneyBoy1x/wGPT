import React from 'react';

type Props = {};

export default function Wallet({}: Props) {
  return (
    <div className="flex w-full flex-col border-b border-slate-800 pb-5">
      <div className="h-32 w-full border-b border-slate-800"></div>
      <div className="bg-blue -mt-7 ml-3 mb-3 h-14 w-14 rounded-full border border-slate-800 bg-slate-800">
        {' '}
      </div>
      <div className="flex w-full"></div>
    </div>
  );
}

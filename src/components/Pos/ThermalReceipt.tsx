import React from 'react';
import { Product } from '../../types/index.ts';
import { formatMoney, toBengaliDigits, amountInWordsBengali } from '../../lib/money.ts';
import { AJ_MOTORS_LOGO } from '../../constants/assets.ts';

export interface ReceiptData {
  invoiceNo: string;
  date: string;
  cashierName: string;
  customerName: string;
  customerPhone?: string;
  items: {
    productName: string;
    barcode?: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  changeAmount: number;
  dueAmount: number;
  paymentMethod: string;
}

interface ThermalReceiptProps {
  data: ReceiptData;
  isPrintOnly?: boolean;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({ data, isPrintOnly = false }) => {
  return (
    <div
      className={`thermal-receipt bg-white text-black p-4 font-sans text-xs leading-tight ${
        isPrintOnly ? 'print-only' : 'max-w-[340px] mx-auto shadow-md border border-neutral-300'
      }`}
      style={{
        width: '100%',
        maxWidth: '72mm',
        margin: '0 auto',
        color: '#000000',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Shop Header */}
      <div className="text-center pb-2">
        <img
          src={AJ_MOTORS_LOGO}
          alt="AJ MOTORS"
          className="h-9 w-auto mx-auto object-contain mb-1 filter grayscale contrast-200"
        />
        <h1 className="font-display text-2xl font-bold tracking-wider leading-none text-black">
          AJ MOTORS
        </h1>
        <p className="text-[11px] font-medium text-black mt-0.5">
          জেনুইন পার্টস ও সার্ভিস সেন্টার
        </p>
        <p className="text-[10px] text-neutral-800">
          মিরপুর-১০, ঢাকা (মেইন রোড)
        </p>
        <p className="text-[10px] text-neutral-800">
          ফোন: ০১৭০০-১১২২৩৩, ০১৮০০-৪৪৫৫৬৬
        </p>
      </div>

      {/* Dashed line */}
      <div className="border-b border-dashed border-black my-1.5" />

      {/* Meta info */}
      <div className="text-[10.5px] space-y-0.5">
        <div className="flex justify-between">
          <span className="font-semibold">ইনভয়েস:</span>
          <span className="font-mono font-bold">{data.invoiceNo}</span>
        </div>
        <div className="flex justify-between">
          <span>তারিখ:</span>
          <span>{data.date}</span>
        </div>
        <div className="flex justify-between">
          <span>ক্যাশিয়ার:</span>
          <span>{data.cashierName}</span>
        </div>
        <div className="flex justify-between">
          <span>গ্রাহক:</span>
          <span>{data.customerName} {data.customerPhone ? `(${data.customerPhone})` : ''}</span>
        </div>
      </div>

      {/* Dashed line */}
      <div className="border-b border-dashed border-black my-1.5" />

      {/* Item Table */}
      <table className="w-full text-left text-[11px] my-1">
        <thead>
          <tr className="border-b border-black text-[10px] font-bold">
            <th className="py-1 text-left">আইটেম</th>
            <th className="py-1 text-center w-8">পরি.</th>
            <th className="py-1 text-right w-12">দর</th>
            <th className="py-1 text-right w-14">মোট</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dotted divide-neutral-400">
          {data.items.map((item, idx) => (
            <tr key={idx} className="py-1">
              <td className="py-1 text-left pr-1">
                <div className="font-medium leading-tight">{item.productName}</div>
                {item.barcode && (
                  <div className="text-[9px] text-neutral-600 font-mono">
                    #{toBengaliDigits(item.barcode)}
                  </div>
                )}
              </td>
              <td className="py-1 text-center font-mono num">
                {toBengaliDigits(item.qty)}
              </td>
              <td className="py-1 text-right font-mono num">
                {toBengaliDigits(item.unitPrice.toFixed(0))}
              </td>
              <td className="py-1 text-right font-mono font-semibold num">
                {toBengaliDigits(item.lineTotal.toFixed(0))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dashed line */}
      <div className="border-b border-dashed border-black my-1.5" />

      {/* Totals */}
      <div className="text-[11px] space-y-1">
        <div className="flex justify-between">
          <span>সাবটোটাল:</span>
          <span className="font-mono num">{formatMoney(data.subtotal, { showCurrency: true })}</span>
        </div>

        {data.discount > 0 && (
          <div className="flex justify-between text-neutral-800">
            <span>ছাড় (ডিসকাউন্ট):</span>
            <span className="font-mono num">− {formatMoney(data.discount, { showCurrency: true })}</span>
          </div>
        )}

        <div className="border-t-2 border-black pt-1 flex justify-between items-baseline font-bold text-sm">
          <span>সর্বমোট বিল:</span>
          <span className="font-mono font-display text-base num">
            {formatMoney(data.grandTotal, { showCurrency: true })}
          </span>
        </div>

        <div className="border-t border-dotted border-neutral-400 pt-1 flex justify-between">
          <span>পরিশোধ ({data.paymentMethod}):</span>
          <span className="font-mono num">{formatMoney(data.paidAmount, { showCurrency: true })}</span>
        </div>

        {data.changeAmount > 0 && (
          <div className="flex justify-between">
            <span>ফেরত (Change):</span>
            <span className="font-mono num">{formatMoney(data.changeAmount, { showCurrency: true })}</span>
          </div>
        )}

        {data.dueAmount > 0 && (
          <div className="flex justify-between font-bold text-black">
            <span>বাকি (Due):</span>
            <span className="font-mono num">{formatMoney(data.dueAmount, { showCurrency: true })}</span>
          </div>
        )}
      </div>

      {/* Amount in words */}
      <div className="border-t border-dashed border-black mt-2 pt-1.5 text-[10px] text-neutral-800 italic">
        কথায়: {amountInWordsBengali(data.grandTotal)}
      </div>

      {/* Barcode simulation */}
      <div className="my-2 text-center">
        <svg viewBox="0 0 160 32" className="w-36 h-6 mx-auto" aria-hidden="true">
          <g fill="#000000">
            <rect x="0" y="0" width="2" height="32" />
            <rect x="4" y="0" width="3" height="32" />
            <rect x="9" y="0" width="1" height="32" />
            <rect x="12" y="0" width="2" height="32" />
            <rect x="16" y="0" width="4" height="32" />
            <rect x="22" y="0" width="1" height="32" />
            <rect x="25" y="0" width="3" height="32" />
            <rect x="30" y="0" width="2" height="32" />
            <rect x="34" y="0" width="1" height="32" />
            <rect x="37" y="0" width="4" height="32" />
            <rect x="43" y="0" width="2" height="32" />
            <rect x="47" y="0" width="1" height="32" />
            <rect x="50" y="0" width="3" height="32" />
            <rect x="55" y="0" width="2" height="32" />
            <rect x="59" y="0" width="4" height="32" />
            <rect x="65" y="0" width="1" height="32" />
            <rect x="68" y="0" width="3" height="32" />
            <rect x="73" y="0" width="2" height="32" />
            <rect x="77" y="0" width="1" height="32" />
            <rect x="80" y="0" width="3" height="32" />
            <rect x="85" y="0" width="4" height="32" />
            <rect x="91" y="0" width="2" height="32" />
            <rect x="95" y="0" width="1" height="32" />
            <rect x="98" y="0" width="3" height="32" />
            <rect x="103" y="0" width="2" height="32" />
            <rect x="107" y="0" width="4" height="32" />
            <rect x="113" y="0" width="1" height="32" />
            <rect x="116" y="0" width="2" height="32" />
            <rect x="120" y="0" width="3" height="32" />
            <rect x="125" y="0" width="1" height="32" />
            <rect x="128" y="0" width="4" height="32" />
            <rect x="134" y="0" width="2" height="32" />
            <rect x="138" y="0" width="1" height="32" />
            <rect x="141" y="0" width="3" height="32" />
            <rect x="146" y="0" width="2" height="32" />
            <rect x="150" y="0" width="4" height="32" />
            <rect x="156" y="0" width="2" height="32" />
          </g>
        </svg>
        <span className="font-mono text-[9px] tracking-widest block text-black">
          *{data.invoiceNo}*
        </span>
      </div>

      {/* Terms and Greetings */}
      <div className="border-t border-dashed border-black pt-1.5 text-center text-[9.5px] text-neutral-800 space-y-0.5">
        <p>• বিক্রিত পণ্য ৭ দিনের মধ্যে রসিদসহ ফেরতযোগ্য।</p>
        <p>• ইলেকট্রিক পার্টসে কোম্পানির ওয়ারেন্টি প্রযোজ্য।</p>
        <p className="font-bold text-[11px] pt-1 text-black">
          ধন্যবাদ, আবার আসবেন!
        </p>
        <p className="text-[8.5px] text-neutral-600 pt-0.5">
          AJ MOTORS POS System v1.0
        </p>
      </div>
    </div>
  );
};

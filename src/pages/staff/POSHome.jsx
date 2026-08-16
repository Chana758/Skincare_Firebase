// src/pages/staff/POSHome.jsx
import { useState } from "react";
import { ScanBarcode, Store, Sparkles } from "lucide-react";
import ProductGrid from "../../components/pos/ProductGrid";
import POSCart from "../../components/pos/POSCart";
import BarcodeScanner from "../../components/pos/BarcodeScanner";
import { POSCartProvider } from "../../context/POSCartContext";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const POSHome = () => {
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <POSCartProvider>
      <div className="space-y-4 md:space-y-6 pb-8 md:pb-12">

        {/* Top Banner Header */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 shadow-md p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-50 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 sm:gap-4 relative z-10 min-w-0">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gray-900 text-rose-300 flex items-center justify-center shadow-md shrink-0">
              <Store size={22} className="sm:hidden" />
              <Store size={26} className="hidden sm:block" />
            </div>
            <div className="min-w-0">
              <h1 style={FONT_SERIF} className="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                Point of Sale <Sparkles size={16} className="text-rose-500 shrink-0" />
              </h1>
              <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 mt-0.5 sm:mt-1 font-semibold truncate">
                Search, scan items, and check out customers
              </p>
            </div>
          </div>

          <button
            onClick={() => setScannerOpen(true)}
            className="flex items-center justify-center gap-2 sm:gap-2.5 bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md active:scale-95 relative z-10 shrink-0"
          >
            <ScanBarcode size={17} className="text-rose-300" /> <span className="hidden xs:inline">Scan Item</span><span className="xs:hidden">Scan</span>
          </button>
        </div>

        {/* POS Grid Section — stacked on mobile, side-by-side from lg up */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 lg:h-[calc(100vh-250px)] lg:min-h-[550px]">
          <div className="lg:col-span-3 bg-white rounded-2xl md:rounded-3xl border border-gray-200 shadow-md p-4 sm:p-5 md:p-6 flex flex-col lg:h-full lg:overflow-hidden">
            <ProductGrid />
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl md:rounded-3xl border border-gray-200 shadow-md p-4 sm:p-5 md:p-6 flex flex-col lg:h-full lg:overflow-hidden">
            <POSCart />
          </div>
        </div>
      </div>

      {scannerOpen && <BarcodeScanner onClose={() => setScannerOpen(false)} />}
    </POSCartProvider>
  );
};

export default POSHome;
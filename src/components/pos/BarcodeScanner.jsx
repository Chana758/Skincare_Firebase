// src/components/pos/BarcodeScanner.jsx
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X, Camera } from "lucide-react";
import { usePOSCart } from "../../context/POSCartContext";
// Ensure this path matches your project structure
import { useProducts } from "../../hooks/useProducts"; 

const BarcodeScanner = ({ onClose }) => {
  const { addItem } = usePOSCart();
  const { products } = useProducts();

  useEffect(() => {
    // Initialize the scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true, // Useful for phones
      },
      false
    );

    scanner.render(
      (decodedText) => {
        // Success callback: Find product
        const foundProduct = products?.find(
          (p) => p.barcode === decodedText || p.sku === decodedText || p.id === decodedText
        );

        if (foundProduct) {
          addItem(foundProduct, 1);
          // Optional: You could show a subtle toast instead of an alert
          console.log("Added:", foundProduct.name);
          
          // Stop and clear the scanner after success
          scanner.clear();
          onClose();
        } else {
          console.warn("Product not found for code:", decodedText);
        }
      },
      (error) => {
        // Error callback: Ignore scanning errors (they happen continuously while searching)
      }
    );

    // Cleanup on component unmount
    return () => {
      scanner.clear().catch((err) => console.error("Failed to clear scanner", err));
    };
  }, [products, addItem, onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Camera size={20} className="text-rose-600" />
            <h2 className="font-bold text-gray-800">Scan Product</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-2">
          <div id="reader" className="w-full rounded-2xl overflow-hidden bg-gray-900">
            {/* The scanner will render inside this div */}
          </div>
        </div>

        <div className="p-4 text-center">
          <p className="text-xs text-gray-500">
            Please align the barcode inside the frame.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
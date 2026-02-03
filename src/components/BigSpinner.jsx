import { Loader2 } from "lucide-react";

const BigSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <div className="absolute h-20 w-20 animate-ping rounded-full bg-blue-100 opacity-75"></div>
        
        {/* Main spinning icon */}
        <Loader2 
          className="h-12 w-12 animate-spin text-blue-500" 
          strokeWidth={2.5} 
        />
      </div>
      
      {/* Optional Loading Text */}
      <p className="mt-4 animate-pulse text-lg font-medium text-gray-600">
        잠시만 기다려 주세요...
      </p>
    </div>
  );
};

export default BigSpinner;
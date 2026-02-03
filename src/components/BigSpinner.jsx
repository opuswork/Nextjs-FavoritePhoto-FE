const BigSpinner = () => {
    return (
      <div 
        style={{ zIndex: 9999 }} 
        className="fixed inset-0 flex flex-col items-center justify-center bg-black"
      >
        <div className="relative">
          {/* The Spinner Circle */}
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
          
          {/* Inner Glow */}
          <div className="absolute inset-0 m-auto h-8 w-8 animate-pulse rounded-full bg-blue-500/30 blur-md"></div>
        </div>
        
        <p className="mt-6 text-xl font-bold tracking-widest text-white animate-pulse">
          LOADING...
        </p>
      </div>
    );
  };
  
  export default BigSpinner;
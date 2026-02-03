// src/components/BigSpinner.jsx
export default function BigSpinner() {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#000000', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 99999 
      }}>
        <div className="h-50 w-50 animate-spin rounded-full border-8 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
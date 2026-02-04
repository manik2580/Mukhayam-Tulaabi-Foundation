
import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (pin: string) => void;
  error?: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, error }) => {
  const [pin, setPin] = useState('');

  // Auto-submit when PIN reaches 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      onLogin(pin);
    }
  }, [pin, onLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 4) {
      setPin(value);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 md:py-12 md:px-6">
      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-2xl text-center">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-gray-900 w-6 h-6 md:w-8 md:h-8" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2">Access Portal</h2>
        <p className="text-gray-400 mb-8 text-xs md:text-sm">Enter the 4-digit security code</p>
        
        <div className="space-y-6">
          <div className="relative">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={4}
              value={pin}
              onChange={handleChange}
              placeholder="••••"
              className={`w-full px-4 py-5 bg-gray-50 border-2 ${error ? 'border-red-100' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-gray-900 focus:outline-none text-center text-4xl tracking-[0.5em] md:tracking-[1em] font-bold transition-all placeholder:text-gray-200`}
              autoFocus
            />
            {error && (
              <p className="absolute -bottom-6 left-0 right-0 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                {error}
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-center gap-2">
            {[1, 2, 3, 4].map((dot) => (
              <div 
                key={dot}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${pin.length >= dot ? 'bg-gray-900 scale-110' : 'bg-gray-100'}`}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-50">
          <p className="text-[9px] text-gray-300 uppercase tracking-[0.2em] font-bold">
            Secure Entry Protocol v4.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

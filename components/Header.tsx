
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 md:py-20 text-center border-b border-gray-50 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-2">
          Mukhayam Tulaabi Foundation
        </h1>
        <p className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-gray-400 font-semibold px-4">
          Advancing Humanity Through Radical Transparency
        </p>
        <div className="mt-6 w-8 md:w-12 h-0.5 bg-gray-900 mx-auto opacity-10"></div>
      </div>
    </header>
  );
};

export default Header;

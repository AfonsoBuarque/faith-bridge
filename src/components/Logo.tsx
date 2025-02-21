import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8" }: LogoProps) {
  return (
    <img 
      src="https://i.postimg.cc/rzXZnTnS/logo-preto-2.png"
      alt="FaithFlow Tech Logo"
      className={className}
    />
  );
}
import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8" }: LogoProps) {
  return (
    <img 
      src="https://i.postimg.cc/Vks5Jbh2/onlychurch-sem-fundo.png"
      alt="FaithFlow Tech Logo"
      className={className}
    />
  );
}
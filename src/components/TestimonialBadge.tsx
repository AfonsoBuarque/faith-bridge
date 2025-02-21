import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialBadgeProps {
  text: string;
}

export function TestimonialBadge({ text }: TestimonialBadgeProps) {
  return (
    <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
      <Star className="h-4 w-4 text-gray-700" />
      <span className="text-sm text-gray-700 font-medium">{text}</span>
    </div>
  );
}
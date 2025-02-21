import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

export function ProjectCard({ title, description, Icon }: ProjectCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
      <Icon className="h-12 w-12 text-gray-700 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
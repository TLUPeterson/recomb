// HonourSection.tsx
import React from 'react';
import { Input } from "./ui/input";
import { HonourSectionProps, ModType, AttributeInputProps } from '@/types/types';

export default function HonourSection({ title, type, mods, onModChange }: HonourSectionProps) {
  return (
    <div>
      <h2 className="font-bold">{title}</h2>
      <p className="text-sm mb-2">{type}</p>
      <div className="space-y-2">
        {(['prefixes', 'suffixes'] as ModType[]).map((modType) => (
          mods[modType].map((mod, index) => (
            <AttributeInput 
              key={`${modType}-${index}`}
              label={`${modType.slice(0, -2).charAt(0).toUpperCase() + modType.slice(1, -2)} ${index + 1}`}
              value={mod}
              onChange={(value) => onModChange(modType, index, value)}
            />
          ))
        ))}
      </div>
    </div>
  );
}

function AttributeInput({ label, value, onChange }: AttributeInputProps) {
  return (
    <div className="flex items-center">
      <span className="text-sm w-16">{label}</span>  
      <Input 
        type="text" 
        className="bg-gray-700 border border-gray-600 rounded py-1 w-full" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
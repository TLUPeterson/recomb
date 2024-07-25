'use client'
import React, { useEffect, useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import HonourSection from "@/components/HonourSection";
import { Mods, ModType, DesiredSectionProps } from '@/types/types';
import calculateSuccessChance from '@/utils/recalc';

export default function Home() {
  const [item1Mods, setItem1Mods] = useState<Mods>({
    prefixes: ['', '', ''],
    suffixes: ['', '', '']
  });
  const [item2Mods, setItem2Mods] = useState<Mods>({
    prefixes: ['', '', ''],
    suffixes: ['', '', '']
  });

  const [successChance, setSuccessChance] = useState<number | null>(null);

  const [desiredPrefixes, setDesiredPrefixes] = useState<Set<string>>(new Set());
  const [desiredSuffixes, setDesiredSuffixes] = useState<Set<string>>(new Set());

  const handleModChange = (item: 'item1' | 'item2', type: ModType, index: number, value: string) => {
    console.log('test')
    const setMods = item === 'item1' ? setItem1Mods : setItem2Mods;
    setMods(prev => {
      const newMods = {
        ...prev,
        [type]: prev[type].map((mod, i) => i === index ? value : mod)
      };
      
      // Update available mods
      const newAllPrefixes = [...newMods.prefixes, ...(item === 'item1' ? item2Mods.prefixes : item1Mods.prefixes)].filter(Boolean);
      const newAllSuffixes = [...newMods.suffixes, ...(item === 'item1' ? item2Mods.suffixes : item1Mods.suffixes)].filter(Boolean);
      
      // Validate and update desired mods
      setDesiredPrefixes(prev => validateDesiredMods(prev, newAllPrefixes));
      setDesiredSuffixes(prev => validateDesiredMods(prev, newAllSuffixes));
      
      return newMods;
    });
  };

  const allPrefixes = [...item1Mods.prefixes, ...item2Mods.prefixes].filter(Boolean);
  const allSuffixes = [...item1Mods.suffixes, ...item2Mods.suffixes].filter(Boolean);


  const handleCalculate = () => {
    const chance = calculateSuccessChance(desiredPrefixes, desiredSuffixes, item1Mods, item2Mods);
    setSuccessChance(chance);
  };

  const validateDesiredMods = (desiredMods: Set<string>, availableMods: string[]): Set<string> => {
    const validMods = new Set<string>();
    for (const mod of desiredMods) {
      if (availableMods.includes(mod)) {
        validMods.add(mod);
      }
    }
    return validMods;
  };



  return (
    <main className="px-8 pt-1 bg-slate-600 h-full">
      <Card className="bg-gray-800 text-white p-6 h-full">
        <h1 className="text-2xl font-bold mb-4">Recombinators</h1>
        <div className="grid grid-cols-2 gap-6">
          <HonourSection 
            title="Item 1" 
            type="" 
            mods={item1Mods}
            onModChange={(type, index, value) => handleModChange('item1', type, index, value)}
          />
          <HonourSection 
            title="Item 2" 
            type="" 
            mods={item2Mods}
            onModChange={(type, index, value) => handleModChange('item2', type, index, value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <DesiredSection 
            title={`${desiredPrefixes.size} DESIRED PREFIXES`}
            items={allPrefixes} 
            desiredMods={desiredPrefixes}
            setDesiredMods={setDesiredPrefixes}
          />
          <DesiredSection 
            title={`${desiredSuffixes.size} DESIRED SUFFIXES`}
            items={allSuffixes} 
            desiredMods={desiredSuffixes}
            setDesiredMods={setDesiredSuffixes}
          />
        </div>
        <div className="mt-6">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCalculate}
          >
            Calculate Success Chance
          </button>
          {successChance !== null && (
            <p className="mt-2">CHANCE OF SUCCESS: {(successChance * 100).toFixed(2)}%</p>
          )}
        </div>
      </Card>
    </main>
  );
}

function DesiredSection({ title, items, desiredMods, setDesiredMods }: DesiredSectionProps & { desiredMods: Set<string>, setDesiredMods: React.Dispatch<React.SetStateAction<Set<string>>> }) {
  const handleCheckboxChange = (item: string) => {
    setDesiredMods(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };
  

  return (
    <div>
      <h2 className="font-bold mb-2">{title}</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <Checkbox 
              id={`checkbox-${title}-${index}`} 
              className='bg-gray-400 border-2 border-gray-400 
                        data-[state=checked]:bg-blue-600 
                        data-[state=checked]:border-blue-700
                        data-[state=checked]:text-white'
              checked={desiredMods.has(item)}
              onCheckedChange={() => handleCheckboxChange(item)}
            />            
            <label htmlFor={`checkbox-${title}-${index}`} className="ml-2 text-sm">{item}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
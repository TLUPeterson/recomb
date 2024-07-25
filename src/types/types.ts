export type ModType = 'prefixes' | 'suffixes';

export interface Mods {
  prefixes: string[];
  suffixes: string[];
}

export interface HonourSectionProps {
  title: string;
  type: string;
  mods: Mods;
  onModChange: (type: ModType, index: number, value: string) => void;
}

export interface AttributeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export interface DesiredSectionProps {
  title: string;
  items: string[];
}
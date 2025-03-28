// src/components/folder/ColorPicker.tsx
import React from 'react';

const COLORS = [
  'red', 'orange', 'amber', 'yellow', 'lime', 
  'green', 'emerald', 'teal', 'cyan', 'sky', 
  'blue', 'indigo', 'violet', 'purple', 'fuchsia', 
  'pink', 'rose', 'gray'
];

interface ColorPickerProps {
  selectedColor: string | undefined;
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  selectedColor, 
  onSelectColor,
  onClose
}) => {
  // Helper function to get color hex value
  const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      red: '#ef4444',
      orange: '#f97316',
      amber: '#f59e0b',
      yellow: '#eab308',
      lime: '#84cc16',
      green: '#22c55e',
      emerald: '#10b981',
      teal: '#14b8a6',
      cyan: '#06b6d4',
      sky: '#0ea5e9',
      blue: '#3b82f6',
      indigo: '#6366f1',
      violet: '#8b5cf6',
      purple: '#a855f7',
      fuchsia: '#d946ef',
      pink: '#ec4899',
      rose: '#f43f5e',
      gray: '#6b7280',
    };
    
    return colorMap[colorName] || '#6b7280';
  };

  return (
    <div 
      className="absolute z-10 mt-1 bg-gray-800 rounded-md shadow-lg p-2" 
      onClick={e => e.stopPropagation()}
    >
      <div className="grid grid-cols-6 gap-1">
        {COLORS.map(color => (
          <button
            key={color}
            className={`w-6 h-6 rounded-full hover:ring-2 hover:ring-white
              ${selectedColor === color ? 'ring-2 ring-white' : ''}`}
            style={{ backgroundColor: getColorHex(color) }}
            onClick={() => {
              onSelectColor(color);
              onClose();
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
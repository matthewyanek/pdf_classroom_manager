// src/utils/colors.ts
export const getFolderColor = (folderId: number): string => {
  // List of pleasant, distinguishable colors
  const colors = [
    '#4299E1', // blue
    '#48BB78', // green
    '#ED8936', // orange
    '#9F7AEA', // purple
    '#F56565', // red
    '#38B2AC', // teal
    '#D53F8C', // pink
    '#805AD5'  // indigo
  ];
  
  // Use folder ID to pick a color
  const index = folderId % colors.length;
  return colors[index];
};
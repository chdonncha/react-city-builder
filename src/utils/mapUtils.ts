export const generateRandomMap = (size: number): string[][] => {
  const map: string[][] = [];
  for (let i = 0; i < size; i++) {
    const row: string[] = [];
    for (let j = 0; j < size; j++) {
      row.push(Math.random() < 0.5 ? 'grass' : 'water');
    }
    map.push(row);
  }
  return map;
};

import React from 'react';

interface GridOutlineProps {
  position: [number, number, number];
  cellSize: number;
}

const GridOutline: React.FC<GridOutlineProps> = ({ position, cellSize }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[2 * cellSize, 0.2, 2 * cellSize]} />
      <meshBasicMaterial color="red" wireframe />
    </mesh>
  );
};

export { GridOutline };

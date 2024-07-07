import React from 'react';

interface GridOutlineProps {
  position: [number, number, number];
  cellSize: number;
  valid: boolean;
}

const GridOutline: React.FC<GridOutlineProps> = ({ position, cellSize, valid }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[2 * cellSize, 0.2, 2 * cellSize]} />
      <meshBasicMaterial color={valid ? 'green' : 'red'} wireframe />
    </mesh>
  );
};

export { GridOutline };

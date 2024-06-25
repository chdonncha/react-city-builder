import { ThreeEvent } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';

interface GridSquareProps {
  position: number[];
  color: string;
  onMouseDown: (event: ThreeEvent<PointerEvent>) => void;
  onMouseEnter: (event: ThreeEvent<PointerEvent>) => void;
  onMouseUp: (event: ThreeEvent<PointerEvent>) => void;
  selected?: boolean;
  cellSize: number;
}

const GridSquare: React.FC<GridSquareProps> = ({ position, color, onMouseDown, onMouseEnter, onMouseUp, cellSize }) => {
  return (
    <mesh
      position={position as [number, number, number]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerDown={onMouseDown}
      onPointerEnter={onMouseEnter}
      onPointerUp={onMouseUp}
    >
      <planeGeometry args={[cellSize, cellSize]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
};

export { GridSquare };

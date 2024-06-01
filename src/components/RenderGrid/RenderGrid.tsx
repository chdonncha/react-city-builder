import { Fab } from '@mui/material';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';

import './RenderGrid.css';
import { BuildMenu } from '../BuildMenu/BuildMenu';

const GRID_SIZE = 200;
const GRID_DIVISIONS = 50;
const CELL_SIZE = GRID_SIZE / GRID_DIVISIONS;

interface GridSquareProps {
  position: number[];
  color: string;
  onClick: () => void;
  selected?: boolean;
}

const GridSquare: React.FC<GridSquareProps> = ({ position, color, onClick, selected }) => {
  return (
    <mesh position={position as [number, number, number]} rotation={[-Math.PI / 2, 0, 0]} onClick={onClick}>
      <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
};

interface GridProps {
  size: number;
  selectedZone: { type: string | null; density: string | null };
  currentSelected: { x: number; y: number } | null;
  setCurrentSelected: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
}

const Grid: React.FC<GridProps> = ({ size, selectedZone, currentSelected, setCurrentSelected }) => {
  const [cells, setCells] = useState(() => {
    const initialCells = [];
    for (let x = -size / 2; x < size / 2; x += CELL_SIZE) {
      for (let y = -size / 2; y < size / 2; y += CELL_SIZE) {
        initialCells.push({ x, y, type: null, density: null });
      }
    }
    return initialCells;
  });

  const handleCellClick = (x, y) => {
    if (selectedZone.type) {
      setCells(
        cells.map((cell) =>
          cell.x === x && cell.y === y
            ? {
              ...cell,
              type: selectedZone.type,
              density: selectedZone.density,
            }
            : cell,
        ),
      );
    } else {
      setCurrentSelected({ x, y });
    }
  };

  const getColor = (cell, currentSelected) => {
    if (currentSelected && cell.x === currentSelected.x && cell.y === currentSelected.y) return 'lightgrey';
    switch (cell.type) {
      case 'residential':
        return cell.density === 'low' ? 'lightgreen' : cell.density === 'medium' ? 'green' : 'darkgreen';
      case 'commercial':
        return cell.density === 'low' ? 'lightblue' : cell.density === 'medium' ? 'blue' : 'darkblue';
      case 'industrial':
        return cell.density === 'low' ? 'wheat' : cell.density === 'medium' ? 'yellow' : 'goldenrod';
      case 'road':
        return 'dimgrey';
      default:
        return 'white';
    }
  };

  return (
    <>
      {cells.map((cell) => (
        <GridSquare
          key={`${cell.x}-${cell.y}`}
          position={[cell.x + CELL_SIZE / 2, 0, cell.y + CELL_SIZE / 2]}
          onClick={() => handleCellClick(cell.x, cell.y)}
          color={getColor(cell, currentSelected)}
        />
      ))}
    </>
  );
};

interface GridAndAxesProps {
  showGrid: boolean;
  showAxes: boolean;
  selectedZone: { type: string | null; density: string | null };
  currentSelected: { x: number; y: number } | null;
  setCurrentSelected: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
}

const GridAndAxes: React.FC<GridAndAxesProps> = ({
                                                   showGrid,
                                                   showAxes,
                                                   selectedZone,
                                                   currentSelected,
                                                   setCurrentSelected,
                                                 }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {showGrid && <gridHelper args={[GRID_SIZE, GRID_DIVISIONS, 'red', 'gray']} />}
      {showAxes && <axesHelper args={[100]} />}
      <Grid
        size={GRID_SIZE}
        selectedZone={selectedZone}
        currentSelected={currentSelected}
        setCurrentSelected={setCurrentSelected}
      />
    </>
  );
};

const RenderGrid = () => {
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [selectedZone, setSelectedZone] = useState<{ type: string | null; density: string | null }>({
    type: null,
    density: null,
  });
  const [currentSelected, setCurrentSelected] = useState<{ x: number; y: number } | null>(null);

  const toggleGridVisibility = () => setShowGrid(!showGrid);
  const toggleAxesVisibility = () => setShowAxes(!showAxes);
  const handleSelectZone = (type: string, density: string) => {
    setSelectedZone({ type, density });
  };
  const handleSelectRoad = () => {
    setSelectedZone({ type: 'road', density: null });
  };
  const orbitControlsRef = useRef(null);

  const rotateCamera = (angle: number) => {
    const controls = orbitControlsRef.current;
    if (controls) {
      const rotation = new THREE.Euler(0, THREE.MathUtils.degToRad(angle), 0, 'XYZ');
      controls.object.position.applyEuler(rotation);
      controls.update();
    }
  };

  return (
    <>
      <Fab onClick={() => rotateCamera(90)} className="rotate-left-button" sx={{ borderRadius: '50%' }}>
        <RotateLeftIcon />
      </Fab>
      <Fab onClick={() => rotateCamera(-90)} className="rotate-right-button" sx={{ borderRadius: '50%' }}>
        <RotateRightIcon />
      </Fab>
      <BuildMenu
        onToggleGridVisibility={toggleGridVisibility}
        onToggleAxesVisibility={toggleAxesVisibility}
        onSelectResidential={(density) => handleSelectZone('residential', density)}
        onSelectCommercial={(density) => handleSelectZone('commercial', density)}
        onSelectIndustrial={(density) => handleSelectZone('industrial', density)}
        onSelectRoad={handleSelectRoad}
        showGrid={showGrid}
        showAxes={showAxes}
      />
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} />
        <GridAndAxes
          showGrid={showGrid}
          showAxes={showAxes}
          selectedZone={selectedZone}
          currentSelected={currentSelected}
          setCurrentSelected={setCurrentSelected}
        />
        <OrbitControls ref={orbitControlsRef} enableRotate={false} enableZoom={true} enablePan={false} />
      </Canvas>
    </>
);
};

export { RenderGrid };

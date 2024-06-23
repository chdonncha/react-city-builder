import { ThreeEvent } from '@react-three/fiber';
import React, { useState } from 'react';

import { GridSquare } from './GridSquare';

import commercialTexture from '../../textures/residential.png';
import industrialTexture from '../../textures/residential.png';
import residentialTexture from '../../textures/residential.png';
import roadTexture from '../../textures/road.png';
import { CitySprite } from '../CitySprite/CitySprite';
import './Grid.css';

const GRID_SIZE = 200;
const GRID_DIVISIONS = 50;
const CELL_SIZE = GRID_SIZE / GRID_DIVISIONS;

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
        initialCells.push({ x, y, type: null, density: null, building: null });
      }
    }
    return initialCells;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [tempCells, setTempCells] = useState(cells);
  const [draggedCells, setDraggedCells] = useState<{ x: number, y: number }[]>([]);

  const handleMouseDown = (x: number, y: number, event: ThreeEvent<PointerEvent>) => {
    if (event.nativeEvent.button !== 0) return; // Ensure it is a left-click
    setIsDragging(true);
    setDragStart({ x, y });
    setDraggedCells([]);
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isDragging && selectedZone.type) {
      updateTempCells(x, y);
    }
  };

  const handleMouseUp = (event: ThreeEvent<PointerEvent>) => {
    if (event.nativeEvent.button !== 0) return; // Ensure it is a left-click
    if (isDragging && selectedZone.type) {
      setCells(tempCells);
    }
    setIsDragging(false);
    setDragStart(null);
    setDraggedCells([]);
  };

  const updateTempCells = (x: number, y: number) => {
    if (!dragStart) return;

    const xMin = Math.min(dragStart.x, x);
    const xMax = Math.max(dragStart.x, x);
    const yMin = Math.min(dragStart.y, y);
    const yMax = Math.max(dragStart.y, y);

    const newDraggedCells: { x: number, y: number }[] = [];

    const newTempCells = cells.map(cell => {
      if (selectedZone.type === 'road') {
        // Allow roads only in straight lines
        if (dragStart.x === x) {
          // Vertical line
          if (cell.x === dragStart.x && cell.y >= yMin && cell.y <= yMax) {
            newDraggedCells.push({ x: cell.x, y: cell.y });
            return {
              ...cell,
              type: selectedZone.type,
              density: selectedZone.density,
              building: selectedZone.type,
            };
          }
        } else if (dragStart.y === y) {
          // Horizontal line
          if (cell.y === dragStart.y && cell.x >= xMin && cell.x <= xMax) {
            newDraggedCells.push({ x: cell.x, y: cell.y });
            return {
              ...cell,
              type: selectedZone.type,
              density: selectedZone.density,
              building: selectedZone.type,
            };
          }
        }
      } else if (cell.x >= xMin && cell.x <= xMax && cell.y >= yMin && cell.y <= yMax) {
        newDraggedCells.push({ x: cell.x, y: cell.y });
        return {
          ...cell,
          type: selectedZone.type,
          density: selectedZone.density,
          building: selectedZone.type,
        };
      }
      return cell;
    });

    setTempCells(newTempCells);
    setDraggedCells(newDraggedCells);
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

  const getBuildingTexture = (type: any) => {
    switch (type) {
      case 'residential':
        return residentialTexture;
      case 'commercial':
        return commercialTexture;
      case 'industrial':
        return industrialTexture;
      case 'road':
        return roadTexture;
      default:
        return null; // Default or unknown type
    }
  };

  const isDraggedCell = (x: number, y: number) => {
    return draggedCells.some(cell => cell.x === x && cell.y === y);
  };

  return (
    <>
      {tempCells.map((cell) => (
        <React.Fragment key={`${cell.x}-${cell.y}`}>
          <GridSquare
            position={[cell.x + CELL_SIZE / 2, -0.1, cell.y + CELL_SIZE / 2]}
            onMouseDown={(event) => handleMouseDown(cell.x, cell.y, event)}
            onMouseEnter={() => handleMouseEnter(cell.x, cell.y)}
            onMouseUp={handleMouseUp}
            color={getColor(cell, currentSelected)}
            cellSize={CELL_SIZE} // Pass CELL_SIZE as a prop
          />
          {(!isDraggedCell(cell.x, cell.y)) && cell.building && (
            <CitySprite
              imageUrl={getBuildingTexture(cell.building)}
              position={[cell.x + CELL_SIZE / 2, 1, cell.y + CELL_SIZE / 2]}
              scale={1}
              GRID_SIZE={GRID_SIZE}
              GRID_DIVISIONS={GRID_DIVISIONS}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export { Grid };

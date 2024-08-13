import { ThreeEvent } from '@react-three/fiber';
import React, { useState } from 'react';

import { GridSquare } from './GridSquare';

import conveyorTexture from '../../textures/conveyor.png';
import assemblerMultispriteA from '../../textures/excavatorA.png';
import excavatorMultispriteA from '../../textures/excavatorA.png';
import excavatorMultispriteB from '../../textures/excavatorB.png';
import assemblerMultispriteB from '../../textures/excavatorB.png';
import excavatorMultispriteC from '../../textures/excavatorC.png';
import assemblerMultispriteC from '../../textures/excavatorC.png';
import excavatorMultispriteD from '../../textures/excavatorD.png';
import assemblerMultispriteD from '../../textures/excavatorD.png';
import { GridSprite } from '../CitySprite/GridSprite';
import { GridOutline } from '../GridOutline/GridOutline';
import './Grid.css';

const GRID_SIZE = 200;
const GRID_DIVISIONS = 50;
const CELL_SIZE = GRID_SIZE / GRID_DIVISIONS;

interface GridProps {
  size: number;
  selectedBuilding: { type: string | null };
  currentSelected: { x: number; y: number } | null;
  setCurrentSelected: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  map: string[][]; // Add map as a prop
}

const Grid: React.FC<GridProps> = ({ selectedBuilding, currentSelected, map }) => {
  const [cells, setCells] = useState(() => {
    const initialCells = [];
    for (let i = 0; i < GRID_DIVISIONS; i++) {
      for (let j = 0; j < GRID_DIVISIONS; j++) {
        initialCells.push({
          x: j * CELL_SIZE - GRID_SIZE / 2,
          y: i * CELL_SIZE - GRID_SIZE / 2,
          type: map[i][j],
          building: null,
        });
      }
    }
    return initialCells;
  });

  const [tempCells, setTempCells] = useState(cells);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ x: number, y: number } | null>(null);

  const handleMouseDown = (x: number, y: number, event: ThreeEvent<PointerEvent>) => {
    if (event.nativeEvent.button !== 0) return; // Ensure it is a left-click
    if (selectedBuilding.type === 'conveyor') {
      setIsDragging(true);
      setDragStart({ x, y });
    } else {
      handleMouseClick(x, y, event);
    }
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isDragging && selectedBuilding.type === 'conveyor') {
      updateTempCells(x, y);
    }
    setHoveredCell({ x, y });
  };

  const handleMouseUp = (event: ThreeEvent<PointerEvent>) => {
    if (event.nativeEvent.button !== 0) return; // Ensure it is a left-click
    if (isDragging && selectedBuilding.type === 'conveyor') {
      setCells(tempCells);
    }
    setIsDragging(false);
    setDragStart(null);
    setHoveredCell(null); // Reset the hovered cell on mouse up
  };

  const handleMouseClick = (x: number, y: number, event: ThreeEvent<PointerEvent>) => {
    if (event.nativeEvent.button !== 0) return; // Ensure it is a left-click
    if (selectedBuilding.type === 'delete') {
      handleDeleteClick(x, y);
    } else if (selectedBuilding.type && selectedBuilding.type !== 'conveyor') {
      if (validatePlacement(x, y)) {
        updateCells(x, y);
      }
    }
  };

  const handleDeleteClick = (x: number, y: number) => {
    const newCells = cells.map(cell => {
      if (cell.x === x && cell.y === y && cell.building) {
        return {
          ...cell,
          type: 'grass', // Revert to grass
          building: null,
        };
      }
      return cell;
    });

    setCells(newCells);
    setTempCells(newCells); // Ensure tempCells are updated to reflect the deletion
  };

  const validatePlacement = (x: number, y: number) => {
    // Check if the entire 2x2 area is valid and empty
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        const cell = cells.find(cell => cell.x === x + i * CELL_SIZE && cell.y === y + j * CELL_SIZE);
        if (!cell || cell.building) {
          return false;
        }
      }
    }
    return true;
  };

  const updateCells = (x: number, y: number) => {
    const newCells = cells.map(cell => {
      const within2x2 = (cell.x >= x && cell.x < x + 2 * CELL_SIZE) && (cell.y >= y && cell.y < y + 2 * CELL_SIZE);
      if (within2x2) {
        let buildingType = selectedBuilding.type;
        if (cell.x === x && cell.y === y) {
          buildingType = `${selectedBuilding.type}A`;
        } else if (cell.x === x + CELL_SIZE && cell.y === y) {
          buildingType = `${selectedBuilding.type}B`;
        } else if (cell.x === x && cell.y === y + CELL_SIZE) {
          buildingType = `${selectedBuilding.type}C`;
        } else if (cell.x === x + CELL_SIZE && cell.y === y + CELL_SIZE) {
          buildingType = `${selectedBuilding.type}D`;
        }
        return {
          ...cell,
          type: buildingType,
          building: buildingType,
        };
      }
      return cell;
    });

    setCells(newCells);
    setTempCells(newCells); // Ensure tempCells are updated to reflect the placed item
  };

  const updateTempCells = (x: number, y: number) => {
    if (!dragStart) return;

    const xMin = Math.min(dragStart.x, x);
    const xMax = Math.max(dragStart.x, x);
    const yMin = Math.min(dragStart.y, y);
    const yMax = Math.max(dragStart.y, y);

    const newTempCells = cells.map(cell => {
      if (selectedBuilding.type === 'conveyor') {
        // Allow conveyors only in straight lines
        if (dragStart.x === x) {
          // Vertical line
          if (cell.x === dragStart.x && cell.y >= yMin && cell.y <= yMax) {
            return {
              ...cell,
              type: selectedBuilding.type,
              building: selectedBuilding.type,
            };
          }
        } else if (dragStart.y === y) {
          // Horizontal line
          if (cell.y === dragStart.y && cell.x >= xMin && cell.x <= xMax) {
            return {
              ...cell,
              type: selectedBuilding.type,
              building: selectedBuilding.type,
            };
          }
        }
      }
      return cell;
    });

    setTempCells(newTempCells);
  };

  const getColor = (cell, currentSelected) => {
    if (currentSelected && cell.x === currentSelected.x && cell.y === currentSelected.y) return 'lightgrey';
    switch (cell.type) {
      case 'assembler1A':
      case 'assembler1B':
      case 'assembler1C':
      case 'assembler1D':
      case 'assembler2A':
      case 'assembler2B':
      case 'assembler2C':
      case 'assembler2D':
      case 'assembler3A':
      case 'assembler3B':
      case 'assembler3C':
      case 'assembler3D':
        return 'lightgreen';
      case 'excavator1A':
      case 'excavator1B':
      case 'excavator1C':
      case 'excavator1D':
      case 'excavator2A':
      case 'excavator2B':
      case 'excavator2C':
      case 'excavator2D':
      case 'excavator3A':
      case 'excavator3B':
      case 'excavator3C':
      case 'excavator3D':
        return 'yellow';
      case 'conveyor':
        return 'dimgrey';
      case 'water':
        return 'blue';
      case 'grass':
        return 'lime';
      case 'gold':
        return 'gold';
      case 'iron':
        return 'grey';
      case 'coal':
        return 'black';
      default:
        return 'white';
    }
  };

  const getBuildingTexture = (type: any) => {
    switch (type) {
      case 'assembler1A':
      case 'assembler2A':
      case 'assembler3A':
        return assemblerMultispriteA;
      case 'assembler1B':
      case 'assembler2B':
      case 'assembler3B':
        return assemblerMultispriteB;
      case 'assembler1C':
      case 'assembler2C':
      case 'assembler3C':
        return assemblerMultispriteC;
      case 'assembler1D':
      case 'assembler2D':
      case 'assembler3D':
        return assemblerMultispriteD;
      case 'excavator1A':
      case 'excavator2A':
      case 'excavator3A':
        return excavatorMultispriteA;
      case 'excavator1B':
      case 'excavator2B':
      case 'excavator3B':
        return excavatorMultispriteB;
      case 'excavator1C':
      case 'excavator2C':
      case 'excavator3C':
        return excavatorMultispriteC;
      case 'excavator1D':
      case 'excavator2D':
      case 'excavator3D':
        return excavatorMultispriteD;
      case 'conveyor':
        return conveyorTexture;
      default:
        console.warn('Unknown building type:', type); // Warning for unknown types
        return null; // Default or unknown type
    }
  };

  return (
    <>
      {hoveredCell && selectedBuilding.type !== 'conveyor' && selectedBuilding.type !== 'delete' && selectedBuilding.type && (
        <GridOutline
          position={[
            hoveredCell.x + CELL_SIZE,
            0,
            hoveredCell.y + CELL_SIZE,
          ]}
          cellSize={CELL_SIZE}
          valid={validatePlacement(hoveredCell.x, hoveredCell.y)}
        />
      )}
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
          {cell.building && (
            <GridSprite
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

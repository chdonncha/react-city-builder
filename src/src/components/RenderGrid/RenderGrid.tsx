import React, {useEffect, useState} from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './RenderGrid.css';
import BuildMenu from '../BuildMenu/BuildMenu';

const GRID_SIZE = 200;
const GRID_DIVISIONS = 50;
const CELL_SIZE = GRID_SIZE / GRID_DIVISIONS;

const GridSquare = ({ position, selected, onClick }) => {
    return (
        <mesh
            position={position}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={onClick}
        >
            <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
            <meshBasicMaterial color={selected ? 'lightgray' : 'white'} side={THREE.DoubleSide} />
        </mesh>
    );
};

const Grid = ({ size }) => {
    const [selectedCell, setSelectedCell] = useState(null);

    const handleCellClick = (x, y) => {
        setSelectedCell({ x, y });
    };

    const cells = [];
    for (let x = -size / 2; x < size / 2; x += CELL_SIZE) {
        for (let y = -size / 2; y < size / 2; y += CELL_SIZE) {
            const isSelected = selectedCell && selectedCell.x === x && selectedCell.y === y;
            cells.push(
                <GridSquare
                    key={`${x}-${y}`}
                    position={[x + CELL_SIZE / 2, 0, y + CELL_SIZE / 2]}
                    selected={isSelected}
                    onClick={() => handleCellClick(x, y)}
                />
            );
        }
    }

    return (
        <>
            {cells}
        </>
    );
};

const GridAndAxes = ({ showGrid, showAxes }) => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(50, 50, 50);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    return (
        <>
            {showGrid && <gridHelper args={[GRID_SIZE, GRID_DIVISIONS, 'red', 'gray']} />}
            {showAxes && <axesHelper args={[100]} />}
            <Grid size={GRID_SIZE} />
        </>
    );
};

const RenderGrid = () => {
    const [showGrid, setShowGrid] = useState(true);
    const [showAxes, setShowAxes] = useState(true);

    return (
        <>
            <BuildMenu
                onToggleGrid={() => setShowGrid(!showGrid)}
                onToggleAxes={() => setShowAxes(!showAxes)}
                showGrid={showGrid}
                showAxes={showAxes}
            />
            <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[100, 100, 100]} />
                <GridAndAxes showGrid={showGrid} showAxes={showAxes} />
                <OrbitControls />
            </Canvas>
        </>
    );
};

export default RenderGrid;

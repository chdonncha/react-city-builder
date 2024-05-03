import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './RenderGrid.css';

const GridAndAxes = () => {
    const { camera } = useThree();

    React.useEffect(() => {
        camera.position.set(50, 50, 50);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    return (
        <>
            <gridHelper args={[200, 50, 'red', 'gray']} /> // Larger grid
            <axesHelper args={[100]} /> // Longer axes
        </>
    );
};

const EnhancedScene = () => {
    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[100, 100, 100]} />
            <GridAndAxes />
            <OrbitControls />
        </Canvas>
    );
};

export default EnhancedScene;

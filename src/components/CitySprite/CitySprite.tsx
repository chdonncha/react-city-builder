import React, { useEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CitySpriteProps {
  imageUrl: string;
  position: [number, number, number];
  scale: number;
}

const CitySprite: React.FC<CitySpriteProps> = ({ imageUrl, position, scale }) => {
  // @ts-ignore
  const texture = useLoader<THREE.TextureLoader, THREE.Texture>(THREE.TextureLoader, imageUrl) as THREE.Texture;
  const { scene } = useThree();

  useEffect(() => {
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(...position);
    sprite.scale.set(scale, scale, 1);
    scene.add(sprite);

    return () => {
      spriteMaterial.dispose();
      if (texture) {
        texture.dispose();
      }
      scene.remove(sprite);
    };
  }, [texture, scene, position, scale]);

  return null;
};

export { CitySprite };

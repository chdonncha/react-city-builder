const RATIO = 0.8;

const getRandomTile = (): string => {
  return Math.random() < RATIO ? 'grass' : 'water';
};

const generateRandomMap = (size: number): string[][] => {
  const map: string[][] = [];

  // Function to check if the coordinates are within bounds
  const isValidCoord = (x: number, y: number): boolean => {
    return x >= 0 && x < size && y >= 0 && y < size;
  };

  // Initialize the map with random tiles
  for (let i = 0; i < size; i++) {
    const row: string[] = [];
    for (let j = 0; j < size; j++) {
      row.push(getRandomTile());
    }
    map.push(row);
  }

  // Function to clump water tiles together more aggressively
  const clusterWaterTiles = () => {
    const newMap = map.map((row) => [...row]); // Copy the existing map

    // Helper function to check if a tile is water
    const isWater = (x: number, y: number): boolean => {
      return isValidCoord(x, y) && newMap[x][y] === 'water';
    };

    // Initialize water cluster map
    const waterClusterMap: number[][] = new Array(size).fill(null).map(() => new Array(size).fill(0));
    let currentClusterId = 1;

    // Mark clusters of water tiles
    const markWaterCluster = (x: number, y: number, clusterId: number) => {
      if (!isValidCoord(x, y) || newMap[x][y] !== 'water' || waterClusterMap[x][y] !== 0) {
        return;
      }
      waterClusterMap[x][y] = clusterId;
      markWaterCluster(x - 1, y, clusterId);
      markWaterCluster(x + 1, y, clusterId);
      markWaterCluster(x, y - 1, clusterId);
      markWaterCluster(x, y + 1, clusterId);
    };

    // Mark all water clusters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newMap[i][j] === 'water' && waterClusterMap[i][j] === 0) {
          markWaterCluster(i, j, currentClusterId++);
        }
      }
    }

    // Check for isolated water tiles and reset their clusters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newMap[i][j] === 'water') {
          // Check if it's surrounded by non-water tiles
          let surroundedByWater = false;
          if (isWater(i - 1, j) || isWater(i + 1, j) || isWater(i, j - 1) || isWater(i, j + 1)) {
            surroundedByWater = true;
          }
          if (!surroundedByWater) {
            waterClusterMap[i][j] = 0; // Reset isolated water tiles
          }
        }
      }
    }

    return waterClusterMap;
  };

  // Perform clustering of water tiles
  const waterClusterMap = clusterWaterTiles();

  // Generate final map based on water clusters
  const finalMap: string[][] = [];
  for (let i = 0; i < size; i++) {
    const row: string[] = [];
    for (let j = 0; j < size; j++) {
      row.push(waterClusterMap[i][j] !== 0 ? 'water' : 'grass');
    }
    finalMap.push(row);
  }

  return finalMap;
};

export { generateRandomMap };

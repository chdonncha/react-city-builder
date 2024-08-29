import conveyorTexture from '../textures/conveyor.png';
import assemblerMultispriteA from '../textures/excavatorA.png';
import excavatorMultispriteA from '../textures/excavatorA.png';
import excavatorMultispriteB from '../textures/excavatorB.png';
import assemblerMultispriteB from '../textures/excavatorB.png';
import excavatorMultispriteC from '../textures/excavatorC.png';
import assemblerMultispriteC from '../textures/excavatorC.png';
import excavatorMultispriteD from '../textures/excavatorD.png';
import assemblerMultispriteD from '../textures/excavatorD.png';

export const getColor = (cell, currentSelected) => {
  if (currentSelected && cell.x === currentSelected.x && cell.y === currentSelected.y) return 'lightgrey';
  if (cell.building === null && cell.type === 'conveyor') {
    return 'transparent';
  }
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

export const getBuildingTexture = (type: any) => {
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
      console.warn('Unknown building type:', type);
      return null;
  }
};

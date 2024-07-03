import AddRoadIcon from '@mui/icons-material/AddRoad'; // TODO: Replace with suitable conveyor replacement
import ConstructionIcon from '@mui/icons-material/Construction';
import GridOffIcon from '@mui/icons-material/GridOff';
import GridOnIcon from '@mui/icons-material/GridOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Fab } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import React, { useState } from 'react';
import './BuildMenu.css';

const BuildMenu = ({
                     onToggleGridVisibility,
                     onToggleAxesVisibility,
                     showGrid,
                     showAxes,
                     onSelectAssembler,
                     onSelectExcavator,
                     onSelectConveyor,
                   }) => {
  const [selected, setSelected] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const VisualOptions = () => (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => {
            setSelected('grid');
            onToggleGridVisibility();
          }}
          selected={selected === 'grid'}
        >
          <ListItemIcon>{showGrid ? <GridOnIcon /> : <GridOffIcon />}</ListItemIcon>
          <ListItemText primary={showGrid ? 'Hide Grid' : 'Show Grid'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => {
            setSelected('axes');
            onToggleAxesVisibility();
          }}
          selected={selected === 'axes'}
        >
          <ListItemIcon>{showAxes ? <VisibilityIcon /> : <VisibilityOffIcon />}</ListItemIcon>
          <ListItemText primary={showAxes ? 'Hide Axes' : 'Show Axes'} />
        </ListItemButton>
      </ListItem>
    </>
  );

  const InfrastructureOptions = () => (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => {
            setSelected('conveyor');
            onSelectConveyor();
          }}
          selected={selected === 'conveyor'}
        >
          <ListItemIcon>
            <AddRoadIcon /> {/* TODO: Replace with a suitable conveyor icon if available */}
          </ListItemIcon>
          <ListItemText primary="Conveyor" />
        </ListItemButton>
      </ListItem>
    </>
  );

  const AssemblerOptions = () => (
    <>
      {[1, 2, 3].map((level) => (
        <ListItem disablePadding key={`assembler-${level}`}>
          <ListItemButton
            onClick={() => {
              setSelected(`assembler${level}`);
              onSelectAssembler(level);
            }}
            selected={selected === `assembler${level}`}
          >
            <ListItemIcon>
              <ConstructionIcon /> {/* TODO: Replace with a suitable assembler icon if available */}
            </ListItemIcon>
            <ListItemText primary={`Assembler Level ${level}`} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );

  const ExcavatorOptions = () => (
    <>
      {[1, 2, 3].map((level) => (
        <ListItem disablePadding key={`excavator-${level}`}>
          <ListItemButton
            onClick={() => {
              setSelected(`excavator${level}`);
              onSelectExcavator(level);
            }}
            selected={selected === `excavator${level}`}
          >
            <ListItemIcon>
              <ConstructionIcon /> {/* TODO: Replace with a suitable excavator icon if available */}
            </ListItemIcon>
            <ListItemText primary={`Excavator Level ${level}`} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );

  const BuildingContent = () => (
    <List>
      <VisualOptions />
      <InfrastructureOptions />
      <AssemblerOptions />
      <ExcavatorOptions />
    </List>
  );

  return (
    <>
      <Fab onClick={toggleDrawer(true)} className="construction-menu-button" sx={{ borderRadius: '50%' }}>
        <ConstructionIcon />
      </Fab>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <BuildingContent />
      </Drawer>
    </>
  );
};

export { BuildMenu };

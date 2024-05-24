import BusinessIcon from '@mui/icons-material/Business';
import ConstructionIcon from '@mui/icons-material/Construction';
import FactoryIcon from '@mui/icons-material/Factory';
import GridOffIcon from '@mui/icons-material/GridOff';
import GridOnIcon from '@mui/icons-material/GridOn';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import './BuildMenu.css';

const BuildMenu = ({
  onToggleGridVisibility,
  onToggleAxesVisibility,
  showGrid,
  showAxes,
  onSelectResidential,
  onSelectCommercial,
  onSelectIndustrial,
}) => {
  const [selected, setSelected] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const BuildingContent = () => {
    return (
      <>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={onToggleGridVisibility}
              selected={selected === 'grid'}
              onMouseDown={() => setSelected('grid')}
            >
              <ListItemIcon>{showGrid ? <GridOffIcon /> : <GridOnIcon />}</ListItemIcon>
              <ListItemText primary={showGrid ? 'Hide Grid' : 'Show Grid'} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={onToggleAxesVisibility}
              selected={selected === 'axes'}
              onMouseDown={() => setSelected('axes')}
            >
              <ListItemIcon>{showAxes ? <VisibilityOffIcon /> : <VisibilityIcon />}</ListItemIcon>
              <ListItemText primary={showAxes ? 'Hide Axes' : 'Show Axes'} />
            </ListItemButton>
          </ListItem>
          {['low', 'medium', 'high'].map((density) => (
            <ListItem disablePadding key={`residential-${density}`}>
              <ListItemButton
                onClick={() => onSelectResidential(density)}
                selected={selected === `${density}Residential`}
                onMouseDown={() => setSelected(`${density}Residential`)}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={`${density.charAt(0).toUpperCase() + density.slice(1)} Density Residential`} />
              </ListItemButton>
            </ListItem>
          ))}
          {['low', 'medium', 'high'].map((density) => (
            <ListItem disablePadding key={`commercial-${density}`}>
              <ListItemButton
                onClick={() => onSelectCommercial(density)}
                selected={selected === `${density}Commercial`}
                onMouseDown={() => setSelected(`${density}Commercial`)}
              >
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary={`${density.charAt(0).toUpperCase() + density.slice(1)} Density Commercial`} />
              </ListItemButton>
            </ListItem>
          ))}
          {['low', 'medium', 'high'].map((density) => (
            <ListItem disablePadding key={`industrial-${density}`}>
              <ListItemButton
                onClick={() => onSelectIndustrial(density)}
                selected={selected === `${density}Industrial`}
                onMouseDown={() => setSelected(`${density}Industrial`)}
              >
                <ListItemIcon>
                  <FactoryIcon />
                </ListItemIcon>
                <ListItemText primary={`${density.charAt(0).toUpperCase() + density.slice(1)} Density Industrial`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </>
    );
  };

  return (
    <>
      <IconButton onClick={toggleDrawer(true)} className="construction-menu-button">
        <ConstructionIcon />
      </IconButton>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <BuildingContent />
      </Drawer>
    </>
  );
};

export { BuildMenu };

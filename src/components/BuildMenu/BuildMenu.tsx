import AddRoadIcon from '@mui/icons-material/AddRoad';
import BusinessIcon from '@mui/icons-material/Business';
import ConstructionIcon from '@mui/icons-material/Construction';
import FactoryIcon from '@mui/icons-material/Factory';
import GridOffIcon from '@mui/icons-material/GridOff';
import GridOnIcon from '@mui/icons-material/GridOn';
import HomeIcon from '@mui/icons-material/Home';
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
  onSelectResidential,
  onSelectCommercial,
  onSelectIndustrial,
  onSelectRoad,
}) => {
  const [selected, setSelected] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const VisualOptions = () => {
    return (
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
  };
  const InfrastructureOptions = () => {
    return (
      <>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              setSelected('road');
              onSelectRoad();
            }}
            selected={selected === 'road'}
          >
            <ListItemIcon>
              <AddRoadIcon />
            </ListItemIcon>
            <ListItemText primary="Road" />
          </ListItemButton>
        </ListItem>
      </>
    );
  };

  const ResidentialZoningOptions = () => {
    return (
      <>
        {['low', 'medium', 'high'].map((density) => (
          <ListItem disablePadding key={`residential-${density}`}>
            <ListItemButton
              onClick={() => {
                setSelected(`${density}Residential`);
                onSelectResidential(density);
              }}
              selected={selected === `${density}Residential`}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={`${density.charAt(0).toUpperCase() + density.slice(1)} Density Residential`} />
            </ListItemButton>
          </ListItem>
        ))}
      </>
    );
  };

  const CommercialZoningOptions = () => {
    return (
      <>
        {['low', 'medium', 'high'].map((density) => (
          <ListItem disablePadding key={`commercial-${density}`}>
            <ListItemButton
              onClick={() => {
                setSelected(`${density}Commercial`);
                onSelectCommercial(density);
              }}
              selected={selected === `${density}Commercial`}
            >
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary={`${density.charAt(0).toUpperCase() + density.slice(1)} Density Commercial`} />
            </ListItemButton>
          </ListItem>
        ))}
      </>
    );
  };

  const IndustrialZoningOptions = () => {
    return (
      <>
        {['low', 'medium', 'high'].map((density) => (
          <ListItem disablePadding key={`industrial-${density}`}>
            <ListItemButton
              onClick={() => {
                setSelected(`${density}Industrial`);
                onSelectIndustrial(density);
              }}
              selected={selected === `${density}Industrial`}
            >
              <ListItemIcon>
                <FactoryIcon />
              </ListItemIcon>
              <ListItemText primary={`${density.charAt(0).toUpperCase() + density.slice(1)} Density Industrial`} />
            </ListItemButton>
          </ListItem>
        ))}
      </>
    );
  };

  const BuildingContent = () => {
    return (
      <>
        <List>
          <VisualOptions></VisualOptions>
          <InfrastructureOptions></InfrastructureOptions>
          <ResidentialZoningOptions></ResidentialZoningOptions>
          <CommercialZoningOptions></CommercialZoningOptions>
          <IndustrialZoningOptions></IndustrialZoningOptions>
        </List>
      </>
    );
  };

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

import { useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useNavigation } from '../../context/NavigationContext';
import sidebarItems from './sidebarItems';
import type { SidebarItem } from './sidebarItems';

const SIDEBAR_BG = '#1a2235';
const ACTIVE_BG = '#243048';
const TEXT_COLOR = '#e2e8f0';

function NavItem({ item, depth = 0 }: { item: SidebarItem; depth?: number }) {
  const { currentPath, navigate } = useNavigation();
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;
  const isActive = currentPath === item.path;

  return (
    <>
      <ListItemButton
        onClick={() => {
          if (hasChildren) setOpen((o) => !o);
          else navigate(item.path);
        }}
        sx={{
          pl: 2 + depth * 2,
          bgcolor: isActive ? ACTIVE_BG : 'transparent',
          borderRadius: 1,
          mb: 0.5,
          color: TEXT_COLOR,
          '&:hover': { bgcolor: ACTIVE_BG },
        }}
      >
        <ListItemIcon sx={{ minWidth: 36, color: TEXT_COLOR }}>
          <item.Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          slotProps={{ primary: { sx: { fontSize: 14, fontWeight: isActive ? 700 : 400 } } }}
        />
        {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open} unmountOnExit>
          <List disablePadding>
            {item.children!.map((child) => (
              <NavItem key={child.path} item={child} depth={depth + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

export default function Sidebar() {
  return (
    <Box
      sx={{
        width: 220,
        minHeight: '100vh',
        bgcolor: SIDEBAR_BG,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        p: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 2 }}>
        <SmartToyIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
        <Typography variant="h6" sx={{
            fontWeight: 700,
            color: '#f1f5f9',
        }}>
          AIDev
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />

      <List disablePadding sx={{ flexGrow: 1 }}>
        {sidebarItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </List>
    </Box>
  );
}

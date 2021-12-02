import type { User } from '@prisma/client';
import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { Link, Form, useNavigate } from 'remix';
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import { AccountCircle, ChevronLeft, Menu as MenuIcon } from '@mui/icons-material';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

type Props = {
  sideNavItems: { id: string, label: string, prefix: JSX.Element, link: string }[],
  user: User | null,
};

export default function Navigation({ sideNavItems, user }: Props) {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleMenu = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="subtitle1" flex="1">
            Dashboards
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {sideNavItems.map((item) => (
            <ListItem
              button
              key={item.id}
              onClick={() => {
                navigate(item.link);
                handleDrawerClose();
              }}
            >
              <ListItemIcon>
                {item.prefix}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
          onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" flexGrow={1}>
          Crypto Dashboard
        </Typography>
        {user ? (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Form action="/logout" method="post">
                <MenuItem onClick={handleClose}>
                  <button type="submit" className="button">
                    Log out
                  </button>
                </MenuItem>
              </Form>
            </Menu>
          </div>
        ) : <Button color="inherit" component={Link} to="/login" prefetch="intent">Login</Button>}
      </Toolbar>
    </AppBar>
  );
}

import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './SideMenuContent';
import UserInfo from '../UserInfo';
import { AuthService } from '../../services/Auth.service';
import Logo from './../../assets/akkor_logo.svg'; 
import { Link } from 'react-router-dom'; 

const drawerWidth = 250;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu({ onSelect }: { onSelect: (page: string) => void }) {
  const user = AuthService.decodeToken();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* Logo cliquable qui redirige vers "/home" */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={Logo} alt="Logo" style={{ width: 40, height: 40, marginRight: 8 }} />
        </Link>
          <Typography variant="h6" sx={{ fontWeight: 300, textAlign: 'center', flexGrow: 1, color: 'inherit' }}>
            Dashboard
          </Typography>
      </Box>

      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent onSelect={onSelect} />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={user.lastname}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <UserInfo firstname={user.firstname} lastname={user.lastname} email={user.email} />
      </Stack>
    </Drawer>
  );
}

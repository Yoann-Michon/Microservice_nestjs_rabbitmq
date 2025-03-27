import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import FestivalIcon from '@mui/icons-material/Festival';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from "../../services/Auth.service";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const mainListItems = {
  admin:[
  { text: 'Home', icon: <HomeRoundedIcon />, path: '/dashboard' },
  { text: 'Users', icon: <PeopleRoundedIcon />, path: '/dashboard/user' },
  { text: 'Events', icon: <FestivalIcon />,  path: '/dashboard/events' },
  { text: 'Tickets', icon: <ConfirmationNumberIcon />, path: '/dashboard/tickets' },

],
  user:[
  { text: 'Home', icon: <HomeRoundedIcon />, path: '/dashboard' },
  { text: 'Events', icon: <FestivalIcon />, path: '/dashboard/events' },
  { text: 'Tickets', icon: <AssignmentRoundedIcon />, path: '/dashboard/tickets' },
  ]};

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/dashboard/settings' },
  { text: 'About', icon: <InfoRoundedIcon />, path: '/dashboard/about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, path: '/dashboard/feedback' },
];


export default function MenuContent({onSelect}: {onSelect: (text: string) => void}) {
  const [selectedPage, setSelectedPage] = useState('Home');
  let navigate = useNavigate();
  const role = AuthService.getUserRole();
  const items = role === 'ADMIN' ? mainListItems.admin : mainListItems.user;

  const handleSelect = (text: string, path: string) => {  
    onSelect(text);
    setSelectedPage(text);
    navigate(path);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleSelect(item.text, item.path)}
              sx={{ backgroundColor: selectedPage === item.text ? "primary.main" : "transparent", 
                color: selectedPage === item.text ? "white" : "text.primary", 
                borderRadius: 2, 
                '&:hover': { backgroundColor: "primary.main", color: "white" } }}
            >
              <ListItemIcon sx={{ color: selectedPage === item.text ? "white" : "text.primary" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

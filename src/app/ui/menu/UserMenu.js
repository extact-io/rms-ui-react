import { ConfigConsts } from 'app/ConfigConsts';
import { SessionContext } from 'app/provider/SessionContextProvider';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles(() => ({
  accountName: {
    paddingLeft: '4px',
  },
}));

export default function UserMenu({ switchTab }) {
  const classes = useStyles();

  const navigate = useNavigate();
  const { loginUser, logout } = useContext(SessionContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenAccountMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleOpenUserProfile = () => {
    switchTab(ConfigConsts.COMMON.PANEL_ID.USER_PROFILE);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/logout');
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleOpenAccountMenu} color="inherit">
        <AccountCircle fontSize="large" />
        <Typography className={classes.accountName} variant="body1">
          {loginUser.userName}
        </Typography>
        <KeyboardArrowDownIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted
        open={open}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleOpenUserProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

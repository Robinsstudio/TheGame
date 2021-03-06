import React from "react";
import { Link } from "react-router-dom";
import "./Account.css";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { withSnackbar } from "notistack";
import RouteBuilder from "../../../js/RouteBuilder";

function Account({ login, disconnect, snackbar }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if(snackbar !== undefined)
      snackbar();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
        className="linkNavbar"
      >
        <i className="material-icons">account_circle</i> {login || "account"}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Paper id="menu-list-grow">
          <MenuList autoFocusItem={open}>
            <Link to={RouteBuilder.get("/profile")} className="linkMenu">
              <MenuItem onClick={handleClose}>Mon Profil</MenuItem>
            </Link>
            <Link to={RouteBuilder.get("/settings")} className="linkMenu">
              <MenuItem onClick={handleClose}>Paramètres</MenuItem>
            </Link>
            <div className="dropdown-divider"></div>
            <MenuItem
              onClick={() => {
                handleClose();
                disconnect();
              }}
            >
              Déconnexion
            </MenuItem>
          </MenuList>
        </Paper>
      </Popover>
    </div>
  );
}

export default withSnackbar(Account);

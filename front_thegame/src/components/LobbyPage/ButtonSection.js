import React, { Component } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import "./ButtonSection.css";
import { Link } from "react-router-dom";
// Icons
import InputIcon from "@material-ui/icons/Input";

export default class ButtonSection extends Component {
  render() {
    return (
      <div>
        <Link to={"/createGame"} className="linkMenu">
          <Button className="lobbyButton">
            <AddCircleIcon className="lobbyIcon"></AddCircleIcon> Créer une
            partie
          </Button>
        </Link>
        <Button className="lobbyButton">
          <InputIcon className="lobbyIcon"></InputIcon> Rejoindre une partie
        </Button>
      </div>
    );
  }
}

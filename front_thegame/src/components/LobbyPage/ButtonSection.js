import React, { Component } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import "./ButtonSection.css";
import InputIcon from "@material-ui/icons/Input";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ReplyIcon from "@material-ui/icons/Reply";

export default class ButtonSection extends Component {
  render() {
    return (
      <div>
        <Button className="lobbyButton">
          <AddCircleIcon className="lobbyIcon"></AddCircleIcon> Créer une partie
        </Button>
        <Button className="lobbyButton">
          <InputIcon className="lobbyIcon"></InputIcon> Rejoindre une partie
        </Button>
        <div></div>

        <Button className="lobbyButton">
          <AddCircleIcon className="lobbyIcon"></AddCircleIcon> Créer une partie
        </Button>
        <Button className="lobbyButton">
          <ReplyIcon className="lobbyIconReply"></ReplyIcon> Rejoindre une
          partie
        </Button>
        <div></div>

        <Button className="lobbyButton">
          <AddCircleIcon className="lobbyIcon"></AddCircleIcon> Créer une partie
        </Button>
        <Button className="lobbyButton">
          <SupervisorAccountIcon className="lobbyIcon"></SupervisorAccountIcon>{" "}
          Rejoindre une partie
        </Button>
      </div>
    );
  }
}

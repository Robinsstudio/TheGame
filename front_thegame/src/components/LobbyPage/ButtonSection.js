import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import "./ButtonSection.css";
import { Link } from "react-router-dom";
// Icons
import InputIcon from "@material-ui/icons/Input";

let props;

class ButtonSection extends Component {
  componentDidMount() {
    props = this.props;
  }

  joinGame(id) {
    if (id !== undefined) {
      let path = "/game?id=" + id;
      props.history.push(path);
    }
  }

  render() {
    return (
      <div>
        <Link to={"/createGame"} className="linkMenu">
          <Button className="lobbyButton">
            <AddCircleIcon className="lobbyIcon"></AddCircleIcon> Créer une
            partie
          </Button>
        </Link>
        <Button
          className="lobbyButton"
          disabled={!this.props.gameSelected}
          onClick={() => this.joinGame(this.props.idGame)}
        >
          <InputIcon className="lobbyIcon"></InputIcon> Rejoindre la partie
        </Button>
      </div>
    );
  }
}

export default withRouter(ButtonSection);

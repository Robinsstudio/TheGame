import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 500
  }
});

function createData(name, type, statut, joueurs) {
  return { name, type, statut, joueurs };
}

const rows = [
  createData("Partie avec les potes", "normale", "en cours", "2/5"),
  createData("Normal game", "normale", "terminée", "2/3"),
  createData("Solo", "personnalisée", "terminée", "1/1"),
  createData("Dieu roi", "normale", "terminée", "4/5"),
  createData("Zeus foudre", "personnalisée", "terminée", "3/3")
];

export default function HistoryGame() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nom de la partie :</TableCell>
            <TableCell align="center">Type</TableCell>
            <TableCell align="center">Statut</TableCell>
            <TableCell align="center">Nombre de joueurs</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center">{row.type}</TableCell>
              <TableCell align="center">{row.statut}</TableCell>
              <TableCell align="center">{row.joueurs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

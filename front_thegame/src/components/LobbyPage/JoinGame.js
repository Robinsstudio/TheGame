import React, { Component } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

function createDataJoin(id, name, players, piles, version) {
  return { id, name, players, piles, version };
}

const headRowsJoin = [
  {
    id: "id"
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Nom de la partie"
  },
  { id: "players", numeric: false, disablePadding: false, label: "Joueurs" },
  { id: "piles", numeric: false, disablePadding: false, label: "Piles" },
  {
    id: "version",
    numeric: false,
    disablePadding: false,
    label: "Version de la partie"
  }
];

/////////////////////////////////////////////////////
//// Fonction pour classer par ordre croissant ou décroissant
function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
////////////////////////////////////////////////////////////////
/// Fonction qui déplace les éléments pour le classement
function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

//////////////////////////////////////////////////////////
/// Fonction qui détermine l'ordre croissant ou décroissant
function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Début du Header de la Table
function EnhancedTableHeadJoin(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        {headRowsJoin.map(row => {
          if (row.id === "id") {
            return (
              <TableCell key={row.id} className="hiddenCell">
                <TableSortLabel className="hiddenCell"></TableSortLabel>
              </TableCell>
            );
          } else {
            return (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === row.id}
                  direction={order}
                  onClick={createSortHandler(row.id)}
                >
                  {row.label}
                </TableSortLabel>
              </TableCell>
            );
          }
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHeadJoin.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};
// Fin du Header de la Table
///////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
///// Début de la Toolbar de la Table
const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {},
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
}));

const EnhancedTableToolbarJoin = props => {
  const classes = useToolbarStyles();
  const { numSelected, fetch } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="h6">
            {numSelected} partie sélectionnée
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Matchmaking Ouvert
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div></div>
        ) : (
          <Tooltip title={<span className="tooltipPerso">Actualiser</span>}>
            <IconButton onClick={() => fetch()}>
              <RefreshIcon fontSize="large"></RefreshIcon>
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbarJoin.propTypes = {
  numSelected: PropTypes.number.isRequired
};
/// Fin de la Toolbar de la Table
//////////////////////////////////////////////////////////////

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 400
  },
  tableWrapper: {
    overflowX: "auto"
  }
}));

function MyTableJoin(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("players");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  function handleClick(event, row) {
    const selectedIndex = selected.indexOf(row.id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat([], row.id);
      MyProps.selectGame(true);
      MyProps.selectIdGame(row.id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      MyProps.selectGame(false);
      MyProps.selectIdGame(undefined);
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, props.rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbarJoin
          numSelected={selected.length}
          fetch={props.fetch}
        />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHeadJoin
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={props.rows.length}
            />
            <TableBody>
              {stableSort(props.rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell className="hiddenCell">{row.id}</TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.players}</TableCell>
                      <TableCell align="left">{row.piles}</TableCell>
                      <TableCell align="left">{row.version}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component="div"
          count={props.rows.length}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={"Parties par page :"}
          page={page}
          backIconButtonProps={{
            "aria-label": "Page Précédente"
          }}
          nextIconButtonProps={{
            "aria-label": "Page Suivante"
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

let MyProps;

export default class JoinGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: this.props.data
    };
  }

  componentDidMount() {
    MyProps = this.props;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data.length !== this.props.data.length) {
      this.setState(
        {
          rows: nextProps.data
        },
        nextProps.data.forEach(game => {
          this.state.rows.push(
            createDataJoin(
              game.id,
              game.name,
              game.players,
              game.piles,
              game.version
            )
          );
        })
      );
    }
  }
  refreshData() {
    MyProps.fetch();
  }

  render() {
    return (
      <MyTableJoin
        rows={this.state.rows}
        fetch={() => this.refreshData()}
      ></MyTableJoin>
    );
  }
}

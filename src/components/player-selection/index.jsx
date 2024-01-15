import React, { useState } from "react";
import {
  Container,
  Header,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Button,
  Label,
  Segment,
} from "semantic-ui-react";
import {
  PLAYERS,
  PLAYER_CASH,
  PLAYER_ASSETS,
  ROLES,
  ROLE_NAMES,
} from "../../constants/player";
import { INITAL_PLAYER_MONEY } from "../../constants/globals";
import MoneyDistribution from "./money-distribution";

const PlayerSelection = ({ onSubmit }) => {
  const [roles, setRoles] = useState({});

  const handleRoleChange = (_, { id, checked }) => {
    setRoles({ ...roles, [id]: checked });
  };

  const onClick = () => {
    const players = {};
    const playersCash = {};
    const playersAssets = {};

    Object.values(PLAYERS).forEach((player) => {
      const { id } = player;

      players[id] = {
        ...player,
        role: roles[id] ? ROLES.MONOPOLIST : ROLES.COMPETITOR,
      };

      const playerCashObj = { ...PLAYER_CASH() };
      playersCash[id] = playerCashObj;

      const playerAssetObj = { ...PLAYER_ASSETS() };
      playersAssets[id] = playerAssetObj;
    });

    onSubmit({ players, playersCash, playersAssets });
  };

  return (
    <Segment placeholder className="full-h">
      <Container fluid>
        <Header as="h2" textAlign="center">
          Welcome to Anti-Monopoly Stats Board
        </Header>
        <MoneyDistribution />
        <Header as="h4" textAlign="center">
          Select Roles
        </Header>

        <Table celled className="mb-10">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Start Money</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.values(PLAYERS).map(({ id, name }) => (
              <TableRow key={id}>
                <TableCell>{name}</TableCell>
                <TableCell className="role-cell">
                  <Label horizontal>{ROLE_NAMES[1].name}</Label>
                  <Checkbox
                    id={id}
                    toggle
                    checked={roles[id]}
                    onChange={handleRoleChange}
                  />
                  <Label horizontal>{ROLE_NAMES[2].name}</Label>
                </TableCell>
                <TableCell>{INITAL_PLAYER_MONEY}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
      <Container textAlign="center">
        <Button positive onClick={onClick} fluid>
          Start The Game
        </Button>
      </Container>
    </Segment>
  );
};

export default PlayerSelection;

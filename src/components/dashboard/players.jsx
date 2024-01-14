import React from "react";
import {
  Grid,
  GridColumn,
  Statistic,
  StatisticValue,
  StatisticLabel,
  Header,
} from "semantic-ui-react";
import { ROLE_NAMES } from "../../constants/player";

const Players = ({ players, playersCash, treasurer }) => {
  const playerArr = Object.values(players);

  return (
    <>
      <Header as="h3" className="pt-10" textAlign="center">
        Player Stats
      </Header>
      <Grid columns={playerArr.length + 1}>
        {playerArr.map(({ id, role, name, color }) => (
          <GridColumn
            key={`player-${id}`}
            textAlign="center"
            verticalAlign="middle"
          >
            <Statistic size="small" color={color}>
              <StatisticValue>${playersCash[id].balance}</StatisticValue>
              <StatisticLabel>{name}</StatisticLabel>
              <StatisticLabel>{ROLE_NAMES[role]}</StatisticLabel>
            </Statistic>
          </GridColumn>
        ))}
        <GridColumn
          key={`player-${treasurer.id}`}
          textAlign="center"
          verticalAlign="middle"
        >
          <Statistic size="small" color={treasurer.color}>
            <StatisticValue>${treasurer.balance}</StatisticValue>
            <StatisticLabel>{treasurer.name}</StatisticLabel>
            <StatisticLabel>{treasurer.role}</StatisticLabel>
          </Statistic>
        </GridColumn>
      </Grid>
    </>
  );
};

export default Players;

import React from "react";
import {
  Grid,
  GridColumn,
  List,
  ListItem,
  ListContent,
  Label,
} from "semantic-ui-react";
import { computeNetAssetValue, computeNetBalance } from "../../helpers/player";
import ShowAssets from "./modals.jsx/assets";
import ShowMortgages from "./modals.jsx/mortgages";

const Scoreboard = ({ players, playersCash, playersAssets, children }) => {
  const playersArr = Object.values(players);

  return (
    <Grid columns={playersArr.length + 1} className="mb-0">
      {Object.values(players).map(({ id, role }) => {
        const { assets, mortgages } = playersAssets[id];
        const { balance } = playersCash[id];

        const cashValue = computeNetBalance({ role, balance });
        const assetValue = computeNetAssetValue({ assets, role });
        const netWorth = cashValue + assetValue;
        const assetsOwned = Object.keys(assets).length;
        const mortgaged = Object.keys(mortgages).length;

        return (
          <GridColumn
            key={`player-${id}`}
            textAlign="center"
            verticalAlign="middle"
          >
            <List>
              <ListItem>
                <ListContent>
                  Cash: <b>${cashValue}</b>
                </ListContent>
              </ListItem>
              <ListItem>
                <ListContent>
                  Asset: <b>${assetValue}</b>
                </ListContent>
              </ListItem>
              <ListItem>
                <ListContent>
                  Net Worth: <b>${netWorth}</b>
                </ListContent>
              </ListItem>
              <ListItem>
                <ShowAssets
                  trigger={
                    <Label as="a">
                      <span>Assets:</span> {assetsOwned}
                    </Label>
                  }
                  assets={assets}
                  assetsOwned={assetsOwned}
                  role={role}
                />
                <ShowMortgages
                  trigger={
                    <Label as="a">
                      <span>Mortgaged:</span> {mortgaged}
                    </Label>
                  }
                  mortgages={mortgages}
                  mortgagesOwned={mortgaged}
                />
              </ListItem>
            </List>
          </GridColumn>
        );
      })}
      {children}
    </Grid>
  );
};

export default Scoreboard;

import React from "react";

import {
  GridColumn,
  List,
  ListItem,
  ListContent,
  Label,
} from "semantic-ui-react";
import ShowAllAssets from "./modals.jsx/all-assets";
import ShowAllMortgages from "./modals.jsx/all-mortgages";

const Treasurer = ({ data }) => {
  const { id, properties, mortgages, noOfHouses, noOfApartments, noOfAssets } =
    data;

  const mortgagedProperties = Object.keys(mortgages).length;

  return (
    <GridColumn
      key={`treasurer-${id}`}
      textAlign="center"
      verticalAlign="middle"
    >
      <List>
        <ListItem>
          <ListContent>
            <ShowAllAssets
              trigger={
                <Label as="a">
                  <span>Assets Owned:</span> {noOfAssets}
                </Label>
              }
              properties={properties}
            />
          </ListContent>
        </ListItem>
        <ListItem>
          <ListContent>
            <ShowAllMortgages
              trigger={
                <Label as="a">
                  <span>Mortgaged:</span> {mortgagedProperties}
                </Label>
              }
              mortgages={mortgages}
              mortgagedProperties={mortgagedProperties}
            />
          </ListContent>
        </ListItem>
        <ListItem>
          <Label>
            <span>Houses:</span> {noOfHouses}
          </Label>
          <Label>
            <span>Apartments:</span> {noOfApartments}
          </Label>
        </ListItem>
      </List>
    </GridColumn>
  );
};

export default Treasurer;

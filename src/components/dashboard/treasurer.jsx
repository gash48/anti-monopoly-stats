import React from "react";

import {
  GridColumn,
  List,
  ListItem,
  ListContent,
  Label,
} from "semantic-ui-react";

const Treasurer = ({ data }) => {
  const { id, mortgages, noOfHouses, noOfApartments, noOfAssets } = data;

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
            <Label>
              <span>Assets Owned:</span> {noOfAssets}
            </Label>
          </ListContent>
        </ListItem>
        <ListItem>
          <ListContent>
            <Label>
              <span>Mortgaged:</span> {mortgagedProperties}
            </Label>
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

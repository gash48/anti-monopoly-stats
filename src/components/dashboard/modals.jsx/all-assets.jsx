import React, { useCallback, useState } from "react";

import {
  ModalHeader,
  ModalContent,
  Modal,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Label,
} from "semantic-ui-react";
import { ASSETS, ASSET_TYPE_NAMES, CITIES } from "../../../constants/assets";
import { PLAYERS } from "../../../constants/player";

const emptyObj = {};

const ShowAllAssets = ({ trigger, properties }) => {
  const [isOpen, setOpen] = useState(false);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      trigger={trigger}
      dimmer="blurring"
    >
      <ModalHeader>All Assets</ModalHeader>
      <ModalContent scrolling>
        <Table celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>City</TableHeaderCell>
              <TableHeaderCell>Cost Price</TableHeaderCell>
              <TableHeaderCell>House Price</TableHeaderCell>
              <TableHeaderCell>Owned By</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(ASSETS).map(
              ({ id, name, type, cityId, costPrice, housePrice }) => {
                const ownerId = properties[id];
                const { name: ownerName, color } = PLAYERS[ownerId] || emptyObj;
                return (
                  <TableRow key={`asset-${id}`} disabled={!!ownerId}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{ASSET_TYPE_NAMES[type]}</TableCell>
                    <TableCell>{CITIES[cityId].name}</TableCell>
                    <TableCell>${costPrice}</TableCell>
                    <TableCell>${housePrice || 0}</TableCell>
                    <TableCell>
                      {ownerId ? (
                        <Label color={color}>{ownerName}</Label>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </ModalContent>
    </Modal>
  );
};

export default ShowAllAssets;

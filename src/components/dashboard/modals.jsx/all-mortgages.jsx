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

const ShowAllMortgages = ({ trigger, mortgages, mortgagedProperties }) => {
  const [isOpen, setOpen] = useState(false);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  if (!mortgagedProperties) {
    return trigger;
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      trigger={trigger}
      dimmer="blurring"
    >
      <ModalHeader>All Mortgages</ModalHeader>
      <ModalContent scrolling>
        <Table celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>City</TableHeaderCell>
              <TableHeaderCell>Redemption Price</TableHeaderCell>
              <TableHeaderCell>Mortgaged By</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(mortgages).map((id) => {
              const { name, type, cityId, redeemPrice } = ASSETS[id];
              const ownerId = mortgages[id];
              const { name: ownerName, color } = PLAYERS[ownerId];
              return (
                <TableRow key={`asset-${id}`}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{ASSET_TYPE_NAMES[type]}</TableCell>
                  <TableCell>{CITIES[cityId].name}</TableCell>
                  <TableCell>${redeemPrice}</TableCell>
                  <TableCell>
                    <Label color={color}>{ownerName}</Label>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ModalContent>
    </Modal>
  );
};

export default ShowAllMortgages;

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
} from "semantic-ui-react";
import { ASSETS, ASSET_TYPE_NAMES, CITIES } from "../../../constants/assets";

const ShowMortgages = ({ trigger, mortgages, mortgagesOwned }) => {
  const [isOpen, setOpen] = useState(false);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  if (!mortgagesOwned) {
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
      <ModalHeader>Mortgages</ModalHeader>
      <ModalContent scrolling>
        <Table celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>City</TableHeaderCell>
              <TableHeaderCell>Cost Price</TableHeaderCell>
              <TableHeaderCell>Mortgaged Amount</TableHeaderCell>
              <TableHeaderCell>Redeem Amount</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(mortgages).map((id) => {
              const { name, type, cityId, costPrice, redeemPrice } = ASSETS[id];
              return (
                <TableRow key={`mortgage-${id}`}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{ASSET_TYPE_NAMES[type]}</TableCell>
                  <TableCell>{CITIES[cityId].name}</TableCell>
                  <TableCell>${costPrice}</TableCell>
                  <TableCell>${mortgages[id]}</TableCell>
                  <TableCell>${redeemPrice}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ModalContent>
    </Modal>
  );
};

export default ShowMortgages;

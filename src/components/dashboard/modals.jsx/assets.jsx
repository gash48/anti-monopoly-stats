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
import { computeNetRentValue } from "../../../helpers/player";
import { isUtilityProperty } from "../../../helpers/asset";

const ShowAssets = ({ trigger, role, assets, assetsOwned }) => {
  const [isOpen, setOpen] = useState(false);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  if (!assetsOwned) {
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
      <ModalHeader>Assets</ModalHeader>
      <ModalContent scrolling>
        <Table celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>City</TableHeaderCell>
              <TableHeaderCell>Number Of Houses</TableHeaderCell>
              <TableHeaderCell>Buying Price</TableHeaderCell>
              <TableHeaderCell>Net Rent</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.values(assets).map(
              ({ id, cityId, houses, isApartment, buyingPrice }) => {
                const { name, type } = ASSETS[id];
                return (
                  <TableRow key={`asset-${id}`}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{ASSET_TYPE_NAMES[type]}</TableCell>
                    <TableCell>{CITIES[cityId].name}</TableCell>
                    <TableCell positive={isApartment}>{houses}</TableCell>
                    <TableCell>${buyingPrice}</TableCell>
                    <TableCell>
                      $
                      {computeNetRentValue({
                        role,
                        assetId: id,
                        assets,
                        count: 1,
                      })}
                      {isUtilityProperty(type) && "x"}
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

export default ShowAssets;

import { ASSET_TYPE } from "../constants/assets";
import { ROLE_HOUSES_LIMIT } from "../constants/player";

export const isHouseProperty = (type) => type === ASSET_TYPE.PROPERTY;

export const isUtilityProperty = (type) => type === ASSET_TYPE.UTILITY;

export const getAllowedHousesLimit = (role) => ROLE_HOUSES_LIMIT[role];

export const checkIfApartment = (role, houses) =>
  houses === getAllowedHousesLimit(role);

export const getOwnedTransportCompanies = (assets) =>
  Object.values(assets).filter(({ type }) => type === ASSET_TYPE.TRANSPORT)
    .length;

export const getOwnedUtilityCompanies = (assets) =>
  Object.values(assets).filter(({ type }) => type === ASSET_TYPE.UTILITY)
    .length;

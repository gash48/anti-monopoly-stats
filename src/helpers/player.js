import { ASSETS, ASSET_TYPE } from "../constants/assets";
import {
  ALLOWED_COMPETITOR_HOUSES,
  ALLOWED_MONOPOLIST_HOUSES,
  ANTI_MONOPOLY_COMPETITOR_REWARDS,
  MORTGAGE_VALUE_MULTIPLIER,
} from "../constants/globals";
import { ROLES } from "../constants/player";

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const isCompetitor = (role) => role === ROLES.COMPETITOR;

export const computeNetBalance = ({ balance, role }) => {
  if (isCompetitor(role)) {
    return Math.ceil(balance * 0.1);
  }
  return Math.ceil(balance * 0.2);
};

export const computeNetAssetValue = ({ assets, role }) => {
  let assetValue = 0;

  Object.values(assets).forEach(({ id }) => {
    const rentValue = computeNetRentValue({ role, assetId: id, assets });
    assetValue += rentValue;
  });

  return assetValue;
};

export const computeNetRentValue = ({ role, assetId, assets, count }) => {
  const { type, rents, fares, charges, costPrice } = ASSETS[assetId];

  if (type === ASSET_TYPE.PROPERTY) {
    const { houses } = assets[assetId];
    return rents[role][houses];
  }

  if (type === ASSET_TYPE.TRANSPORT) {
    const owned = getOwnedTransportCompanies(assets);
    return fares[role][owned];
  }

  if (type === ASSET_TYPE.UTILITY) {
    const owned = getOwnedUtilityCompanies(assets);
    return count
      ? charges[role][owned] * count
      : costPrice * MORTGAGE_VALUE_MULTIPLIER;
  }

  return 0;
};

export const checkIfApartment = (role, houses) =>
  houses === getAllowedHousesLimit(role);

export const getAllowedHousesLimit = (role) =>
  isCompetitor(role) ? ALLOWED_COMPETITOR_HOUSES : ALLOWED_MONOPOLIST_HOUSES;

export const getOwnedTransportCompanies = (assets) =>
  Object.values(assets).filter(({ type }) => type === ASSET_TYPE.TRANSPORT)
    .length;

export const getOwnedUtilityCompanies = (assets) =>
  Object.values(assets).filter(({ type }) => type === ASSET_TYPE.UTILITY)
    .length;

export const getPrisonOrPriceWar = (role) =>
  isCompetitor(role) ? "Price War" : "Prison";

export const getAntiMonopolyFoundationAmount = (role, count) =>
  isCompetitor(role)
    ? ANTI_MONOPOLY_COMPETITOR_REWARDS.includes(count)
      ? count * 25
      : 0
    : -160;

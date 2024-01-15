import { ASSETS, ASSET_TYPE } from "../constants/assets";
import {
  ANTI_MONOPOLY_COMPETITOR_REWARDS,
  ANTI_MONOPOLY_MONOPOLIST_REWARD,
  MORTGAGE_VALUE_MULTIPLIER,
} from "../constants/globals";
import { ROLES, ROLE_NAMES } from "../constants/player";
import { getOwnedTransportCompanies, getOwnedUtilityCompanies } from "./asset";

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

export const getLockedLabel = (role) => ROLE_NAMES[role].lockedName;

export const getAntiMonopolyFoundationAmount = (role, count) => {
  const { eligibleCounts, multiplier } = ANTI_MONOPOLY_COMPETITOR_REWARDS;

  return isCompetitor(role)
    ? eligibleCounts.includes(count)
      ? count * multiplier
      : 0
    : ANTI_MONOPOLY_MONOPOLIST_REWARD;
};

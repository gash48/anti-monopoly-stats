import { ASSETS } from "../constants/assets";
import { MORTGAGE_VALUE_MULTIPLIER } from "../constants/globals";
import { PLAYER_ACTION_TYPES as TYPES } from "../store/types";
import { getLockedLabel, isCompetitor } from "./player";

const createLog = (state, action, message) => {
  const { gameLogs, playerLogs } = state;
  const { playerId } = action.payload;

  const logId = gameLogs.length;
  const logData = {
    id: logId,
    action,
    playerId,
    message,
  };
  gameLogs.unshift(logData);
  if (playerId in playerLogs) {
    playerLogs[playerId].push(logId);
  } else {
    playerLogs[playerId] = [logId];
  }
};

export const ACTION_OPERATION_MAPPING = {
  [TYPES.COLLECT_FROM_START]: (state, action) => {
    const { playersCash, treasurer, players } = state;
    const { type, payload } = action;
    const { playerId, moneyToAdd } = payload;
    const { name } = players[playerId];

    playersCash[playerId].balance += moneyToAdd;
    treasurer.balance -= moneyToAdd;

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        tName: treasurer.name,
        moneyToAdd,
      })
    );

    return state;
  },
  [TYPES.BUY_PROPERTY]: (state, action) => {
    const { playersCash, treasurer, players, playersAssets } = state;
    const { type, payload } = action;
    const { playerId, asset } = payload;
    const { name } = players[playerId];
    const { id, houses, buyingPrice, isApartment } = asset;
    const { name: pName } = ASSETS[id];

    const assets = playersAssets[playerId].assets;
    assets[id] = asset;
    playersCash[playerId].balance -= buyingPrice;

    treasurer.balance += buyingPrice;
    treasurer.properties[id] = playerId;
    treasurer.noOfApartments -= isApartment ? 1 : 0;
    treasurer.noOfHouses -= houses;
    treasurer.noOfAssets -= 1;

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        tName: treasurer.name,
        pName,
        price: buyingPrice,
      })
    );

    return state;
  },
  [TYPES.PAY_RENT]: (state, action) => {
    const { playersCash, players } = state;
    const { type, payload } = action;
    const { playerId, assetId, ownerId, rentToPay } = payload;
    const { name } = players[playerId];
    const { name: oName } = players[ownerId];
    const { name: pName } = ASSETS[assetId];

    playersCash[playerId].balance -= rentToPay;
    playersCash[ownerId].balance += rentToPay;

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        rent: rentToPay,
        oName,
        pName,
      })
    );

    return state;
  },
  [TYPES.MORTGAGE]: (state, action) => {
    const { playersCash, players, playersAssets, treasurer } = state;
    const { type, payload } = action;
    const { playerId, assetId } = payload;
    const { name } = players[playerId];
    const { name: pName } = ASSETS[assetId];
    const { buyingPrice, houses, isApartment } =
      playersAssets[playerId].assets[assetId];
    const mortgagedBalance = buyingPrice * MORTGAGE_VALUE_MULTIPLIER;

    playersCash[playerId].balance += mortgagedBalance;
    treasurer.balance -= mortgagedBalance;
    treasurer.noOfHouses += houses || 0;
    treasurer.noOfApartments += isApartment ? 1 : 0;
    treasurer.mortgages[assetId] = playerId;
    delete treasurer.properties[assetId];
    playersAssets[playerId].mortgages[assetId] = mortgagedBalance;
    delete playersAssets[playerId].assets[assetId];

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        balance: mortgagedBalance,
        pName,
      })
    );

    return state;
  },
  [TYPES.REDEEM]: (state, action) => {
    const { playersCash, playersAssets, treasurer, players } = state;
    const { type, payload } = action;
    const { playerId, assetId } = payload;
    const {
      redeemPrice,
      costPrice,
      type: assetType,
      cityId,
      name: pName,
    } = ASSETS[assetId];
    const { mortgages, name: tName } = treasurer;
    const propertyOwnerId = mortgages[assetId];
    const { name: oName } = players[propertyOwnerId];
    const { name } = players[playerId];

    const isSelfRedeemed = playerId === propertyOwnerId;

    const redemptionAmount = isSelfRedeemed
      ? redeemPrice
      : redeemPrice + costPrice;

    treasurer.balance += redeemPrice;
    treasurer.properties[assetId] = playerId;
    delete mortgages[assetId];

    delete playersAssets[propertyOwnerId].mortgages[assetId];
    playersAssets[playerId].assets[assetId] = {
      id: assetId,
      type: assetType,
      cityId,
      houses: 0,
      buyingPrice: costPrice,
      isApartment: false,
    };

    if (isSelfRedeemed) {
      playersCash[propertyOwnerId].balance -= redeemPrice;
    } else {
      playersCash[propertyOwnerId].balance += costPrice;
      playersCash[playerId].balance -= redeemPrice + costPrice;
    }

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        isSelfRedeemed,
        name,
        pName,
        price: redemptionAmount,
        tName,
        oName,
      })
    );

    return state;
  },
  [TYPES.PAY_INCOME_TAX]: (state, action) => {
    const { playersCash, treasurer, players } = state;
    const { type, payload } = action;
    const { playerId, taxToPay } = payload;
    const { name } = players[playerId];

    playersCash[playerId].balance -= taxToPay;
    treasurer.balance += taxToPay;

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        tName: treasurer.name,
        taxToPay,
      })
    );

    return state;
  },
  [TYPES.PAY_TO]: (state, action) => {
    const { playersCash, players, treasurer } = state;
    const { type, payload } = action;
    const { playerId, amount, amountPlayerId } = payload;
    const { name } = players[playerId];

    const isTreasurer = amountPlayerId === treasurer.id;

    const { name: toName } = isTreasurer ? treasurer : players[amountPlayerId];

    playersCash[playerId].balance -= amount;
    if (isTreasurer) {
      treasurer.balance += amount;
    } else {
      playersCash[amountPlayerId].balance += amount;
    }

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        amount,
        toName,
      })
    );

    return state;
  },
  [TYPES.RECEIVE_FROM]: (state, action) => {
    const { playersCash, players, treasurer } = state;
    const { type, payload } = action;
    const { playerId, amount, amountPlayerId } = payload;
    const { name } = players[playerId];
    const isTreasurer = amountPlayerId === treasurer.id;

    const { name: fromName } = isTreasurer
      ? treasurer
      : players[amountPlayerId];

    playersCash[playerId].balance += amount;
    if (isTreasurer) {
      treasurer.balance -= amount;
    } else {
      playersCash[amountPlayerId].balance -= amount;
    }

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        amount,
        fromName,
      })
    );

    return state;
  },
  [TYPES.GET_OUT_OF_PRISON_OR_PRICE_WAR]: (state, action) => {
    const { playersCash, treasurer, players } = state;
    const { type, payload } = action;
    const { playerId, moneyToGetOut } = payload;
    const { name, role } = players[playerId];

    playersCash[playerId].balance -= moneyToGetOut;
    treasurer.balance += moneyToGetOut;

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        tName: treasurer.name,
        moneyToGetOut,
        place: getLockedLabel(role),
      })
    );

    return state;
  },
  [TYPES.ANTI_MONOPOLY_FOUNDATION]: (state, action) => {
    const { playersCash, treasurer, players } = state;
    const { type, payload } = action;
    const { playerId, amount } = payload;
    const { name, role } = players[playerId];

    playersCash[playerId].balance += amount;
    treasurer.balance -= amount;

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        tName: treasurer.name,
        amount,
        isCompetitor: isCompetitor(role),
      })
    );

    return state;
  },
  [TYPES.PROPERTY_TAX]: (state, action) => {
    const { playersCash, treasurer, players } = state;
    const { type, payload } = action;
    const { playerId, taxToPay } = payload;
    const { name } = players[playerId];

    playersCash[playerId].balance -= taxToPay;
    treasurer.balance += taxToPay;

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        tName: treasurer.name,
        taxToPay,
      })
    );

    return state;
  },
  [TYPES.ADD_HOUSE]: (state, action) => {
    const { playersCash, treasurer, players, playersAssets } = state;
    const { type, payload } = action;
    const { playerId, asset, newHousePrice, houses } = payload;
    const { name } = players[playerId];
    const { id, isApartment } = asset;
    const { name: pName } = ASSETS[id];

    const assets = playersAssets[playerId].assets;
    assets[id] = asset;
    playersCash[playerId].balance -= newHousePrice;

    treasurer.balance += newHousePrice;
    treasurer.properties[id] = playerId;
    treasurer.noOfApartments -= isApartment ? 1 : 0;
    treasurer.noOfHouses -= houses;

    createLog(
      state,
      action,
      ACTION_LOG_MESSAGE_MAPPING[type]?.({
        name,
        tName: treasurer.name,
        pName,
        price: newHousePrice,
        houses,
      })
    );

    return state;
  },
};

export const ACTION_LOG_MESSAGE_MAPPING = {
  [TYPES.COLLECT_FROM_START]: ({ name, moneyToAdd, tName }) =>
    `${name} collected $${moneyToAdd} from the ${tName}.`,
  [TYPES.BUY_PROPERTY]: ({ name, pName, price, tName }) =>
    `${name} purchased ${pName} with total value $${price} from the ${tName}.`,
  [TYPES.PAY_RENT]: ({ name, rent, oName, pName }) =>
    `${name} paid $${rent} to ${oName} for ${pName}.`,
  [TYPES.PAY_INCOME_TAX]: ({ name, taxToPay, tName }) =>
    `${name} paid $${taxToPay} to the ${tName} as Income Tax.`,
  [TYPES.PAY_TO]: ({ name, amount, toName }) =>
    `${name} paid $${amount} to ${toName}.`,
  [TYPES.RECEIVE_FROM]: ({ name, amount, fromName }) =>
    `${name} received $${amount} from ${fromName}.`,
  [TYPES.GET_OUT_OF_PRISON_OR_PRICE_WAR]: ({
    name,
    place,
    tName,
    moneyToGetOut,
  }) =>
    `${name} pays $${moneyToGetOut} to the ${tName} to get out from ${place}.`,
  [TYPES.ANTI_MONOPOLY_FOUNDATION]: ({ name, isCompetitor, tName, amount }) =>
    isCompetitor
      ? `${name} gets $${amount} from the ${tName} for Anti-Monopoly Foundation.`
      : `${name} pays $${
          amount * -1
        } to the ${tName} for Anti-Monopoly Foundation.`,
  [TYPES.PROPERTY_TAX]: ({ name, taxToPay, tName }) =>
    `${name} paid $${taxToPay} to the ${tName} as Property Tax.`,
  [TYPES.ADD_HOUSE]: ({ name, tName, pName, price, houses }) =>
    `${name} added ${houses} houses on ${pName} for $${price} from the ${tName}.`,
  [TYPES.MORTGAGE]: ({ name, balance, pName }) =>
    `${name} mortgaged ${pName} at a price of $${balance}.`,
  [TYPES.REDEEM]: ({ isSelfRedeemed, name, pName, price, tName, oName }) =>
    isSelfRedeemed
      ? `${name} self redeemed ${pName} at a price of $${price} from the ${tName}`
      : `${name} redeemed the ${pName} owned by ${oName} at a total price of $${price}`,
};

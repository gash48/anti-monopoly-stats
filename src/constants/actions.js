import { PLAYER_ACTION_TYPES as TYPES } from "../store/types";

import {
  CollectMoney,
  BuyProperty,
  PayRent,
  PayOrReceiveMoney,
  GetOutOfPrisonOrPriceWar,
  AntiMonopolyFoundation,
  PropertyTax,
  IncomeTax,
  AddHouse,
  MortgageProperty,
  RedeemProperty,
} from "../components/dashboard/actions";

export const ACTION_NAME_MAPPING = {
  [TYPES.COLLECT_FROM_START]: "COLLECT MONEY FROM START",
  [TYPES.BUY_PROPERTY]: "BUY PROPERTY",
  [TYPES.PAY_RENT]: "PAY RENT TO",
  [TYPES.MORTGAGE]: "MORTGAGE PROPERTY",
  [TYPES.REDEEM]: "REDEEM PROPERTY",
  [TYPES.PAY_INCOME_TAX]: "PAY INCOME TAX",
  [TYPES.PAY_TO]: "PAY MONEY TO",
  [TYPES.RECEIVE_FROM]: "RECEIVE MONEY FROM",
  [TYPES.GET_OUT_OF_PRISON_OR_PRICE_WAR]: "GET OUT OF PRISON | PRICE WAR",
  [TYPES.ANTI_MONOPOLY_FOUNDATION]: "ANTI MONOPOLY FOUNDATION",
  [TYPES.PROPERTY_TAX]: "PAY PROPERTY TAX",
  [TYPES.ADD_HOUSE]: "ADD HOUSE",
};

export const ACTION_COMPONENT_MAPPING = {
  [TYPES.COLLECT_FROM_START]: CollectMoney,
  [TYPES.BUY_PROPERTY]: BuyProperty,
  [TYPES.PAY_RENT]: PayRent,
  [TYPES.MORTGAGE]: MortgageProperty,
  [TYPES.REDEEM]: RedeemProperty,
  [TYPES.PAY_INCOME_TAX]: IncomeTax,
  [TYPES.PAY_TO]: PayOrReceiveMoney,
  [TYPES.RECEIVE_FROM]: PayOrReceiveMoney,
  [TYPES.GET_OUT_OF_PRISON_OR_PRICE_WAR]: GetOutOfPrisonOrPriceWar,
  [TYPES.ANTI_MONOPOLY_FOUNDATION]: AntiMonopolyFoundation,
  [TYPES.PROPERTY_TAX]: PropertyTax,
  [TYPES.ADD_HOUSE]: AddHouse,
};

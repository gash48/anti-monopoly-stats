import {
  TOTAL_APARTMENTS,
  TOTAL_ASSETS,
  TOTAL_HOUSES,
  TOTAL_MONEY,
} from "./globals";

export const TREASURER = {
  id: 9999,
  name: "Treasurer",
  role: "BANKER",
  color: "purple",
  noOfHouses: TOTAL_HOUSES,
  noOfApartments: TOTAL_APARTMENTS,
  noOfAssets: TOTAL_ASSETS,
  balance: TOTAL_MONEY,
  properties: {},
  mortgages: {},
};

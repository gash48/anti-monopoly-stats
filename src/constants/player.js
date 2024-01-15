import { INITAL_PLAYER_MONEY } from "./globals";

export const ROLES = {
  COMPETITOR: 1,
  MONOPOLIST: 2,
};

export const ROLE_NAMES = {
  [ROLES.COMPETITOR]: { name: "COMPETITOR", lockedName: "PRICE WAR" },
  [ROLES.MONOPOLIST]: { name: "MONOPOLIST", lockedName: "PRISON" },
};

export const ROLE_HOUSES_LIMIT = {
  [ROLES.COMPETITOR]: 5,
  [ROLES.MONOPOLIST]: 4,
};

export const PLAYERS = {
  1: {
    id: 1,
    name: "Riga",
    order: 1,
    color: "orange",
  },
  2: {
    id: 2,
    name: "Charak",
    order: 2,
    color: "blue",
  },
  3: {
    id: 3,
    name: "Gaurav",
    order: 3,
    color: "green",
  },
  4: {
    id: 4,
    name: "Hemlata",
    order: 4,
    color: "red",
  },
};

export const PLAYER_CASH = () => ({
  balance: INITAL_PLAYER_MONEY,
});

export const PLAYER_ASSETS = () => ({
  assets: {},
  mortgages: {},
});

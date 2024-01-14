import { useMemo, useState } from "react";
import {
  Button,
  Segment,
  Form,
  FormGroup,
  FormSelect,
  FormButton,
  Message,
  FormInput,
  FormRadio,
} from "semantic-ui-react";
import { PLAYER_ACTION_TYPES as TYPES } from "../../store/types";
import { ASSETS, ASSET_TYPE, CITIES } from "../../constants/assets";
import {
  checkIfApartment,
  computeNetBalance,
  computeNetRentValue,
  getAllowedHousesLimit,
  getAntiMonopolyFoundationAmount,
  getPrisonOrPriceWar,
} from "../../helpers/player";
import { isHouseProperty } from "../../helpers/asset";
import { ROLES } from "../../constants/player";
import {
  ANTI_MONOPOLY_FOUNDATION_COUNT_OPTIONS,
  ASSET_WORTH_MULTIPLIER,
  MAX_INCOME_TAX,
  MONEY_FROM_START,
  MONEY_TO_GET_OUT_PRISON_OR_WAR,
  PROPERTY_TAX,
} from "../../constants/globals";

export const CollectMoney = ({ dispatch, playerId, resetOperation }) => {
  const onClick = () => {
    dispatch({
      type: TYPES.COLLECT_FROM_START,
      payload: { moneyToAdd: MONEY_FROM_START, playerId },
    });
    resetOperation();
  };

  return (
    <Segment textAlign="center" vertical>
      <Button type="button" positive size="huge" onClick={onClick}>
        Submit
      </Button>
    </Segment>
  );
};

export const BuyProperty = ({ dispatch, state, playerId, resetOperation }) => {
  const [propertyId, setPropertyId] = useState(null);
  const [houses, setHouses] = useState(0);

  const { treasurer, players } = state;
  const role = players[playerId].role;
  const selectedAsset = ASSETS[propertyId];

  const onSubmit = () => {
    const { type, cityId, costPrice, housePrice } = ASSETS[propertyId];

    const buyingPrice = costPrice + houses * (housePrice || 0);
    const asset = {
      id: propertyId,
      type,
      cityId,
      houses,
      buyingPrice,
      isApartment: checkIfApartment(role, houses),
    };

    dispatch({
      type: TYPES.BUY_PROPERTY,
      payload: { playerId, asset },
    });
    resetOperation();
  };

  const assetsOptions = useMemo(
    () =>
      Object.values(ASSETS)
        .filter(({ id }) => {
          const { properties, mortgages } = treasurer;
          return !properties[id] && !mortgages[id];
        })
        .map(({ id, name, cityId, type }) => ({
          key: id,
          text: isHouseProperty(type)
            ? `${CITIES[cityId].name} - ${name}`
            : name,
          value: id,
        })),
    [treasurer]
  );

  const onPropertyChange = (_, { value }) => {
    setPropertyId(value);
  };

  const houseOptions = useMemo(() => {
    const noOfHousesAllowed = getAllowedHousesLimit(role);
    return [...new Array(noOfHousesAllowed + 1)].map((_, idx) => ({
      key: idx,
      value: idx,
      text: idx,
    }));
  }, [role]);

  const onHouseChange = (_, { value }) => {
    setHouses(value);
  };

  return (
    <Segment textAlign="center" vertical>
      <Form onSubmit={onSubmit}>
        <FormGroup widths="equal">
          <FormSelect
            fluid
            label="Choose Property"
            options={assetsOptions}
            placeholder="Property"
            value={propertyId}
            onChange={onPropertyChange}
          />
          {selectedAsset?.housePrice > 0 && (
            <FormSelect
              fluid
              label="Select Houses"
              options={houseOptions}
              placeholder="Houses"
              value={houses}
              onChange={onHouseChange}
            />
          )}
        </FormGroup>
        <FormButton disabled={!propertyId}>Submit</FormButton>
      </Form>
    </Segment>
  );
};

export const PayRent = ({ dispatch, state, playerId, resetOperation }) => {
  const [propertyId, setPropertyId] = useState(null);
  const [count, setCount] = useState(0);

  const { treasurer, players, playersAssets } = state;
  const { properties } = treasurer;

  const selectedAsset = ASSETS[propertyId];
  const assetOwnerId = properties[propertyId];
  const ownerRole = players[assetOwnerId]?.role;

  const assetsOptions = useMemo(
    () =>
      Object.keys(properties)
        .filter((assetId) => {
          const ownerId = properties[assetId];
          return ownerId !== playerId;
        })
        .map((assetId) => {
          const { type, cityId, name } = ASSETS[assetId];
          return {
            key: assetId,
            text: isHouseProperty(type)
              ? `${CITIES[cityId].name} - ${name}`
              : name,
            value: assetId,
          };
        }),
    [properties, playerId]
  );

  const onPropertyChange = (_, { value }) => {
    setPropertyId(value);
  };

  const onCountChange = (_, { value }) => {
    setCount(parseInt(value));
  };

  const rentToPay = useMemo(
    () =>
      assetOwnerId && propertyId
        ? computeNetRentValue({
            role: ownerRole,
            assetId: propertyId,
            assets: playersAssets[assetOwnerId].assets,
            count,
          })
        : 0,
    [assetOwnerId, playersAssets, propertyId, ownerRole, count]
  );

  const onSubmit = () => {
    dispatch({
      type: TYPES.PAY_RENT,
      payload: {
        playerId,
        assetId: propertyId,
        ownerId: assetOwnerId,
        rentToPay,
      },
    });
    resetOperation();
  };

  const isUtilityType = selectedAsset?.type === ASSET_TYPE.UTILITY;

  const formEnabled = isUtilityType ? propertyId && count > 0 : propertyId;

  return (
    <Segment textAlign="center" vertical>
      <Form onSubmit={onSubmit}>
        <FormGroup widths="equal">
          <FormSelect
            fluid
            label="Choose Property"
            options={assetsOptions}
            placeholder="Property"
            value={propertyId}
            onChange={onPropertyChange}
          />
          {isUtilityType && (
            <FormInput
              fluid
              type="number"
              label="Enter Count"
              value={count}
              placeholder="Count"
              onChange={onCountChange}
            />
          )}
        </FormGroup>
        {formEnabled && (
          <Message>
            Rent To Pay: <b>${rentToPay}</b>
          </Message>
        )}
        <FormButton disabled={!formEnabled}>Submit</FormButton>
      </Form>
    </Segment>
  );
};

export const PayOrReceiveMoney = ({
  dispatch,
  state,
  playerId,
  resetOperation,
  type,
}) => {
  const [player, setPlayer] = useState(null);
  const [amount, setAmount] = useState(0);

  const { treasurer, players } = state;
  const { id, name } = treasurer;

  const playerOptions = useMemo(
    () => [
      { key: id, value: id, text: name },
      ...Object.values(players)
        .filter(({ id }) => id !== playerId)
        .map(({ id, name }) => ({
          key: id,
          text: name,
          value: id,
        })),
    ],
    [players, id, name, playerId]
  );

  const onPlayerChange = (_, { value }) => {
    setPlayer(value);
  };

  const onAmountChange = (_, { value }) => {
    setAmount(parseInt(value));
  };

  const onSubmit = () => {
    dispatch({
      type,
      payload: {
        playerId,
        amount,
        amountPlayerId: player,
      },
    });
    resetOperation();
  };

  const formEnabled = player && amount > 0;

  return (
    <Segment textAlign="center" vertical>
      <Form onSubmit={onSubmit}>
        <FormGroup widths="equal">
          <FormSelect
            fluid
            label="Choose Player"
            options={playerOptions}
            placeholder="Player"
            value={player}
            onChange={onPlayerChange}
          />
          {player && (
            <FormInput
              fluid
              type="number"
              label="Enter Amount"
              value={amount}
              placeholder="Amount"
              onChange={onAmountChange}
            />
          )}
        </FormGroup>
        <FormButton disabled={!formEnabled}>Submit</FormButton>
      </Form>
    </Segment>
  );
};

export const GetOutOfPrisonOrPriceWar = ({
  dispatch,
  playerId,
  state,
  resetOperation,
}) => {
  const { role } = state.players[playerId];

  const onClick = () => {
    dispatch({
      type: TYPES.GET_OUT_OF_PRISON_OR_PRICE_WAR,
      payload: { moneyToGetOut: MONEY_TO_GET_OUT_PRISON_OR_WAR, playerId },
    });
    resetOperation();
  };

  return (
    <Segment textAlign="center" vertical>
      <Button type="button" positive size="huge" onClick={onClick}>
        Get Out of {getPrisonOrPriceWar(role)}
      </Button>
    </Segment>
  );
};

export const AntiMonopolyFoundation = ({
  dispatch,
  playerId,
  state,
  resetOperation,
}) => {
  const [count, setCount] = useState(null);

  const { role } = state.players[playerId];
  const { COMPETITOR, MONOPOLIST } = ROLES;

  const handleChange = (_, { value }) => {
    setCount(value);
  };

  const onSubmit = () => {
    const amount = getAntiMonopolyFoundationAmount(role, count);
    dispatch({
      type: TYPES.ANTI_MONOPOLY_FOUNDATION,
      payload: { playerId, amount },
    });
    resetOperation();
  };

  const renderContent = () => {
    switch (role) {
      case MONOPOLIST:
        return (
          <Button type="button" positive size="huge" onClick={onSubmit}>
            Submit
          </Button>
        );
      case COMPETITOR:
        return (
          <Form onSubmit={onSubmit}>
            <FormGroup inline>
              <label>Count</label>
              {ANTI_MONOPOLY_FOUNDATION_COUNT_OPTIONS.map(({ id, name }) => (
                <FormRadio
                  key={`count-${id}`}
                  name="count"
                  label={name}
                  value={id}
                  checked={id === count}
                  onChange={handleChange}
                />
              ))}
            </FormGroup>
            <FormButton disabled={!count}>Submit</FormButton>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <Segment textAlign="center" vertical>
      {renderContent()}
    </Segment>
  );
};

export const PropertyTax = ({ dispatch, playerId, resetOperation }) => {
  const onClick = () => {
    dispatch({
      type: TYPES.PROPERTY_TAX,
      payload: { playerId, taxToPay: PROPERTY_TAX },
    });
    resetOperation();
  };

  return (
    <Segment textAlign="center" vertical>
      <Button type="button" positive size="huge" onClick={onClick}>
        Submit
      </Button>
    </Segment>
  );
};

export const IncomeTax = ({ dispatch, state, playerId, resetOperation }) => {
  const { playersCash, players, playersAssets } = state;
  const { role } = players[playerId];

  const onSubmit = () => {
    dispatch({
      type: TYPES.PAY_INCOME_TAX,
      payload: {
        playerId,
        taxToPay,
      },
    });
    resetOperation();
  };

  const taxToPay = useMemo(() => {
    const { balance } = playersCash[playerId];
    const cashValue = computeNetBalance({ role, balance });
    let assetValue = 0;

    Object.values(playersAssets[playerId].assets).forEach(
      ({ buyingPrice }) => (assetValue += buyingPrice)
    );

    const computedTax =
      cashValue + Math.ceil(assetValue * ASSET_WORTH_MULTIPLIER);
    return Math.min(computedTax, MAX_INCOME_TAX);
  }, [playersCash, playersAssets, role, playerId]);

  return (
    <Segment textAlign="center" vertical>
      <Form onSubmit={onSubmit}>
        <Message>
          Tax To Pay: <b>${taxToPay}</b>
        </Message>
        <FormButton>Submit</FormButton>
      </Form>
    </Segment>
  );
};

export const AddHouse = ({ dispatch, state, playerId, resetOperation }) => {
  const [propertyId, setPropertyId] = useState(null);
  const [houses, setHouses] = useState(1);

  const { players, playersAssets } = state;
  const role = players[playerId].role;
  const { assets } = playersAssets[playerId];
  const selectedAsset = assets[propertyId];
  const currentHouses = selectedAsset?.houses || 0;

  const onSubmit = () => {
    const { type, cityId, housePrice } = ASSETS[propertyId];

    const newHousePrice = houses * (housePrice || 0);
    const buyingPrice = selectedAsset.buyingPrice + newHousePrice;
    const totalHouses = currentHouses + houses;
    const asset = {
      id: propertyId,
      type,
      cityId,
      houses: totalHouses,
      buyingPrice,
      isApartment: checkIfApartment(role, totalHouses),
    };

    dispatch({
      type: TYPES.ADD_HOUSE,
      payload: { playerId, asset, newHousePrice, houses },
    });
    resetOperation();
  };

  const assetsOptions = useMemo(
    () =>
      Object.values(assets)
        .filter(({ type }) => isHouseProperty(type))
        .map(({ id, cityId }) => ({
          key: id,
          text: `${CITIES[cityId].name} - ${ASSETS[id].name}`,
          value: id,
        })),
    [assets]
  );

  const onPropertyChange = (_, { value }) => {
    setPropertyId(value);
  };

  const houseOptions = useMemo(() => {
    const noOfHousesAllowed = getAllowedHousesLimit(role);
    return [...new Array(noOfHousesAllowed - currentHouses)].map((_, idx) => ({
      key: idx + 1,
      value: idx + 1,
      text: idx + 1,
    }));
  }, [role, currentHouses]);

  const onHouseChange = (_, { value }) => {
    setHouses(value);
  };

  return (
    <Segment textAlign="center" vertical>
      <Form onSubmit={onSubmit}>
        <FormGroup widths="equal">
          <FormSelect
            fluid
            label="Choose Property"
            options={assetsOptions}
            placeholder="Property"
            value={propertyId}
            onChange={onPropertyChange}
          />
          {propertyId && (
            <FormSelect
              fluid
              label="Select Houses"
              options={houseOptions}
              placeholder="Houses"
              value={houses}
              onChange={onHouseChange}
            />
          )}
        </FormGroup>
        <FormButton disabled={!propertyId}>Submit</FormButton>
      </Form>
    </Segment>
  );
};

export const MortgageProperty = ({
  dispatch,
  state,
  playerId,
  resetOperation,
}) => {
  const [propertyId, setPropertyId] = useState(null);

  const { playersAssets } = state;
  const { assets } = playersAssets[playerId];

  const onSubmit = () => {
    dispatch({
      type: TYPES.MORTGAGE,
      payload: { playerId, assetId: propertyId },
    });
    resetOperation();
  };

  const assetsOptions = useMemo(
    () =>
      Object.values(assets).map(({ id, name, cityId, type }) => ({
        key: id,
        text: isHouseProperty(type) ? `${CITIES[cityId].name} - ${name}` : name,
        value: id,
      })),
    [assets]
  );

  const onPropertyChange = (_, { value }) => {
    setPropertyId(value);
  };

  return (
    <Segment textAlign="center" vertical>
      <Form onSubmit={onSubmit}>
        <FormGroup widths="equal">
          <FormSelect
            fluid
            label="Choose Property"
            options={assetsOptions}
            placeholder="Property"
            value={propertyId}
            onChange={onPropertyChange}
          />
        </FormGroup>
        <FormButton disabled={!propertyId}>Submit</FormButton>
      </Form>
    </Segment>
  );
};

export const RedeemProperty = ({
  dispatch,
  state,
  playerId,
  resetOperation,
}) => {
  const [propertyId, setPropertyId] = useState(null);
  const [count, setCount] = useState(0);

  const { treasurer, players, playersAssets } = state;
  const { properties, mortgages } = treasurer;

  const selectedAsset = ASSETS[propertyId];
  const assetOwnerId = properties[propertyId];
  const ownerRole = players[assetOwnerId]?.role;

  const assetsOptions = useMemo(
    () =>
      Object.keys(mortgages)
        .filter((assetId) => {
          const ownerId = properties[assetId];
          return ownerId !== playerId;
        })
        .map((assetId) => {
          const { type, cityId, name } = ASSETS[assetId];
          return {
            key: assetId,
            text: isHouseProperty(type)
              ? `${CITIES[cityId].name} - ${name}`
              : name,
            value: assetId,
          };
        }),
    [properties, mortgages, playerId]
  );

  const onPropertyChange = (_, { value }) => {
    setPropertyId(value);
  };

  const onCountChange = (_, { value }) => {
    setCount(parseInt(value));
  };

  const rentToPay = useMemo(
    () =>
      assetOwnerId && propertyId
        ? computeNetRentValue({
            role: ownerRole,
            assetId: propertyId,
            assets: playersAssets[assetOwnerId].assets,
            count,
          })
        : 0,
    [assetOwnerId, playersAssets, propertyId, ownerRole, count]
  );

  const onSubmit = () => {
    dispatch({
      type: TYPES.PAY_RENT,
      payload: {
        playerId,
        assetId: propertyId,
        ownerId: assetOwnerId,
        rentToPay,
      },
    });
    resetOperation();
  };

  const isUtilityType = selectedAsset?.type === ASSET_TYPE.UTILITY;

  const formEnabled = isUtilityType ? propertyId && count > 0 : propertyId;

  return (
    <Segment textAlign="center" vertical>
      <Form onSubmit={onSubmit}>
        <FormGroup widths="equal">
          <FormSelect
            fluid
            label="Choose Property"
            options={assetsOptions}
            placeholder="Property"
            value={propertyId}
            onChange={onPropertyChange}
          />
          {isUtilityType && (
            <FormInput
              fluid
              type="number"
              label="Enter Count"
              value={count}
              placeholder="Count"
              onChange={onCountChange}
            />
          )}
        </FormGroup>
        {formEnabled && (
          <Message>
            Rent To Pay: <b>${rentToPay}</b>
          </Message>
        )}
        <FormButton disabled={!formEnabled}>Submit</FormButton>
      </Form>
    </Segment>
  );
};

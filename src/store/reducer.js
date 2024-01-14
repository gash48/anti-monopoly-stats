import { ACTION_OPERATION_MAPPING } from "../helpers/actions";
import { INITIAL_STATE } from "./state";
import { GAME_ACTION_TYPES } from "./types";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case GAME_ACTION_TYPES.INIT:
      return (state = { ...state, ...payload });
    case GAME_ACTION_TYPES.UNDO_LAST_MOVE:
      return { ...state.lastMoveState };
    case GAME_ACTION_TYPES.RESET_DATA:
      return INITIAL_STATE;
    default:
      return ACTION_OPERATION_MAPPING[type]?.(
        { ...state, lastMoveState: JSON.parse(JSON.stringify(state)) },
        action
      );
  }
};

export default reducer;

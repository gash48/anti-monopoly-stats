import { useCallback, useEffect, useReducer, useRef } from "react";
import { MONOPOLY_STORAGE_KEY } from "../constants/globals";
import { INITIAL_STATE } from "../store/state";

const useReducerWithLogger = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const prevState = useRef(null);

  useEffect(() => {
    console.log("---------- State Initialized ----------");
    console.log("Initial State: ", initialState);
  }, [initialState]);

  useEffect(() => {
    if (state !== INITIAL_STATE) {
      if (prevState.current) {
        console.log("Prev State: ", prevState.current);
        console.log("Next State: ", state);
      }
      prevState.current = state;
      window.localStorage.setItem(MONOPOLY_STORAGE_KEY, JSON.stringify(state));
    } else {
      window.localStorage.removeItem(MONOPOLY_STORAGE_KEY);
      window.location.reload();
    }
  }, [state]);

  const dispatchWithLog = useCallback(
    (action) => {
      console.log("Action: ", action);
      dispatch(action);
    },
    [dispatch]
  );

  return [state, dispatchWithLog];
};

export default useReducerWithLogger;

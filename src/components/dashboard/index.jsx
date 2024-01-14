import React, { useEffect } from "react";
import reducer from "../../store/reducer";
import { INITIAL_STATE } from "../../store/state";
import { GAME_ACTION_TYPES } from "../../store/types";
import { TREASURER } from "../../constants/treasurer";
import { INITAL_PLAYER_MONEY, TOTAL_MONEY } from "../../constants/globals";
import { PLAYERS } from "../../constants/player";
import Players from "./players";
import Scoreboard from "./scoreboard";
import Treasurer from "./treasurer";
import Operations from "./operations";
import { ACTION_COMPONENT_MAPPING } from "../../constants/actions";
import useReducerWithLogger from "../../helpers/reducer";
import GameLogs from "./logs";
import { Segment, Button } from "semantic-ui-react";

const Dashboard = ({ initData, sessionData }) => {
  const [state, dispatch] = useReducerWithLogger(
    reducer,
    sessionData ? JSON.parse(sessionData) : INITIAL_STATE
  );

  const { players, playersCash, playersAssets, treasurer, gameLogs } = state;

  useEffect(() => {
    if (initData) {
      const playersShare = Object.keys(PLAYERS).length * INITAL_PLAYER_MONEY;
      const payload = {
        ...initData,
        treasurer: {
          ...TREASURER,
          balance: TOTAL_MONEY - playersShare,
        },
      };

      dispatch({ type: GAME_ACTION_TYPES.INIT, payload });
    }
  }, []);

  const onExit = () => dispatch({ type: GAME_ACTION_TYPES.RESET_DATA });

  const renderContent = ({ id, type, resetOperation }) => {
    if (!id || !type) {
      return null;
    }

    const Component = ACTION_COMPONENT_MAPPING[type];
    const props = {
      state,
      dispatch,
      playerId: id,
      resetOperation,
      type,
    };
    return Component ? <Component {...props} /> : null;
  };

  return (
    <>
      <div className="player-status-board">
        <Players
          players={players}
          playersCash={playersCash}
          treasurer={treasurer}
        />
      </div>
      <div className="player-status-board">
        <Scoreboard
          players={players}
          playersCash={playersCash}
          playersAssets={playersAssets}
        >
          {treasurer?.id && <Treasurer data={treasurer} />}
        </Scoreboard>
      </div>
      <div className="operations-board">
        <Operations players={players} renderContent={renderContent} />
      </div>
      <div className="logs-board">
        {gameLogs.length > 0 && (
          <GameLogs gameLogs={gameLogs} dispatch={dispatch} />
        )}
      </div>
      <Segment>
        <Button fluid onClick={onExit}>
          Exit Game
        </Button>
      </Segment>
    </>
  );
};

export default Dashboard;

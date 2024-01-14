import React from "react";
import {
  Container,
  Header,
  List,
  ListItem,
  Segment,
  Label,
  Icon,
} from "semantic-ui-react";
import { PLAYERS } from "../../constants/player";
import { GAME_ACTION_TYPES } from "../../store/types";

const GameLogs = ({ gameLogs, dispatch }) => {
  const undoLastMove = () =>
    dispatch({ type: GAME_ACTION_TYPES.UNDO_LAST_MOVE });

  return (
    <Container fluid>
      <div className="log-title-bar">
        <Label as="a" onClick={undoLastMove}>
          <Icon name="undo" /> Undo Last Move
        </Label>
        <Header as="h4" textAlign="center" className="mt-10 mb-10">
          Game Logs
        </Header>
        <Label as="a" onClick={undoLastMove}>
          <Icon name="undo" /> Undo Last Move
        </Label>
      </div>

      <List selection>
        {gameLogs.map(({ id, message, action: { payload } }, idx) => (
          <ListItem key={`log-${id}`} className="list-item">
            <Segment inverted color={PLAYERS[payload.playerId].color}>
              <b>{idx + 1}. </b>
              {message}
            </Segment>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default GameLogs;

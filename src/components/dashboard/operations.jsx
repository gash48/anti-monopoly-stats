import { useEffect, useState } from "react";

import {
  GridColumn,
  Grid,
  ButtonGroup,
  Button,
  Container,
  Header,
} from "semantic-ui-react";
import { PLAYER_ACTION_TYPES } from "../../store/types";
import { ACTION_TYPE_COLOR } from "../../constants/globals";
import { ACTION_NAME_MAPPING } from "../../constants/actions";

const Operations = ({ players, renderContent }) => {
  const [player, setPlayer] = useState(null);
  const [action, setAction] = useState(null);

  const onPlayerSelect = ({ target }) => {
    setPlayer(parseInt(target.id));
  };

  const onActionSelect = ({ target }) => {
    setAction(target.id);
  };

  const resetOperation = () => {
    setPlayer(null);
    setAction(null);
  };

  useEffect(() => {
    if (action) {
      setAction(null);
    }
    // eslint-disable-next-line
  }, [player]);

  const contentData = { id: player, type: action, resetOperation };

  return (
    <Container fluid>
      <Header as="h3" className="pt-10" textAlign="center">
        Operations
      </Header>
      <Grid columns={3}>
        <GridColumn width={4} textAlign="center" verticalAlign="middle">
          <ButtonGroup vertical>
            {Object.values(players).map(({ id, name, color }) => (
              <Button
                key={`player-${id}`}
                id={id}
                onClick={onPlayerSelect}
                color={color}
                inverted
                active={player === id}
                className="mb-10"
                size="large"
              >
                {name}
              </Button>
            ))}
          </ButtonGroup>
        </GridColumn>
        <GridColumn width={8} textAlign="center" verticalAlign="middle">
          {Object.keys(PLAYER_ACTION_TYPES).map((TYPE, idx) => (
            <Button
              key={`action-${idx}`}
              id={TYPE}
              onClick={onActionSelect}
              color={ACTION_TYPE_COLOR}
              inverted
              active={action === TYPE}
              className="m-3"
            >
              {ACTION_NAME_MAPPING[TYPE]}
            </Button>
          ))}
        </GridColumn>
        <GridColumn width={4} textAlign="center" verticalAlign="middle">
          {renderContent(contentData)}
        </GridColumn>
      </Grid>
    </Container>
  );
};

export default Operations;

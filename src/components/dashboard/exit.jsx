import React, { useCallback, useState } from "react";
import { Button, Confirm } from "semantic-ui-react";
import { GAME_ACTION_TYPES } from "../../store/types";

const ExitGame = ({ dispatch }) => {
  const [isOpen, setOpen] = useState(false);

  const onExit = () => {
    dispatch({ type: GAME_ACTION_TYPES.RESET_DATA });
  };

  const onOpen = useCallback(() => setOpen(true), []);

  const onClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button fluid onClick={onOpen}>
        Exit Game
      </Button>
      <Confirm
        header="Are you Sure?"
        content="You want to quit the Game?"
        confirmButton="Yes"
        cancelButton="No"
        open={isOpen}
        onConfirm={onExit}
        onCancel={onClose}
      />
    </>
  );
};

export default ExitGame;

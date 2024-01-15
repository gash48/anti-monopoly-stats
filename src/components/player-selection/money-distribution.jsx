import React from "react";

import {
  Label,
  Message,
  MessageHeader,
  MessageContent,
  LabelGroup,
  Icon,
} from "semantic-ui-react";

import { MONEY_DISTRIBUTION_DENOMINATIONS } from "../../constants/globals";

const MoneyDistribution = () => (
  <Message>
    <MessageHeader className="mb-10">MONEY DISTRIBUTION</MessageHeader>
    <MessageContent>
      <LabelGroup tag>
        {Object.keys(MONEY_DISTRIBUTION_DENOMINATIONS).map((money) => (
          <Label as="a" key={`money-${money}`}>
            ${money} <Icon name="close" />{" "}
            {MONEY_DISTRIBUTION_DENOMINATIONS[money]}
          </Label>
        ))}
      </LabelGroup>
    </MessageContent>
  </Message>
);

export default MoneyDistribution;

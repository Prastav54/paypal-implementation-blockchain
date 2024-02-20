import { gql } from "@apollo/client";

export const PENDING_REQUEST_QUERY = gql`
  query ($sender: String!) {
    currentRequests(where: { sender: $sender, active: true }) {
      sender
      receiver
      amount
      message
      senderName
      active
    }
  }
`;

export const INCOMING_REQUEST_QUERY = gql`
  query ($receiver: String!) {
    currentRequests(where: { receiver: $receiver, active: true }) {
      sender
      receiver
      amount
      message
      senderName
      active
    }
  }
`;

export const HISTORY_QUERY = gql`
  query ($account: String!) {
    histories(where: { ownAccountNumber: $account }) {
      id
      ownAccountNumber
      otherAccountNumber
      otherAccountName
      amount
      message
      action
    }
  }
`;

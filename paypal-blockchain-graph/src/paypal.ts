import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  PaymentCompleted as PaymentCompletedEvent,
  RequestCreated as RequestCreatedEvent,
} from "../generated/Paypal/Paypal";
import { CurrentRequest, History } from "../generated/schema";

export function handleRequestCreated(event: RequestCreatedEvent): void {
  let currentRequest = CurrentRequest.load(
    generateIdForCreateRequest(event.params.requestor, event.params.requestedTo)
  );
  if (!currentRequest) {
    currentRequest = new CurrentRequest(
      generateIdForCreateRequest(
        event.params.requestor,
        event.params.requestedTo
      )
    );
  }
  currentRequest.sender = event.params.requestor;
  currentRequest.receiver = event.params.requestedTo;
  currentRequest.amount = event.params.requestDetails.amount;
  currentRequest.message = event.params.requestDetails.message;
  currentRequest.senderName = event.params.requestDetails.name;
  currentRequest.active = true;
  currentRequest.save();
}

export function handlePaymentCompleted(event: PaymentCompletedEvent): void {
  let currentRequest = CurrentRequest.load(
    generateIdForCreateRequest(event.params.to, event.params.from)
  );
  if (currentRequest) {
    currentRequest.active = false;
    currentRequest.save();
  }
  let history = new History(generateIdForHistory(event));

  // For Paying Account
  history.ownAccountNumber = event.params.from;
  history.otherAccountNumber = event.params.to;
  history.otherAccountName = event.params.receiverName;
  history.amount = event.params.amount;
  history.action = "Send";
  history.message = event.params.message;

  // For Receiving Account
  history.ownAccountNumber = event.params.to;
  history.otherAccountNumber = event.params.from;
  history.otherAccountName = event.params.senderName;
  history.amount = event.params.amount;
  history.action = "Receive";
  history.message = event.params.message;

  history.save();
}

function generateIdForCreateRequest(sender: Bytes, receiver: Bytes): string {
  return `${sender}~~${receiver}`;
}

function generateIdForHistory(event: PaymentCompletedEvent): string {
  let currentTimeStamp: BigInt = event.block.timestamp;
  return currentTimeStamp.toString() + Math.random().toString(36).substr(2);
}

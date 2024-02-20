import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  PaymentCompleted as PaymentCompletedEvent,
  RequestCreated as RequestCreatedEvent,
} from "../generated/Paypal/Paypal";
import { History, CurrentRequest } from "../generated/schema";

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
  let dataId = generateIdForHistory(event);
  let historyForPayingAccount = new History(dataId);

  // For Paying Account
  historyForPayingAccount.ownAccountNumber = event.params.from;
  historyForPayingAccount.otherAccountNumber = event.params.to;
  historyForPayingAccount.otherAccountName = event.params.receiverName;
  historyForPayingAccount.amount = event.params.amount;
  historyForPayingAccount.action = "Send";
  historyForPayingAccount.message = event.params.message;
  historyForPayingAccount.save();

  dataId = dataId + "rec";

  let historyForReceivingAccount = new History(dataId);
  // For Receiving Account
  historyForReceivingAccount.ownAccountNumber = event.params.to;
  historyForReceivingAccount.otherAccountNumber = event.params.from;
  historyForReceivingAccount.otherAccountName = event.params.senderName;
  historyForReceivingAccount.amount = event.params.amount;
  historyForReceivingAccount.action = "Receive";
  historyForReceivingAccount.message = event.params.message;
  historyForReceivingAccount.save();
}

function generateIdForCreateRequest(sender: Bytes, receiver: Bytes): string {
  return `${sender}~~${receiver}`;
}

function generateIdForHistory(event: PaymentCompletedEvent): string {
  let currentTimeStamp: BigInt = event.block.timestamp;
  return currentTimeStamp.toString();
}

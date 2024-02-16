import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { PaymentCompleted, RequestCreated } from "../generated/Paypal/Paypal"

export function createPaymentCompletedEvent(
  from: Address,
  to: Address,
  amount: BigInt,
  message: string,
  senderName: string,
  receiverName: string
): PaymentCompleted {
  let paymentCompletedEvent = changetype<PaymentCompleted>(newMockEvent())

  paymentCompletedEvent.parameters = new Array()

  paymentCompletedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  paymentCompletedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  paymentCompletedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  paymentCompletedEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromString(message))
  )
  paymentCompletedEvent.parameters.push(
    new ethereum.EventParam("senderName", ethereum.Value.fromString(senderName))
  )
  paymentCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "receiverName",
      ethereum.Value.fromString(receiverName)
    )
  )

  return paymentCompletedEvent
}

export function createRequestCreatedEvent(
  requestor: Address,
  requestedTo: Address,
  requestDetails: ethereum.Tuple
): RequestCreated {
  let requestCreatedEvent = changetype<RequestCreated>(newMockEvent())

  requestCreatedEvent.parameters = new Array()

  requestCreatedEvent.parameters.push(
    new ethereum.EventParam("requestor", ethereum.Value.fromAddress(requestor))
  )
  requestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "requestedTo",
      ethereum.Value.fromAddress(requestedTo)
    )
  )
  requestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "requestDetails",
      ethereum.Value.fromTuple(requestDetails)
    )
  )

  return requestCreatedEvent
}

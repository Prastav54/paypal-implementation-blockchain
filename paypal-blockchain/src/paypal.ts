import {
  PaymentCompleted as PaymentCompletedEvent,
  RequestCreated as RequestCreatedEvent
} from "../generated/Paypal/Paypal"
import { PaymentCompleted, RequestCreated } from "../generated/schema"

export function handlePaymentCompleted(event: PaymentCompletedEvent): void {
  let entity = new PaymentCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.message = event.params.message
  entity.senderName = event.params.senderName
  entity.receiverName = event.params.receiverName

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRequestCreated(event: RequestCreatedEvent): void {
  let entity = new RequestCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requestor = event.params.requestor
  entity.requestedTo = event.params.requestedTo
  entity.requestDetails_amount = event.params.requestDetails.amount
  entity.requestDetails_message = event.params.requestDetails.message
  entity.requestDetails_name = event.params.requestDetails.name
  entity.requestDetails_exists = event.params.requestDetails.exists

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

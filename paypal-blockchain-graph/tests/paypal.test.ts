import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { PaymentCompleted } from "../generated/schema"
import { PaymentCompleted as PaymentCompletedEvent } from "../generated/Paypal/Paypal"
import { handlePaymentCompleted } from "../src/paypal"
import { createPaymentCompletedEvent } from "./paypal-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let from = Address.fromString("0x0000000000000000000000000000000000000001")
    let to = Address.fromString("0x0000000000000000000000000000000000000001")
    let amount = BigInt.fromI32(234)
    let message = "Example string value"
    let senderName = "Example string value"
    let receiverName = "Example string value"
    let newPaymentCompletedEvent = createPaymentCompletedEvent(
      from,
      to,
      amount,
      message,
      senderName,
      receiverName
    )
    handlePaymentCompleted(newPaymentCompletedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("PaymentCompleted created and stored", () => {
    assert.entityCount("PaymentCompleted", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "PaymentCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "from",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "PaymentCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "to",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "PaymentCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "PaymentCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "message",
      "Example string value"
    )
    assert.fieldEquals(
      "PaymentCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "senderName",
      "Example string value"
    )
    assert.fieldEquals(
      "PaymentCompleted",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "receiverName",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

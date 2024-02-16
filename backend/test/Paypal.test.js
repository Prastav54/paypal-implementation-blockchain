const { expect, assert } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Paypal Unit Tests", function (){
    let paypal,
    accounts,
    paypalContract,
    deployer,
    user,
    owner
    beforeEach(async() => {
      accounts = await ethers.getSigners();
      deployer = accounts[0];
      user = accounts[1];
      await deployments.fixture(["paypal"]);
      paypalContract = await ethers.getContract("Paypal");
      paypal = paypalContract.connect(deployer);
      owner = await paypal.getOwner();
    });
    describe("Constructor", () => {
      it ("Check whether owner is correct", () => {
        assert.equal(owner, deployer.address)
      })
    });
    describe("Add Name", () => {
      it ("Returns no data for deployer name", async () => {
        let nameDetail = await paypal.getName();
        assert.equal(nameDetail.name, '');
        assert.equal(nameDetail.hasName, false);
      });
      it ("Returns with provided name after addName function is called", async() => {
        await paypal.addName("Prastav");
        let nameDetail = await paypal.getName();
        assert.equal(nameDetail.name, "Prastav");
        assert.equal(nameDetail.hasName, true)
      })
    });
    describe("Create Request", () => {
      beforeEach(async() => {
        await paypal.addName("Prastav");
      })
      it ("Emit RequestCreated Event", async()=> {
        await expect(paypal.createRequest(user.address, 450, "I need Money")).to.emit(paypal, "RequestCreated");
      });
      it ("Should update request mapping after request is made", async () => {
        await paypal.createRequest(user.address, 450, "I need Money");
        const requestDetails = await paypal.getRequestDetails(user.address, deployer.address);
        assert.equal(requestDetails.amount, 450);
        assert.equal(requestDetails.message, "I need Money");
        assert.equal(requestDetails.name, "Prastav");
        assert.equal(requestDetails.exists, true);
      });
      it ("Emitted Events should contain correct parameter value", async () => {
        const createRequest = await paypal.createRequest(user.address, 450, "I need Money");
        const receipt = await createRequest.wait(1);
        const requestDetails = receipt.events[0].args.requestDetails;
        assert.equal(receipt.events[0].args.requestor, deployer.address);
        assert.equal(receipt.events[0].args.requestedTo, user.address);
        assert.equal(requestDetails.amount, 450);
        assert.equal(requestDetails.message, "I need Money");
        assert.equal(requestDetails.name, "Prastav");
        assert.equal(requestDetails.exists, true);
      });
      it ("Throws error if there is already pending request", async () => {
        await paypal.createRequest(user.address, 450, "I need Money");
        await expect(paypal.createRequest(user.address, 450, "I need Money")).to.be.revertedWith("Paypal__RequestAlreadyExists()");
      })
    });
    describe("Check Pay Request Exists or not Before payment", () => {
      it ("Throws error if payment request does not exists", async () => {
        await expect(paypal.payRequest(deployer.address, {value: 860})).to.be.revertedWith("Paypal__NoSuchRequest()")
      })
    });
    describe("Pay Request Other functionality Test", () => {
      beforeEach(async () => {
        paypal = paypalContract.connect(user);
        await paypal.addName("User");
        await paypal.createRequest(deployer.address, 450, "I need Money");
        paypal = paypalContract.connect(deployer);
        await paypal.addName("Deployer");
      });
      it ("Throws error if paid money is not equal to requested money", async () => {
        await expect(paypal.payRequest(user.address, {value: 780})).to.be.revertedWith("PayPal__NotCorrectAmount()")
      });
      it ("Reset the requests mapping after payment is done", async () => {
        await paypal.payRequest(user.address, {value: 450});
        let requestDetail = await paypal.getRequestDetails(deployer.address, user.address);
        assert.equal(requestDetail.exists, false);
      });
      it ("Updates the amount collected after payment is done", async () => {
        await paypal.payRequest(user.address, {value: 450});
        paypal = paypalContract.connect(user);
        let amountCollected = await paypal.getCollectedAmount();
        assert.equal(amountCollected, 450);
      });
      it ("emits the event after payment is done", async () => {
        await expect(paypal.payRequest(user.address, {value: 450})).to.emit(paypal,"PaymentCompleted")
      });
      it ("emits the event with correct parameters", async () => {
        const payment = await paypal.payRequest(user.address, {value: 450});
        const paymentReceipt = await payment.wait(1);
        const eventParam = paymentReceipt.events[0].args;
        assert.equal(eventParam.from, deployer.address);
        assert.equal(eventParam.to, user.address);
        assert.equal(eventParam.amount, 450);
        assert.equal(eventParam.message, "I need Money");
        assert.equal(eventParam.senderName, "Deployer");
        assert.equal(eventParam.receiverName, "User");
      })
    });
    describe("Withdraw Collected Amount", () => {
      it("Reverts with error if there is no amount to withdraw", async () => {
        await expect(
          paypal.withdrawAmountReceived()
        ).to.be.revertedWith("Paypal__NoBalanceToWithDraw()");
      });
      it ("Withdraw Amount", async () => {
        paypal = paypalContract.connect(user);
        await paypal.createRequest(deployer.address, 450, "I need Money");
        paypal = paypalContract.connect(deployer);
        await paypal.payRequest(user.address, {value: 450});
        paypal = paypalContract.connect(user);
        const collectedAmount = await paypal.getCollectedAmount();
        const balanceBefore = await user.getBalance();
        const txResponse = await paypal.withdrawAmountReceived();
        const transactionReceipt = await txResponse.wait(1);
        const { gasUsed, effectiveGasPrice } = transactionReceipt;
        const gasCost = gasUsed.mul(effectiveGasPrice);
        const balanceAfter = await user.getBalance();
        assert(
          balanceAfter.add(gasCost).toString() ==
          balanceBefore.add(collectedAmount).toString()
        );
      });
      it ("Sets the collected amount to zero after withdraw", async () => {
        paypal = paypalContract.connect(user);
        await paypal.createRequest(deployer.address, 450, "I need Money");
        paypal = paypalContract.connect(deployer);
        await paypal.payRequest(user.address, {value: 450});
        paypal = paypalContract.connect(user);
        await paypal.withdrawAmountReceived();
        const collectedAmount = await paypal.getCollectedAmount();
        assert.equal(collectedAmount, 0);
      })
    })
  })
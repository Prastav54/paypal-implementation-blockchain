// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

error Paypal__NoSuchRequest();
error Paypal__RequestAlreadyExists();
error PayPal__NotCorrectAmount();
error Paypal__NoBalanceToWithDraw();
error Paypal__TransactionFailed();

contract Paypal{
  address owner;
  constructor(){
    owner = msg.sender;
  }

  struct request {
    uint256 amount;
    string message;
    string name;
    bool exists;
  }

  struct userName {
    string name;
    bool hasName;
  }

  event RequestCreated(address requestor, address requestedTo, request requestDetails);
  event PaymentCompleted(address from, address to, uint256 amount);

  mapping(address => userName) s_names;
  mapping(address => mapping(address => request)) requests;
  mapping(address => uint256) s_collectedAmount;

  function addName(string memory _name) public {
    userName storage accountName = s_names[msg.sender];
    accountName.name = _name;
    accountName.hasName = true;
  }

  function createRequest(address user, uint256 _amount, string memory _message) public {
    if ((requests[user][msg.sender]).exists) {
      revert Paypal__RequestAlreadyExists();
    }
    request memory newRequest;
    newRequest.amount = _amount;
    newRequest.message = _message;
    if(s_names[msg.sender].hasName){
        newRequest.name = s_names[msg.sender].name;
    }
    newRequest.exists = true;
    requests[user][msg.sender] = newRequest;
    emit RequestCreated(msg.sender, user, newRequest);
  }

  function payRequest(address requestor) public payable {  
    if (!(requests[msg.sender][requestor]).exists){
      revert Paypal__NoSuchRequest();
    }
    request memory requestDetail = requests[msg.sender][requestor];
    if (msg.value != requestDetail.amount){
      revert PayPal__NotCorrectAmount();
    }
    delete requests[msg.sender][requestor];
    s_collectedAmount[requestor] = msg.value;
    emit PaymentCompleted(msg.sender, requestor, msg.value);
  }

  function withdrawAmountReceived() external {
    uint256 amountReceived = s_collectedAmount[msg.sender];
    if (amountReceived <= 0){
      revert Paypal__NoBalanceToWithDraw();
    }
    s_collectedAmount[msg.sender] = 0;
    (bool success,) = payable(msg.sender).call{value: amountReceived}("");
    if (!success){
      s_collectedAmount[msg.sender] = amountReceived;
      revert Paypal__TransactionFailed();
    }
  }

  function getOwner() public view returns(address){
    return owner;
  }

  function getName() public view returns(userName memory){
    return s_names[msg.sender];
  }

  function getRequestDetails(address requestedTo, address requestedBy) public view returns(request memory){
    return requests[requestedTo][requestedBy];
  }

  function getCollectedAmount() public view returns(uint256){
    return s_collectedAmount[msg.sender];
  }
}
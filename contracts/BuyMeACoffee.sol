// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BuyMeACoffee {
    //Event to emit when a memo is created
    event newMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //memo structure
    struct Memo{
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //list of memos
    Memo[] memos;

    //address of wallet address
    address payable owner;

    //that person who deploy this will be the owner
    constructor(){
        owner = payable(msg.sender);
    }

    /**
    * @dev buy me a coffee , send all the eth to this contract only 
    * @param _name name of the buyer
    * @param _message message for me 
    */

     function buyMeACoffee(string memory _name, string memory _message) public payable{
        require(msg.value > 0, "You can't buy anything with 0 eth");

        //add to the memos list
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        //emit the event
        emit newMemo(msg.sender, block.timestamp, _name, _message);
     }

     /**
    * @dev send all the eth on this contract to the owner
    */

    function withdrawTips() public{
        require(owner.send(address(this).balance));
    }

    /**
    * @dev get all the memos
    */

    function getMemos() public view returns(Memo[] memory){
        return memos;
    }



}

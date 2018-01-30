pragma solidity ^0.4.16;

contract HouseRenting {
	struct House {
	    address owner;
		string position;
		uint price;
		uint ts;
	}

	House[] public houses;

	function Publish(string position) payable public{
	    houses.push(House({
	        owner:msg.sender, 
	        position:position, 
	        price:msg.value, 
	        ts:now}));
	}

	function HouseCount() public constant returns (uint c) {
	    c = houses.length;
	}
}



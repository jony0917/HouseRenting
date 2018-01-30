pragma solidity ^0.4.16;

contract HouseRenting {

	enum State{Avaliable, Renting, Closed}

	struct House {
	    address owner;
		string position;
		uint price;
		uint ts;
		State s;
		address lessee;
	}

	House[] public houses;

	function Publish(string position) payable public{
	    houses.push(House({
	        owner:msg.sender, 
	        position:position, 
	        price:msg.value, 
	        ts:now,
	        s:State.Avaliable,
	        lessee:address(0)}));
	}

	function HouseCount() public constant returns (uint c) {
	    c = houses.length;
	}

}



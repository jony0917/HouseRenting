pragma solidity ^0.4.16;

contract HouseRenting {
	enum State{Avaliable, Rented, Closed}

	struct House {
	    uint id; // 0
	    
	    address owner; // 1
	    address lessee; // 2
		
		string position; // 3 
		uint term; // 4
		uint price; // 5

		State s; // 6
		uint publish_time; // 7
		uint rent_out_time; // 8
	}

	House[] public houses;

	function Publish(string position, uint term) payable public{
	    uint next_id = houses.length;
	    houses.push(House({
	        id:next_id,
	        owner:msg.sender,
	        lessee:address(0),
	        position:position,
	        term:term * 1 days,
	        price:msg.value, 
	        s:State.Avaliable,
	        publish_time:now,
	        rent_out_time:0}));
	}

	function HouseCount() public constant returns (uint c) {
	    c = houses.length;
	}
	
	function Rent(uint id) payable public{
	    require(id < houses.length);
	    require(houses[id].owner != msg.sender);
	    require(houses[id].price * 2 == msg.value);
	    require(houses[id].s == State.Avaliable);
	    
	    houses[id].lessee = msg.sender;
	    houses[id].s = State.Rented;
	    houses[id].rent_out_time = now;
	}
	
	function Close(uint id) public {
	    require(id < houses.length);
	    require(houses[id].s == State.Rented);
	    require(houses[id].owner == msg.sender || houses[id].lessee == msg.sender);
	    require(now >= houses[id].rent_out_time + houses[id].term);
	    
	    houses[id].owner.transfer(houses[id].price * 2);
	    houses[id].lessee.transfer(houses[id].price);
	    houses[id].s = State.Closed;
	}
}






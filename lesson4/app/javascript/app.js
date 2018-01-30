//
//global variables
//
localProvider = "http://localhost:8545";
abi = JSON.parse('[{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"Freeze","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"Rent","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"percent_to_owner","type":"uint256"}],"name":"Judge","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"judger","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"houses","outputs":[{"name":"id","type":"uint256"},{"name":"owner","type":"address"},{"name":"lessee","type":"address"},{"name":"position","type":"string"},{"name":"term","type":"uint256"},{"name":"price","type":"uint256"},{"name":"s","type":"uint8"},{"name":"publish_time","type":"uint256"},{"name":"rent_out_time","type":"uint256"},{"name":"freezer","type":"address"},{"name":"freeze_time","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"Close","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"HouseCount","outputs":[{"name":"c","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"position","type":"string"},{"name":"term","type":"uint256"}],"name":"Publish","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
contractAddress = '0x0c836d1c801e4667f2bbaab3960bcd811e868945';

web3 = new Web3(new Web3.providers.HttpProvider(localProvider));
rentingContract = web3.eth.contract(abi);
contractInstance = rentingContract.at(contractAddress);


function getStateMessage(code) {
	var States = ['Avaliable', 'Rented', 'Freezed', 'Closed'];
	return States[code];
}

function InitAccountInfo() {
	var balance = web3.eth.getBalance(web3.eth.defaultAccount);
	document.getElementById("account_balance").innerHTML = balance.toString(10);
}

function InitMyPublishedHouseTable(table){
	table.innerHTML = "";
	var tr = document.createElement('tr');

	var th_id = document.createElement('th');
	th_id.innerHTML = "ID";
	tr.appendChild(th_id);

	var th_owner = document.createElement('th');
	th_owner.innerHTML = "Owner";
	tr.appendChild(th_owner);

	var th_lessee = document.createElement('th');
	th_lessee.innerHTML = "Lessee";
	tr.appendChild(th_lessee);

	var th_address = document.createElement('th');
	th_address.innerHTML = "Position";
	tr.appendChild(th_address);

	var th_term = document.createElement('th');
	th_term.innerHTML = "Term";
	tr.appendChild(th_term);

	var th_price = document.createElement('th');
	th_price.innerHTML = "Price";
	tr.appendChild(th_price);

	var th_state = document.createElement('th');
	th_state.innerHTML = "State";
	tr.appendChild(th_state);

	var th_publish_date = document.createElement('th');
	th_publish_date.innerHTML = "PublishDate";
	tr.appendChild(th_publish_date);

	var th_rent_out_date = document.createElement('th');
	th_rent_out_date.innerHTML = "RentOutDate";
	tr.appendChild(th_rent_out_date);

	var th_finish_date = document.createElement('th');
	th_finish_date.innerHTML = "FinishDate";
	tr.appendChild(th_finish_date);

	var th_operation = document.createElement('th');
	th_operation.innerHTML = 'Operation';
	tr.appendChild(th_operation);

	table.appendChild(tr);
}

function AppendMyPublishedHouse(table, result){
	var tr = document.createElement('tr');

	var th_id = document.createElement('th');
	th_id.innerHTML = result[0].toString();
	tr.appendChild(th_id);

	var th_owner = document.createElement('th');
	th_owner.innerHTML = result[1];
	tr.appendChild(th_owner);

	var th_lessee = document.createElement('th');
	th_lessee.innerHTML = result[2];
	tr.appendChild(th_lessee);

	var th_position = document.createElement('th');
	th_position.innerHTML = result[3];
	tr.appendChild(th_position);

	var th_term = document.createElement("th");
	th_term.innerHTML = (result[4].toNumber() / (24.0 * 60 * 60)).toFixed(5);
	tr.appendChild(th_term);

	var th_price = document.createElement('th');
	th_price.innerHTML = result[5].toString();
	tr.appendChild(th_price);

	var th_state = document.createElement('th');
	th_state.innerHTML = getStateMessage(result[6]);
	tr.appendChild(th_state);

	var th_publish_date = document.createElement('th');
	var newDate = new Date();  
	newDate.setTime(result[7].toNumber() * 1000);	
	th_publish_date.innerHTML = newDate.toLocaleString();//result[3].toString();
	tr.appendChild(th_publish_date);

	if (result[6] != 0) {
		var th_rent_out_date = document.createElement('th');
		var newDate = new Date();  
		newDate.setTime(result[8].toNumber() * 1000);
		th_rent_out_date.innerHTML = newDate.toLocaleString();
		tr.appendChild(th_rent_out_date);

		var th_finish_date = document.createElement('th');
		newDate.setTime((result[8].toNumber() + result[4].toNumber()) * 1000);
		th_finish_date.innerHTML = newDate.toLocaleString();
		tr.appendChild(th_finish_date);

	}else {
		var th_rent_out_date = document.createElement('th');
		th_rent_out_date.innerHTML = "--";
		tr.appendChild(th_rent_out_date);

		var th_finish_date = document.createElement('th');
		th_finish_date.innerHTML = "--";
		tr.appendChild(th_finish_date);
	}

	if(result[6] == 1){
		var th_operation = document.createElement('th');
		var button_close = document.createElement('button');
		button_close.innerHTML = 'Close';
		button_close.id = result[0];
		button_close.onclick = function(){
			contractInstance.Close(this.id, {from:web3.eth.defaultAccount, gas:470000}, function(receipt){
				alert(receipt);
				console.log(receipt);
			});
		};
		th_operation.appendChild(button_close);

		var button_freeze = document.createElement('button');
		button_freeze.innerHTML = 'Freeze';
		button_freeze.id = result[0];
		button_freeze.onclick = function() {
			contractInstance.Freeze(this.id, {from:web3.eth.defaultAccount, gas:470000}, function(receipt){
				alert(receipt);
				console.log(receipt);
			});
		};
		th_operation.appendChild(button_freeze);

		tr.appendChild(th_operation);
	}

	table.appendChild(tr);
}

function InitMyRentedHouseTable(table){
	table.innerHTML = "";
	var tr = document.createElement('tr');

	var th_id = document.createElement('th');
	th_id.innerHTML = "ID";
	tr.appendChild(th_id);

	var th_owner = document.createElement("th");
	th_owner.innerHTML = "Owner";
	tr.appendChild(th_owner);

	var th_lessee = document.createElement('th');
	th_lessee.innerHTML = 'Lessee';
	tr.appendChild(th_lessee);

	var th_position = document.createElement('th');
	th_position.innerHTML = "Position";
	tr.appendChild(th_position);

	var th_term = document.createElement('th');
	th_term.innerHTML = "Term";
	tr.appendChild(th_term);

	var th_price = document.createElement('th');
	th_price.innerHTML = "Price";
	tr.appendChild(th_price);

	var th_state = document.createElement('th');
	th_state.innerHTML = "State";
	tr.appendChild(th_state);

	var th_publish_date = document.createElement('th');
	th_publish_date.innerHTML = "PublishDate";
	tr.appendChild(th_publish_date);

	var th_rent_out_date = document.createElement('th');
	th_rent_out_date.innerHTML = "RentOutDate";
	tr.appendChild(th_rent_out_date);

	var th_finish_date = document.createElement('th');
	th_finish_date.innerHTML = "FinishDate";
	tr.appendChild(th_finish_date);

	var th_operation = document.createElement('th');
	th_operation.innerHTML = "Operation";
	tr.appendChild(th_operation);


	table.appendChild(tr);
}

function AppendMyRentedHouse(table, result){
	var tr = document.createElement('tr');

	var th_id = document.createElement('th');
	th_id.innerHTML = result[0];
	tr.appendChild(th_id);

	var th_owner = document.createElement("th");
	th_owner.innerHTML = result[1];
	tr.appendChild(th_owner);

	var th_lessee = document.createElement('th');
	th_lessee.innerHTML = result[2];
	tr.appendChild(th_lessee);

	var th_position = document.createElement('th');
	th_position.innerHTML = result[3];
	tr.appendChild(th_position);

	var th_term = document.createElement('th');
	th_term.innerHTML = (result[4].toFixed(2) / (24 * 60 * 60)).toString();
	tr.appendChild(th_term);

	var th_price = document.createElement('th');
	th_price.innerHTML = result[5].toString();
	tr.appendChild(th_price);

	var th_state = document.createElement('th');
	th_state.innerHTML = getStateMessage(result[6]);
	tr.appendChild(th_state);

	var th_publish_date = document.createElement('th');
	var newDate = new Date();  
	newDate.setTime(result[7].toNumber() * 1000);	
	th_publish_date.innerHTML = newDate.toLocaleString();
	tr.appendChild(th_publish_date);

	var th_rent_out_date = document.createElement('th');
	newDate.setTime(result[8].toNumber() * 1000);
	th_rent_out_date.innerHTML = newDate.toLocaleString();
	tr.appendChild(th_rent_out_date);

	var th_finish_date = document.createElement('th');
	newDate.setTime((result[8].toNumber() + result[4].toNumber()) * 1000);
	th_finish_date.innerHTML = newDate.toLocaleString();
	tr.appendChild(th_finish_date);

	if(result[6] == 1){
		var th_operation = document.createElement('th');
		var button_close = document.createElement('button');
		button_close.innerHTML = 'Close';
		button_close.id = result[0];
		button_close.onclick = function(){
		contractInstance.Close(this.id, {from:web3.eth.defaultAccount, gas:470000}, function(receipt){
				alert(receipt);
				console.log(receipt);
			});
		};
		th_operation.appendChild(button_close);

		var button_freeze = document.createElement('button');
		button_freeze.innerHTML = 'Freeze';
		button_freeze.id = result[0];
		button_freeze.onclick = function() {
			contractInstance.Freeze(this.id, {from:web3.eth.defaultAccount, gas:470000}, function(receipt){
				alert(receipt);
				console.log(receipt);
			});
		};
		th_operation.appendChild(button_freeze);
		tr.appendChild(th_operation);
	}

	table.appendChild(tr);	
}

function InitOtherHouseTable(table){
	table.innerHTML = "";
	var tr = document.createElement('tr');

	var th_id = document.createElement('th');
	th_id.innerHTML = "ID";
	tr.appendChild(th_id);

	var th_owner = document.createElement("th");
	th_owner.innerHTML = "Owner";
	tr.appendChild(th_owner);

	var th_lessee = document.createElement('th');
	th_lessee.innerHTML = "Lessee";
	tr.appendChild(th_lessee);

	var th_address = document.createElement('th');
	th_address.innerHTML = "Position";
	tr.appendChild(th_address);

	var th_term = document.createElement('th');
	th_term.innerHTML = "Term";
	tr.appendChild(th_term);

	var th_price = document.createElement('th');
	th_price.innerHTML = "Price";
	tr.appendChild(th_price);

	var th_state = document.createElement('th');
	th_state.innerHTML = "State";
	tr.appendChild(th_state);

	var th_publish_date = document.createElement('th');
	th_publish_date.innerHTML = "PublishDate";
	tr.appendChild(th_publish_date);

	var th_rent_out_date = document.createElement('th');
	th_rent_out_date.innerHTML = "RentOutDate";
	tr.appendChild(th_rent_out_date);

	var th_finish_date = document.createElement('th');
	th_finish_date.innerHTML = "FinishDate";
	tr.appendChild(th_finish_date);

	var th_operation = document.createElement('th');
	th_operation.innerHTML = "Operation";
	tr.appendChild(th_operation);

	table.appendChild(tr);
}

function AppendOtherHouse(table, result){
	var tr = document.createElement('tr');

	var th_id = document.createElement('th');
	th_id.innerHTML = result[0].toString();
	tr.appendChild(th_id);

	var th_owner = document.createElement("th");
	th_owner.innerHTML = result[1];
	tr.appendChild(th_owner);

	var th_lessee = document.createElement('th');
	th_lessee.innerHTML = result[2];
	tr.appendChild(th_lessee);

	var th_position = document.createElement('th');
	th_position.innerHTML = result[3];
	tr.appendChild(th_position);

	var th_term = document.createElement('th');
	th_term.innerHTML = (result[4].toNumber() / (24 * 60 * 60)).toString();
	tr.appendChild(th_term);

	var th_price = document.createElement('th');
	th_price.innerHTML = result[5].toString();
	tr.appendChild(th_price);

	var th_state = document.createElement('th');
	th_state.innerHTML = getStateMessage(result[6]);
	tr.appendChild(th_state);

	var th_publish_date = document.createElement('th');
	var newDate = new Date();  
	newDate.setTime(result[7].toNumber() * 1000);	
	th_publish_date.innerHTML = newDate.toLocaleString();
	tr.appendChild(th_publish_date);

	if(result[6] != 0){
		var th_rent_out_date = document.createElement('th');
		newDate.setTime(result[8].toNumber() * 1000);
		th_rent_out_date.innerHTML = newDate.toLocaleString();
		tr.appendChild(th_rent_out_date);

		var th_finish_date = document.createElement('th');
		newDate.setTime((result[8].toNumber() + result[4].toNumber()) * 1000);
		th_finish_date.innerHTML = newDate.toLocaleString();
		tr.appendChild(th_finish_date);

		var th_operation = document.createElement('th');
		th_operation.innerHTML == '--';
		tr.appendChild(th_operation);

	}else{
		var th_rent_out_date = document.createElement('th');
		th_rent_out_date.innerHTML = '--';
		tr.appendChild(th_rent_out_date);

		var th_finish_date = document.createElement('th');
		th_finish_date.innerHTML = '--';
		tr.appendChild(th_finish_date);

		var th_operation = document.createElement('th');
		var rent_button = document.createElement('button');
		rent_button.innerHTML = "Rent";
		rent_button.id = result[0];
		rent_button.price = result[5];
		rent_button.onclick = function(){
			alert(this.id);

			contractInstance.Rent(this.id, {from:web3.eth.defaultAccount, value:parseInt(this.price) * 2, gas:470000}, function(receipt){
				alert(receipt);
				console.log(receipt);
			});
		};
		th_operation.appendChild(rent_button);
		tr.appendChild(th_operation);
	}

	table.appendChild(tr);
}

function InitFreezedHouseTable(table){
	table.innerHTML = "";
	var tr = document.createElement('tr');

	var th_id = document.createElement('th');
	th_id.innerHTML = "ID";
	tr.appendChild(th_id);

	var th_owner = document.createElement("th");
	th_owner.innerHTML = "Owner";
	tr.appendChild(th_owner);

	var th_lessee = document.createElement('th');
	th_lessee.innerHTML = "Lessee";
	tr.appendChild(th_lessee);

	var th_address = document.createElement('th');
	th_address.innerHTML = "Position";
	tr.appendChild(th_address);

	var th_term = document.createElement('th');
	th_term.innerHTML = "Term";
	tr.appendChild(th_term);

	var th_price = document.createElement('th');
	th_price.innerHTML = "Price";
	tr.appendChild(th_price);

	var th_state = document.createElement('th');
	th_state.innerHTML = "State";
	tr.appendChild(th_state);

	var th_publish_date = document.createElement('th');
	th_publish_date.innerHTML = "PublishDate";
	tr.appendChild(th_publish_date);

	var th_rent_out_date = document.createElement('th');
	th_rent_out_date.innerHTML = "RentOutDate";
	tr.appendChild(th_rent_out_date);

	var th_finish_date = document.createElement('th');
	th_finish_date.innerHTML = "FinishDate";
	tr.appendChild(th_finish_date);

	var th_freeze_date = document.createElement('th');
	th_freeze_date.innerHTML = 'FreezeDate';
	tr.appendChild(th_freeze_date);

	var th_freezer = document.createElement('th');
	th_freezer.innerHTML = "Freezer";
	tr.appendChild(th_freezer);

	var th_operation = document.createElement('th');
	th_operation.innerHTML = "Operation";
	tr.appendChild(th_operation);

	table.appendChild(tr);
}

function AppendFreezedHouse(table, result){
	var tr = document.createElement('tr');

	var th_id = document.createElement('th');
	th_id.innerHTML = result[0].toString();
	tr.appendChild(th_id);

	var th_owner = document.createElement("th");
	th_owner.innerHTML = result[1];
	tr.appendChild(th_owner);

	var th_lessee = document.createElement('th');
	th_lessee.innerHTML = result[2];
	tr.appendChild(th_lessee);

	var th_position = document.createElement('th');
	th_position.innerHTML = result[3];
	tr.appendChild(th_position);

	var th_term = document.createElement('th');
	th_term.innerHTML = (result[4].toNumber() / (24 * 60 * 60)).toString();
	tr.appendChild(th_term);

	var th_price = document.createElement('th');
	th_price.innerHTML = result[5].toString();
	tr.appendChild(th_price);

	var th_state = document.createElement('th');
	th_state.innerHTML = getStateMessage(result[6]);
	tr.appendChild(th_state);

	var th_publish_date = document.createElement('th');
	var newDate = new Date();  
	newDate.setTime(result[7].toNumber() * 1000);	
	th_publish_date.innerHTML = newDate.toLocaleString();
	tr.appendChild(th_publish_date);

	var th_rent_out_date = document.createElement('th');
	newDate.setTime(result[8].toNumber() * 1000);
	th_rent_out_date.innerHTML = newDate.toLocaleString();
	tr.appendChild(th_rent_out_date);

	var th_finish_date = document.createElement('th');
	newDate.setTime((result[8].toNumber() + result[4].toNumber()) * 1000);
	th_finish_date.innerHTML = newDate.toLocaleString();
	tr.appendChild(th_finish_date);

	var th_freeze_date = document.createElement('th');
	newDate.setTime(result[10].toNumber() * 1000);
	th_freeze_date.innerHTML = newDate.toLocaleString();
	tr.appendChild(th_freeze_date);

	var th_freezer = document.createElement('th');
	th_freezer.innerHTML = result[9];
	tr.appendChild(th_freezer);

	var th_operation = document.createElement('th');

	var select_judge_percent = document.createElement('select');
	select_judge_percent.id = "select_judge_percent_" + result[0].toString();
	var  percents = ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
	for(var i = 0; i < percents.length; i++){
		var option = document.createElement("option");
		option.value = percents[i];
		option.innerHTML = percents[i];
		select_judge_percent.appendChild(option);
	}
	th_operation.appendChild(select_judge_percent);

	var rent_button = document.createElement('button');
	rent_button.innerHTML = "Judge";
	rent_button.id = result[0];
	rent_button.select_id = select_judge_percent.id;
	rent_button.onclick = function(){
		alert(this.id);
		console.log(this.id);
		console.log(this.select_id);

		var percent = document.getElementById(this.select_id).value;
		console.log(percent);

		contractInstance.Judge(
			this.id, 
			parseInt(percent),
			{from:web3.eth.defaultAccount, value:parseInt(this.price), gas:470000}, 
			function(receipt){
			alert(receipt);
			console.log(receipt);
		});
	};
	th_operation.appendChild(rent_button);
	tr.appendChild(th_operation);


	table.appendChild(tr);	
}

function InitHouses() {
	if(web3.eth.defaultAccount == web3.eth.judgerAccount){
		document.getElementById("house_publish_block").hidden = "hidden";
		document.getElementById("my_published_houses_div").hidden = "hidden";
		document.getElementById("my_rented_houses_div").hidden = "hidden";
		document.getElementById("all_houses_div").hidden = "hidden";
		document.getElementById("freezed_houses_div").hidden = "";

		InitFreezedHouseTable(document.getElementById("freezed_houses"));
	}else{
		document.getElementById("house_publish_block").hidden = "";
		document.getElementById("my_published_houses_div").hidden = "";
		document.getElementById("my_rented_houses_div").hidden = "";
		document.getElementById("all_houses_div").hidden = "";
		document.getElementById("freezed_houses_div").hidden = "hidden";

		InitMyPublishedHouseTable(document.getElementById("my_published_houses"));
		InitMyRentedHouseTable(document.getElementById("my_rented_houses"));
		InitOtherHouseTable(document.getElementById("all_houses"));
	}

	contractInstance.HouseCount({from:web3.eth.defaultAccount}, function(error, result){
		console.log(error);
		console.log(result.toNumber());
		
		for(var i = 0; i < result.toNumber(); i++){
			contractInstance.houses(i, {from:web3.eth.defaultAccount}, function(error, result){
				console.log(error);
				console.log(result);
				console.log(web3.eth.defaultAccount);

				if(web3.eth.defaultAccount == web3.eth.judgerAccount){
					if(result[6] == 2){
						//freezed houses.
						var table = document.getElementById("freezed_houses");
						AppendFreezedHouse(table, result);
					}
				}else{
					if(result[1] == web3.eth.defaultAccount){
						//my published house, owner == defaultAccount
						var table = document.getElementById("my_published_houses");
						AppendMyPublishedHouse(table, result);
					}else if(result[2] == web3.eth.defaultAccount){
						//my rented house, lessee == defaultAccount
						var table = document.getElementById("my_rented_houses");
						AppendMyRentedHouse(table, result);
					}else{
						//other houses
						var table = document.getElementById("all_houses");
						AppendOtherHouse(table, result);
					}
				}

					
			});
		}
	});
}

function OnAddressChange(){
	console.log(this.value);
	if(this.value != web3.eth.defaultAccount){
		web3.eth.defaultAccount = this.value;
		InitAccountInfo();
		InitHouses();
	}
}

function Publish() {
	var house_position = document.getElementById("publish_position").value;
	var house_price = document.getElementById("publish_price").value;
	var house_term = document.getElementById("publish_term").value;
	
	console.log(house_position);
	console.log(house_price);
	console.log(house_term);
	contractInstance.Publish(
		house_position, 
		parseInt(house_term),
		{from:web3.eth.defaultAccount, value:parseInt(house_price), gas:470000}, function(receipt){
			alert(receipt);
			console.log(receipt);
	});
}



window.onload = function() {
	if (web3.eth.accounts.length == 0) {
		alert("Get accounts failed, check your provider!");
		return;
	};

	var account = web3.eth.accounts[0];
	if(web3.eth.defaultAccount == null){
		web3.eth.defaultAccount = account;
	}

	document.getElementById("network").innerHTML = web3.version.network;

	//document.getElementById("account_address").innerHTML = account;
	for(var i = 0; i < web3.eth.accounts.length; i++){
		var option = document.createElement("option");
		option.value = web3.eth.accounts[i];
		option.innerHTML = web3.eth.accounts[i];
		document.getElementById("account_address").appendChild(option);
	}

	contractInstance.judger({from:web3.eth.defaultAccount}, function(error, receipt){
		console.log(error);
		console.log(receipt);
		web3.eth.judgerAccount = receipt;

		InitAccountInfo();
		InitHouses();
		
	});

	document.getElementById("publish_button").onclick = Publish;
	document.getElementById("account_address").onchange = OnAddressChange;	
};


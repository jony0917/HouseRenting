#!/usr/bin/env node


Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));


fs = require('fs');
code = fs.readFileSync('./contract/HouseRenting.sol').toString();
solc = require('solc');
compiledCode = solc.compile(code);

abiDefinition = JSON.parse(compiledCode.contracts[':HouseRenting'].interface);
byteCode = compiledCode.contracts[':HouseRenting'].bytecode;
HouseRentingContract = web3.eth.contract(abiDefinition);
deployedContract = HouseRentingContract.new({data:byteCode, from:web3.eth.accounts[0], gas:5000000}, function(err, myContract){
	if(!err) {
       // NOTE: The callback will fire twice!
       // Once the contract has the transactionHash property set and once its deployed on an address.

       // e.g. check tx hash on the first call (transaction send)
       if(!myContract.address) {
       	console.log("transaction hash async:");
       	console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract


       // check address on the second call (contract deployed)
       } else {
       		console.log("contract address async:");
       		console.log(myContract.address) // the contract address
       }

       // Note that the returned "myContractReturned" === "myContract",
       // so the returned "myContractReturned" object will also get the address set.
    }

});

console.log("abi:");
console.log(compiledCode.contracts[':HouseRenting'].interface);
console.log("contract address sync:");
console.log(deployedContract.address);



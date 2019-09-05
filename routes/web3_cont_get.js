var express = require('express');
var router = express.Router();

// npm install web3 --save
var Web3 = require('web3');

var w3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// ABI는 remix compile 후 우측 하단에서 복사해온 값
var ABI =
[
	{
		"constant": true,
		"inputs": [],
		"name": "var1",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_var1",
				"type": "string"
			}
		],
		"name": "setString",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "run",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

// Remix에서 deploy 후 Deployed Contracts에서 복사한 값
var CA = '0xc32cc5019ef11448567aab00fc48348b12d56ade';

const Contract = new w3.eth.Contract(ABI, CA);

Contract.methods.run().call().then( data =>{
    console.log('var1의 값 : ', data);
});

module.exports = router;
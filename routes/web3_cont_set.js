var express = require('express');
var router = express.Router();

// npm install web3 --save
var Web3 = require('web3');

// npm install ethereumjs-tx --save
const Tx = require('ethereumjs-tx').Transaction

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
var EOA1 = '0x40116D43de20f24d1Ab2305C33Daa66F5E049f97'; // 가나슈에서 복사한 한 명의 Accounts 당사자 값, 2번째 사람이 계약서 변경해서 보냄
var PRIVATE_KEY = '5ab957fed9167de66e2c38e68b9714a2d7a5c351a440b48d8fa0514a08f5c8b9'; //가나슈에서 복사한 개인키값

var setStringExec = Contract.methods.setString("change the contents of contract"); //remix 계약서상 메서드 setString 이용 계약서 변경
var setStringByteCode = setStringExec.encodeABI();

const Gwei = 9;
const unit = 10**Gwei;
const gasLimit = 221000;
const gasPrice = 21*unit;
w3.eth.getTransactionCount(EOA1, "pending", (err,nonce)=>{
    var rawTx ={
        nonce : nonce,
        gasPrice : gasPrice,
        gasLimit : gasLimit,
        data : setStringByteCode,
        from : EOA1,
        to : CA
    }
    let privateKey = new Buffer.from(PRIVATE_KEY, "hex");
    let tx = new Tx(rawTx);
    tx.sign(privateKey);
    let serializedTx = tx.serialize(); // 직렬화 시켜서 전송
    w3.eth.sendSignedTransaction('0x'+serializedTx.toString("hex"),
    (err,txHash)=>{
        console.log('txHash', txHash); // 전송 성공하면 tx 코드가 한 개 생성됨
    })
});

module.exports = router;
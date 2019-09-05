var express = require('express');
var router = express.Router();

// npm install web3 --save
var Web3 = require('web3');

const ABI = [
	}
]

const CA = '';

var w3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
var ws3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'))

var contract = new ws3.eth.Contract(ABI, CA);

// 이벤트 받기
contract.events.E_setString({}, function(err, event){
    if(!err){
        // console.log(event);
        console.log('event : ', event.returnValues.val1);
    }
});

module.exports = router;
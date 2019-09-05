var express = require('express');
var router = express.Router();
var Web3 = require('web3');

var w3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var ws3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));

// account 읽기
w3.eth.getAccounts(function(error, result){
    console.log("account list : ", result);

    for(var i=0; i<result.length; i++){
        console.log(result[i]);
        w3.eth.getBalance(result[i], (err, balanceOf)=>{
            console.log("balance : ", balanceOf);
        });
    }
    // 0번에서 5번으로 10000 전송
    w3.eth.sendTransaction({from:result[0],
       to:result[5], value:10000}, (err, txHash)=>{
        console.log(txHash);
    })
});

// account 생성, 암호 : p
w3.eth.personal.newAccount('p', (err, createdAddress)=>{
    if(!err){
        console.log("account address : ", createdAddress);
    }
});

module.exports = router;
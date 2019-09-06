var express = require('express');
var router = express.Router();

const Web3 = require('web3'); // npm install web3 --save
const Tx = require('ethereumjs-tx').Transaction; //npm install ethereumjs-tx --save

var w3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
// 보냄 5번째 계정 사용
var EOA1 = '0xfA74D8181cC4c7aE0d301Abef3C06d53F8fc57Ea';
var EOA1_PRIVATE_KEY = '24a3593114d24013523040bbc8aceb38ae13941c5e700158fa312fa53ad47b96';

// 받음 6번 계정
var EOA2 = '0xf753Ca7524BF97F398BD2EE1f789eD7A0f00cbaF';

const Gwei = 9;
const unit = 10 ** Gwei;
const gasLimit = 21000;
const gasPrice = 21 * unit;

// 미해결, 계류 중이 있는지 확인
w3.eth.getTransactionCount(EOA1, "pending", (err,nonce)=>{
    let allEth = 500000000000;
    
    let rawTx = {
        nonce : nonce, /*채굴 난이도*/
        gasPrice : gasPrice, // gas는 채굴자에게 지급됨
        gasLimit : gasLimit,
        value : allEth,
        from : EOA1,
        to : EOA2
    }
    // 개인키 16진수로 변경
    var privateKey = new Buffer.from(EOA1_PRIVATE_KEY, "hex");

    var tx = new Tx(rawTx); // Tx객체 생성
    tx.sign(privateKey); // 개인키로 서명, 보낼 때는 서명 필요

    let serializedTx = tx.serialize();

    w3.eth.sendSignedTransaction("0x"+serializedTx.toString("hex"),
    (err, txHash)=>{
        if(!err){
            console.log(txHash);
            w3.eth.getBalance(EOA1, (err, balanceOfEOA1) => {
              console.log("EOA1 balance : ", balanceOfEOA1) ;
            });
            w3.eth.getBalance(EOA2, (err, balanceOfEOA2) => {
              console.log("EOA2 balance : ", balanceOfEOA2) ;
            });
          }
          else{
            console.err(err);
          }
      });
    
    });
    
    
    module.exports = router;
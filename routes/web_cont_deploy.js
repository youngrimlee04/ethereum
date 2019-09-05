var express = require('express');
var router = express.Router();

//npm install web3 --save   <= rpc서버 접속
var Web3 = require('web3');

//npm install solc --save   <= 솔리디티 코드 컴파일
const solc = require('solc');

const path = require('path'); //파일 경로 설정
const fs = require('fs');     //파일의 내용 읽기

const CONTRACT_FILE = "helloworld.sol";
const filepath = path.join(__dirname, '../sol', CONTRACT_FILE);
console.log(filepath);
const content = fs.readFileSync(filepath, 'UTF-8').toString();

var input = {
  language : 'Solidity',
  sources:{
    [CONTRACT_FILE]:{
      content :  content
    }
  },
  settings:{
    outputSelection:{
      '*':{
        '*':['*']
      }
    }
  }
}

var complied = solc.compile(JSON.stringify(input));
var output = JSON.parse(complied);

var abi = output.contracts[CONTRACT_FILE]['helloworld'].abi;
var bytecode = output.contracts[CONTRACT_FILE]['helloworld'].evm.bytecode.object;
  
var w3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var contract = new w3.eth.Contract(abi);

contract.deploy({
  data:'0x' + bytecode,
  arguments : ['constructor hello world']
}).send({
  from : '0xc32cc5019ef11448567aab00fc48348b12d56ade',
  gas :  1500000,
  gasPrice : '3000000000'
}, function(err, txHash){
  console.log(txHash);
}).on('receipt', function(receipt){
  console.log('CA : ', receipt.contractAddress);

  var ABI =  abi;
  var CA = receipt.contractAddress;

  get_contract = new w3.eth.Contract(ABI, CA);

  get_contract.methods.getString().call().then(data => {
    console.log('getString : ', data);
  });
});

module.exports = router;
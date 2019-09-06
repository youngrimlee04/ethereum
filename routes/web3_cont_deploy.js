var express = require('express');
var router = express.Router();

//npm install web3 --save   <= rpc서버 접속
var Web3 = require('web3');

//npm install solc --save   <= 솔리디티 코드 컴파일
const solc = require('solc'); 
const path = require('path'); //파일 경로 설정
const fs = require('fs');     //파일의 내용 읽기
var MongoClient = require("mongodb").MongoClient;
const CONTRACT_FILE = "customer.sol"; // Solidty 파일명(배포하는 계약서 Form)
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


var abi = output.contracts[CONTRACT_FILE]['customer'].abi; // customer.sol
var bytecode = output.contracts[CONTRACT_FILE]['customer'].evm.bytecode.object; // customer.sol
  
var w3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var contract = new w3.eth.Contract(abi);

contract.deploy({
  data:'0x' + bytecode,
  arguments : ['constructor hello world','67576567567',36] // customer.sol에서 작성한 id, name, age에 테스트로 찍어볼 값
}).send({
  from : '0x5185b1fC17F87ac549ff4AFD6855F44306cfea6E', // 관리자가 가나슈 Account 중 선택 나는 0번이 관리자, 나머지 고객
  gas :  1500000,
  gasPrice : '3000000000'
}, function(err, txHash){
  console.log(txHash);
}).on('receipt', function(receipt){
  

  var ABI =  abi;
  var CA = receipt.contractAddress;

  console.log('CA : ',CA);
  console.log('ABI: ',ABI);

  var arr = {ABI : ABI, CA:CA}

  MongoClient.connect('mongodb://localhost:27017/item', function (err, dbconn) {
      if (err) {
        console('err', err)
  
      } else {
        var collection = dbconn.db("item").collection('abi');
        collection.insertOne(arr).then(function (err) { //DB에 ABI와 CA 넣기
          console.log('insert ABI, CA ok')
        });
      }
  })


  get_contract = new w3.eth.Contract(ABI, CA);

  get_contract.methods.getName().call().then(data => {
    console.log('getName : ', data);
  });
});

module.exports = router;
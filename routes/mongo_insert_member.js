// 과제
// 파일명 : mongo_insert_member.js
// url localhost:3000/member/insert
// 항목 : 아이디, 암호, 이름, 주소, 나이
// db명 : i t e m   
// collection : member 
// 5명의 회원 추가 

var express = require('express');
var router = express.Router();

var Web3 = require('web3');

// npm install mongodb --save
var MongoClient = require("mongodb").MongoClient;

var w3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));


// 127.0.0.1:3000/member/insert
router.get('/insert', function(req, res, next) {
    MongoClient.connect('mongodb://localhost:27017/item', function(err, dbconn){
        if(err) {
          console.log('error', err);
        }
        else{
          var collection = dbconn.db("item").collection('abi');
          
          //
          collection.find({}).toArray(function (err, docs) {
            
            console.log(docs[0].CA)
            console.log(docs[0].ABI)
            var ABI = docs[0].ABI
            var CA = docs[0].CA

            // web3_cont_deploy에서 가져와서 찍어보기
            var get_contract = new w3.eth.Contract(ABI, CA);

            get_contract.methods.getName().call().then(data => {
                console.log('getName : ', data);
            });

            res.render("member", {CA:CA}); // CA값 찍어보기 
          });
        }
    });

    
});


router.post('/insert', function(req, res, next) {
    var arr = {"id":req.body.n1, "pw":req.body.n2, "name":req.body.n3, "address":req.body.n4, "age":req.body.n5};
    console.log(arr);

    MongoClient.connect('mongodb://localhost:27017/item', function(err, dbconn){
        if(err) {
            console.log('error', err);
            res.redirect("/member/insert");
        }
        else{
            var collection = dbconn.db("item").collection('member');
            collection.insertOne(arr).then(function(result){
                console.log(result);
                res.redirect("/member/insert");
            })
        }
    });
    
})

module.exports = router;

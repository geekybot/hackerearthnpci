let express = require('express'),
    router = express.Router();
let helper = require("../utils/helper");



var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var db;
var datab;
MongoClient.connect(url, function (err, dbo) {
    if (err) throw err;
    db = dbo.db("npcibank");
});


const Web3 = require('web3');
const web3 = new Web3("http://localhost:8545");
let abi = [{ "constant": false, "inputs": [{ "name": "user", "type": "address" }, { "name": "balance", "type": "uint256" }], "name": "userrOnboardBank", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "user", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "addToBank", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "lengthOfBanks", "outputs": [{ "name": "l", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "lengthOfCustomers", "outputs": [{ "name": "l", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "banks", "outputs": [{ "name": "bank", "type": "address" }, { "name": "vault", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "bank", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "withdrawtoBank", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "reciever", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "bankList", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "bankAddress", "type": "address" }], "name": "createBank", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "user", "type": "address" }], "name": "createUser", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "banktoUsers", "outputs": [{ "name": "bankAddress", "type": "address" }, { "name": "user", "type": "address" }, { "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "bankAddress", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "topUp", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "userWallet", "outputs": [{ "name": "user", "type": "address" }, { "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "customerList", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }];
let conaddress = "0xe02f751e766660b14c010bd353e9f27424ae64df";
let npcicontract = new web3.eth.Contract(abi, conaddress);

// console.log(npcicontract);

// npcicontract.

function getErrorMessage(field) {
    var response = {
        success: false,
        message: field + ' field is missing or Invalid in the request'
    };
    return response;
}

router.post('/registeruser', (req, res) => {
    let mobileno = req.body.mobileNo;
    let password = req.body.password;
    let name = req.body.name;
    let privKey = password + helper.generateRandomNumber(10000, 999999);
    web3.eth.personal.newAccount(privKey).then((accountadd) => {
        let dbObj = {
            mobileno: mobileno,
            password: password,
            name: name,
            ethAddress: accountadd,
            role: "user"
        }
        db.collection("users").insertOne(dbObj, (err, result) => {
            if (!err) {
                npcicontract.methods.createUser(accountadd).send({ from: "0x254a1a86f2eba975b256798366260d1182f793ed", gas: 100000 }).on('transactionHash', (hash) => {
                    res.status(200).send({ status: "success", txhash: hash, message: "User reggistered successfully" });
                }).on("error", () => {
                    res.status(503).send({ status: "failed", message: "Couldn't register user" })
                })
                web3.eth.sendTransaction({from:"0x254a1a86f2eba975b256798366260d1182f793ed",to:accountadd, value:web3.toWei(5, "ether")});
            }
            else {
                res.status(503).send({ status: "failed", message: "Couldn't register user, internal error" })
            }
        });
    })
});

router.post('/registerbank', (req, res) => {
    let mobileno = req.body.mobileNo;
    let password = req.body.password;
    let name = req.body.name;
    let privKey = password + helper.generateRandomNumber(10000, 999999);
    web3.eth.personal.newAccount(privKey).then((accountadd) => {
        let dbObj = {
            mobileno: mobileno,
            password: password,
            name: name,
            ethAddress: accountadd,
            role: "bank",
            privPass: privKey
        }
        db.collection("users").insertOne(dbObj, (err, result) => {
            if (!err) {
                npcicontract.methods.createBank(accountadd).send({ from: "0x254a1a86f2eba975b256798366260d1182f793ed", gas: 100000 }).on('transactionHash', (hash) => {
                    res.status(200).send({ status: "success", txhash: hash, message: "User reggistered successfully" });
                }).on("error", () => {
                    res.status(503).send({ status: "failed", message: "Couldn't register user" })
                })
                web3.eth.sendTransaction({from:"0x254a1a86f2eba975b256798366260d1182f793ed",to:accountadd, value:web3.toWei(5, "ether")});
            }
            else {
                res.status(503).send({ status: "failed", message: "Couldn't register user, internal error" })
            }
        });
    })
});


router.post('/login', async (req, res) => {
    var mobileNo = req.body.mobileNo;
    var password = req.body.password;

    if (!mobileNo) {
        res.json(getErrorMessage('\'mobileNo\''));
        return;
    }
    if (!password) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }
    let check = await db.collection('users').findOne({ "monileno": mobileNo });
    console.log(check);

    if (!check) {
        res.status(401).send({
            Messagge: "User is not registered"
        });
        return;
    }
    if (!(password == check.password)) {
        res.status(401).send({
            Messagge: "Invalid Password"
        });
        return;
    }
    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 604800,
        mobileNo: check.mobileno,
        ethAddress: check.ethAddress,
        name: check.name,
        role: check.role,
        privPass: check.privPass
    }, "thisismysecret");

    res.status(200).send({
        status: "success",
        token: token,
    });
    return;
});



router.put('/changepassword', async (req, res) => {
    var userid = req.id;
    var password = req.body.newPassword;
    if (!password) {
        res.json(getErrorMessage('\'password\''));
        return;
    }
    db.collection('users').updateOne({ userid: userid }
        , { $set: { password: password } }, function (err, result) {
            if (!err) {
                res.send({ "success": true });
                return;
            }
            return ({ success: false });
        });
});


module.exports = router;
let express = require('express'),
    router = express.Router();
var async = require("async");

const Web3 = require('web3');
const web3 = new Web3("http://localhost:8545");
let abi = [{ "constant": false, "inputs": [{ "name": "user", "type": "address" }, { "name": "balance", "type": "uint256" }], "name": "userrOnboardBank", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "user", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "addToBank", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "lengthOfBanks", "outputs": [{ "name": "l", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "lengthOfCustomers", "outputs": [{ "name": "l", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "banks", "outputs": [{ "name": "bank", "type": "address" }, { "name": "vault", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "bank", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "withdrawtoBank", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "reciever", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "bankList", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "bankAddress", "type": "address" }], "name": "createBank", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "user", "type": "address" }], "name": "createUser", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "banktoUsers", "outputs": [{ "name": "bankAddress", "type": "address" }, { "name": "user", "type": "address" }, { "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "bankAddress", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "topUp", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "userWallet", "outputs": [{ "name": "user", "type": "address" }, { "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }], "name": "customerList", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }];
let conaddress = "0xe02f751e766660b14c010bd353e9f27424ae64df";
let npcicontract = new web3.eth.Contract(abi, conaddress);


function getErrorMessage(field) {
    var response = {
        success: false,
        message: field + ' field is missing or Invalid in the request'
    };
    return response;
}

router.post('/useronbaord', async (req, res) => {
    var userAddress = req.body.userAddress;
    var balance = req.body.balance;
    web3.eth.personal.unlockAccount(req.ethAddress, req.privPass, 100, (err, res) => {
        npcicontract.methods.userrOnboardBank(userAddress, parseInt(balance)).send({ from: req.ethAddress, gas: 300000 }).on('transactionHash', (hash) => {
            res.status(200).send({ status: "success", txhash: hash, message: "User reggistered successfully" });
        }).on("error", () => {
            res.status(503).send({ status: "failed", message: "Couldn't register user" })
        })

    })
});

router.post('/addtobankaccount', async (req, res) => {
    let userAddress = req.body.userAddress;
    var balance = req.body.balance;
    web3.eth.personal.unlockAccount(req.ethAddress, req.privPass, 100, (err, res) => {
        npcicontract.methods.addToBank(userAddress, parseInt(balance)).send({ from: req.ethAddress, gas: 300000 }).on('transactionHash', (hash) => {
            res.status(200).send({ status: "success", txhash: hash, message: "User reggistered successfully" });
        }).on("error", () => {
            res.status(503).send({ status: "failed", message: "Couldn't register user" })
        })

    })
});

router.post('/wallettopup', async (req, res) => {
    let bankAddress = req.body.bankAddress;
    var balance = req.body.balance;
    web3.eth.personal.unlockAccount(req.ethAddress, req.privPass, 100, (err, res) => {
        npcicontract.methods.topUp(bankAddress, parseInt(balance)).send({ from: req.ethAddress, gas: 300000 }).on('transactionHash', (hash) => {
            res.status(200).send({ status: "success", txhash: hash, message: "User reggistered successfully" });
        }).on("error", () => {
            res.status(503).send({ status: "failed", message: "Couldn't register user" })
        })

    })
});


router.post('/transfer', async (req, res) => {
    let receiver = req.body.receiver;
    var balance = req.body.balance;
    web3.eth.personal.unlockAccount(req.ethAddress, req.privPass, 100, (err, res) => {
        npcicontract.methods.transfer(receiver, parseInt(balance)).send({ from: req.ethAddress, gas: 300000 }).on('transactionHash', (hash) => {
            res.status(200).send({ status: "success", txhash: hash, message: "User reggistered successfully" });
        }).on("error", () => {
            res.status(503).send({ status: "failed", message: "Couldn't register user" })
        })

    })
});

router.post('/transfertobank', async (req, res) => {
    let bankAddress = req.body.bankAddress;
    var balance = req.body.balance;
    web3.eth.personal.unlockAccount(req.ethAddress, req.privPass, 100, (err, res) => {
        npcicontract.methods.withdrawtoBank(bankAddress, parseInt(balance)).send({ from: req.ethAddress, gas: 300000 }).on('transactionHash', (hash) => {
            res.status(200).send({ status: "success", txhash: hash, message: "User reggistered successfully" });
        }).on("error", () => {
            res.status(503).send({ status: "failed", message: "Couldn't register user" })
        })

    })
});


// npcicontract.methods.withdrawtoBank(bankAddress, parseInt(balance)).call({ from: req.ethAddress, gas: 300000 }, (error, result)=>{
//     if(err){
//         res.status(503).send({ status: "failed", message: "Couldn't register user" });
//     }
//     else{

//     }
// })

router.get('/bankusers', (req, res) => {
    web3.eth.personal.unlockAccount(req.ethAddress, req.privPass, 100, (err, res) => {
        async.waterfall([
            function (callback) {
                npcicontract.methods.lengthOfCustomers().call({ from: req.ethAddress, gas: 300000 }, (error, result) => {
                    if (err) {
                        res.status(503).send({ status: "failed", message: "Couldn't retrieve user" });
                        return;
                    }
                    else {
                        callback(null, parseInt(result));
                    }
                })
            },
            function (arg1, callback) {
                let arr = [];
                for (let count = 0; count < arg1; count++) {
                    npcicontract.methods.customerList(count).call({ from: req.ethAddress, gas: 300000 }, (error, result) => {
                        if (err) {
                            res.status(503).send({ status: "failed", message: "Couldn't retrieve user" });
                            return;
                        }
                        else {
                            arr.push(result);
                        }
                    })
                    if(arr.length == count){
                        callback(null, arr);
                    }
                }
            },
            function (arg1, callback) {
                let users = [];
                arg1.forEach(element => {
                    npcicontract.methods.userWallet(element).call({ from: req.ethAddress, gas: 300000 }, (error, result) => {
                        if (err) {
                            res.status(503).send({ status: "failed", message: "Couldn't retrieve user" });
                            return;
                        }
                        else {
                            users.push({
                                ethaddress: result[0],
                                balance: result[1]
                            });
                        }
                    })
                    if(arr.length == count){
                        callback(null, arr);
                    }
                });
                // callback(null, 'done');
            }
        ], function (err, result) {
            res.status(200).send({status: "success", users: result});
            // result now equals 'done'    
        });
    })
});

module.exports = router;
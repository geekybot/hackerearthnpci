pragma solidity ^0.5.0;

contract Wallet {
  
   struct bankUsers{
       address bankAddress;
       address user;
       uint256 balance;
   }
   
   struct wallet{
       address user;
       uint256 balance;
   }
   
   struct bank{
       address bank;
       uint256 vault;
   }
   
   address owner;
   
   mapping( address => bank ) public banks;
   mapping( address =>mapping ( address => bankUsers) ) public banktoUsers;
   mapping( address => address[]) public customerList;
//   mapping( address =>mapping ( address => bankUsers) ) public userstoBank;
   mapping( address => address[]) public bankList;
   mapping ( address => wallet ) public userWallet;
   
   
//   constructor setting owner of the smart contract
    constructor() public{
        owner = msg.sender;
    }
   
//   Creating bank body with 2000000 Rs. as initial vault balance
    function createBank(address bankAddress) public payable{
        require(msg.sender == owner);
        bank memory b = bank(bankAddress, 2000000);
        banks[bankAddress] = b;
    }
    
    function createUser(address user) public payable{
        require(msg.sender == owner);
        wallet memory w = wallet(user, 0);
        userWallet[user] = w;
    }
   
//  customer opening bank account
   function userrOnboardBank(address user,  uint256 balance) public payable{
        address bank = msg.sender;
        customerList[bank].push(user);
        bankUsers memory b = bankUsers(bank, user, balance);
        banktoUsers[bank][user] = b;
        bankList[user].push(bank);
   }
   
   
//   add money to bank account 
   function addToBank( address user, uint256 amount) public payable{
       address bankAddress = msg.sender;
       require(banks[bankAddress].vault>amount);
       banks[bankAddress].vault -= amount;
       banktoUsers[bankAddress][user].balance += amount; 
   }
   
//   topup wallet from bank
    function topUp(address bankAddress, uint256 amount) public payable{
         address user = msg.sender;
        require(banktoUsers[bankAddress][user].balance>=amount);
        banktoUsers[bankAddress][user].balance -= amount;
        userWallet[user].balance += amount;
    }   
    
    // transfer money from wallet to wallet
    function transfer( address reciever, uint256 amount) public payable{
        address sender = msg.sender;
        require(userWallet[sender].balance> amount);
        userWallet[sender].balance -= amount;
        userWallet[reciever].balance += amount;
    }
    
    
    // withdrawtoBank withdraw 
    function withdrawtoBank( address bank, uint256 amount) public payable{
        address sender = msg.sender;
        require(userWallet[sender].balance> amount);
        banktoUsers[bank][sender].balance += amount;
        userWallet[sender].balance -= amount;
    }
    function lengthOfCustomers() public view returns(uint l){
        l = customerList[msg.sender].length;
    }
    function lengthOfBanks() public view returns(uint l){
        l = bankList[msg.sender].length;
    }
}
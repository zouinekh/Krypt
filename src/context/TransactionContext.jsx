import React, { Children, useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const TransactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return TransactionContract;
};

export const TransactionProvide = ({ children }) => {
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const [CurrentAccount, setCurrentAccount] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [Transaction, setTransaction] = useState([]);
  const [transactionCount, settransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );


  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const getALLtransactions=async()=>{
    try {
      if (!ethereum) return alert("please Install metamask");

      const transactionContract = getEthereumContract(); 
      const availableTransactions=await transactionContract.getAllTransaction(); 
      
      const structredTransaction=availableTransactions.map((transaction)=>({
        addresFrom:transaction.sender,
        addressTo:transaction.reciver,
        timestamp:new Date(transaction.timestamp.toNumber()  * 1000).toLocaleString(),
        message:transaction.message,
        keyword:transaction.keyword,
        amount:parseInt(transaction.ammount._hex)/(10**18)
      }))
      console.log(structredTransaction)
      setTransaction(structredTransaction)
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionExist();
  }, []);

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("please Install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("please Install metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getALLtransactions();
      } else {
        console.log("No accounts found");
      }
      console.log(accounts);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();
      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {}
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("please Install metamask");
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: CurrentAccount,
            to: addressTo,
            gas: "0x5208", //2100 GWEI
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setisLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setisLoading(false);
      console.log(`Success - ${transactionHash.hash}`);
      const transactionCount = await transactionContract.getTransactionCount();
      settransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        CurrentAccount,
        formData,
        setformData,
        handleChange,
        sendTransaction,
        Transaction,
        isLoading
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

//context is a hook tkhalik t3adi pass ll information ll t7eb 3lih

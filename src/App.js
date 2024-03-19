import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import ABI from './Gamble_ABI';

const App = () => {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState();
  const [betAmount, setBetAmount] = useState('');
  const [gameResult, setGameResult] = useState('');
  const [showModal, setShowModal] = useState(false);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
        try {
            const web = new Web3(window.ethereum);
            setWeb3(web);
        } catch (err) {
            console.log(err);
        }
    }
  }, []);

  const startGambleHandler = async () => {
    if (!window.ethereum) return;
    // 컨트랙트 주소와 ABI를 사용하여 컨트랙트 인스턴스 생성
    const contract = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACTADDRESS);
    console.log(contract)
    
    try {
      const randomValue = (Math.random() * (0.001 - 0.0001) + 0.0001).toFixed(4);
      setBetAmount(String(randomValue));

      const transactionResponse = await contract.methods.GambleStart().send({
        from: account, // 호출자의 주소
        value: web3.utils.toWei(betAmount, 'ether')
      });
      const gambleResult = transactionResponse.events.GambleResult.returnValues.result;
      if (gambleResult) {
        setGameResult(`You win! You got ${betAmount * 2}`);
      } else {
        setGameResult('You lose..');
      }
      setShowModal(true);
    } catch (error) {
      setGameResult('Transaction was failed. Try click button again.');
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div>
        <button onClick={() => {connectWallet()}}>
          {account ? 'Connected' : 'Connect Wallet'}
        </button>
      </div>
      <div>
        <button onClick={startGambleHandler}>Start Gamble</button>
      </div>
      {showModal && (
        <div>
          <p>{gameResult}</p>
          <button onClick={closeModal}>OK</button>
        </div>
      )}
    </div>
  );
};

export default App;

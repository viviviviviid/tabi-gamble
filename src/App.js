import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import ABI from './Gamble_ABI';
import ethers from 'ethers'

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
      console.log("betAmount value", web3.utils.toWei('1', 'ether'));
      const transactionResponse = await contract.methods.GambleStart().send({
        from: account, // 호출자의 주소
        value: web3.utils.toWei(betAmount, 'ether')
    });
      const gambleResult = transactionResponse.events.GambleResult.returnValues.result;
      if (gambleResult) {
        alert(`You win! You got ${betAmount * 2}`);
      } else {
        alert('You lose..');
      }
      setShowModal(true);
    } catch (error) {
      alert('Transaction was failed. Try click button again.');
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={() => {connectWallet()}}>
        {account ? 'Connected' : 'Connect Wallet'}
      </button>

      <input
        type="text"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        placeholder="Bet amount in ETH"
      />

      <button onClick={startGambleHandler}>Start Gamble</button>

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

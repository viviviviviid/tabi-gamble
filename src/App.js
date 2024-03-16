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
    
    try {
      // web3.utils.toWei('1', 'ether');
      // const transactionResponse = await contract.gambleStart({ value: ethers.utils.parseEther(betAmount) });
      // 가정: 트랜잭션이 성공하고, 이벤트 로그로부터 결과를 얻어옴
      // 여기서는 임의의 결과를 생성함
      const mockResult = Math.random() < 0.5;
      if (mockResult) {
        setGameResult(`You win! You got ${betAmount * 2}`); // 승리 로직
      } else {
        setGameResult('You lose..'); // 패배 로직
      }
      setShowModal(true);
    } catch (error) {
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

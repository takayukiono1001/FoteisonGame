import axios from "axios";
import { useEffect, useState } from "react";

const ProfileScreen = ({ _ENS, _setENS, _currentAccount, _currentSquare, _setCurrentSquare, _currentBalance, _setCurrentBalance, _currentQuestStatus, _setCurrentQuestStatus, _FoteisonGameContract }) => {

    const [transactionHash, setTransactionHash] = useState('');
    const [showInput, setShowInput] = useState(false);

    const getUserENS = async () => {
      try {
       
        const response = await axios.get("http://localhost:8080/UserENS", {
          params: {
            address: _currentAccount,
          },
        });

        if (response.data.name) {
          _setENS(response.data.name);
        }

      } catch (e) {
        console.log(e);
      }
    };

    const renewInfo = async () => {
      const user = await _FoteisonGameContract.confirmUser();
      
      // if user[0] is false, it means that the user is not registered yet. Use default values that are set in the frontend/src/App.js.
      // if default values are set in the frontend/src/App.js, the user must register using the contract function wth gas fee before playing the game.
      if(user[0] === true) {
        _setCurrentSquare(parseInt(user[1]));
        _setCurrentBalance(parseInt(user[2]));
        _setCurrentQuestStatus(user[3]);
      }
    }


    const verifyTxn = async ( _transactionHash ) => {
      try {
        const response = await axios.get("http://localhost:8080/confirmTransaction", {
          params: {
            transactionHash: _transactionHash
      },
      });
      
      if (response.data) {
        console.log("Verified. You can roll the dice!");
        _setCurrentQuestStatus(true);
      }else{
        console.log("Not verified. You can't roll the dice!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleShowInput = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setTransactionHash(e.target.value);
  };

  const handleInputSubmit = async () => {
    await verifyTxn(transactionHash);
    setShowInput(false);
  };
    
    useEffect(() => {
      renewInfo();
      getUserENS();
    }, []);

    const gridSize = 50;
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);
    const x = _currentSquare %  gridSize - centerX;
    const y = Math.floor( _currentSquare / gridSize) - centerY;
  
    return (
      <>
        <div className="profile-name">
          {_ENS ? _ENS : _currentAccount}
        </div>
        <div className="profile-eachInformaton">
          <p>Coordinates: {x}, {y}</p>
          <p>Crypulu: {_currentBalance}</p>
          <p>Quest: {_currentQuestStatus ? "no quest" : "do quest"}</p>
          <button onClick={renewInfo}>Renew Info</button>
        <button className="verify-button" onClick={handleShowInput}>
          Verify Transaction
        </button>
        {showInput && (
          <div>
            <input type="text" value={transactionHash} onChange={handleInputChange} />
            <button onClick={handleInputSubmit}>OK</button>
          </div>
        )}

        </div>
      </>
    );
  };
  
export default ProfileScreen;
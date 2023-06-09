import React, { useState } from 'react';

const DiceRoll = ( {_currentAccount, _FoteisonGameContract, _squares, _currentSquare, _currentBalance, _currentQuestStatus, _setShowDiceRoll, _setCurrentSquare, _setCurrentBalance, _setCurrentQuestStatus} ) => {
  const [rolling, setRolling] = useState(false);

  const rollDice = async () => {

    if (rolling) return;
    setRolling(true);
  
    setTimeout(async () => {
        try {
          const value = Math.floor(Math.random() * 6) + 1;
          setRolling(false);
          alert(`Dice Value: ${value}`);
    
          const squareIds = await _FoteisonGameContract.moveUser(value, _currentSquare);
          // if square array is empty, console.log("There is no square connected to this square")
          let coords = [];  // to store coordinates
          if (squareIds.length === 0) {
            alert("There is no square connected to this square");
          } else {
            for (let i = 0; i < squareIds.length; i++) {
              let targetId = parseInt(squareIds[i]);
              console.log(`there is id: ${targetId}`);
              let targetSquare = _squares.find(square => square.id === targetId);
              if (!targetSquare) {
                console.log(`No square with id: ${targetId}`);
              } else {
                console.log(targetSquare.x, targetSquare.y);
                coords.push(`(${targetSquare.x}, ${targetSquare.y})`);  // add coordinates to the array
              }
            }
          }

          // not set currentSquare,  this is temporary
          const squareId = parseInt(squareIds[squareIds.length - 1]);
          // Id：squareId
          console.log(`ID：${squareId}`);

          const updateUserInfo = async () => {
            try {
              const user = await _FoteisonGameContract.updateUser(squareId, _currentBalance, _currentQuestStatus);
              return user;
            } catch (error) {
              // console.error(`Error during updateUser: ${error}`);
              alert("Insufficient Balance to move to next square");
            }
          }
      
          const userUpdated = await updateUserInfo();
      
          // // If the updateUser transaction was successful, userUpdated will be truthy. 
          // // If it was not successful (due to InsufficientBalance event being emitted, for example), it will be falsy.
          // if (!userUpdated) {
          //   alert('Insufficient Balance to move to next square');
          //   _setShowDiceRoll(false);
          //   return;
          // }
          
          if (coords.length > 0) {  // if there are coordinates
            alert(`Coordinates: ${coords.join(" -> ")}`);  // join and alert the coordinates
            _setShowDiceRoll(false);
            setRolling(false);
          }
        } catch (error) {
          console.log(`Error: ${error}`);
        }
        }, 2000);
    };
    
  return (
    <div className='dice-roll'>
      <div className={`dice ${rolling ? 'rolling' : ''}`} onClick={rollDice}>
        <div className="side front">
          <div className="dot dot-center" />
        </div>
        <div className="side back">
          <div className="dot dot-center" />
          <div className="dot dot-top-left" />
          <div className="dot dot-bottom-right" />
        </div>
        <div className="side right">
          <div className="dot dot-top-left" />
          <div className="dot dot-bottom-right" />
          <div className="dot dot-top-right" />
          <div className="dot dot-bottom-left" />
        </div>
        <div className="side left">
          <div className="dot dot-top-left" />
          <div className="dot dot-bottom-right" />
          <div className="dot dot-top-right" />
          <div className="dot dot-bottom-left" />
        </div>
        <div className="side top">
          <div className="dot dot-center" />
          <div className="dot dot-top-left" />
          <div className="dot dot-top-right" />
          <div className="dot dot-bottom-left" />
          <div className="dot dot-bottom-right" />
        </div>
        <div className="side bottom">
          <div className="dot dot-center" />
          <div className="dot dot-top-left" />
          <div className="dot dot-top-right" />
          <div className="dot dot-bottom-left" />
          <div className="dot dot-bottom-right" />
        </div>
      </div>
      <button className="roll-button" onClick={rollDice} disabled={rolling}>
        GO
      </button>
    </div>
  );
};

export default DiceRoll;

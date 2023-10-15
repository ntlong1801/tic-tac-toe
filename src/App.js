
import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className={`square ${isWinningSquare ? 'highlight' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner && winner !== 'draw') {
    status = `Winner: ${winner[0]}`;
  } else if (winner) {
    status = 'Draw! The game is a tie.';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const renderSquares = () => {
    const boardSize = 3; 
    const squareElements = [];

    for (let row = 0; row < boardSize; row++) {
      const rowSquares = [];
      for (let col = 0; col < boardSize; col++) {
        const squareIndex = row * boardSize + col;
        const isWinningSquare = winner && winner.includes(squareIndex);
        rowSquares.push(
          <Square
            key={squareIndex}
            value={squares[squareIndex]}
            onSquareClick={() => handleClick(squareIndex)}
            isWinningSquare={isWinningSquare}
          />
        );
      }
      squareElements.push(
        <div key={row} className="board-row">
          {rowSquares}
        </div>
      );
    }

    return squareElements;
  };

  return (
    <>
      <div className="status">{status}</div>
      {renderSquares()}
    </>
  );
}



export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  function CurrentMove({ currentMove }) {
    return <div>You are at move #{currentMove}</div>;
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const [prevRow, prevCol] = calculateLocation(history[move - 1], squares);
      description = `Go to move #${move} (${prevRow}, ${prevCol})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  function toggleSortOrder() {
    setAscending(!ascending);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <CurrentMove currentMove={currentMove} />
        <button onClick={toggleSortOrder}>Toggle Sort</button>
        <ol>{ascending ? moves : moves.slice().reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }
  for (let i = 0; i < squares.length; i += 1) {
    if (squares[i] === null) return null;
  }
  return 'draw';
}

function calculateLocation(prevSquares, currentSquares) {
  for (let i = 0; i < prevSquares.length; i++) {
    if (prevSquares[i] !== currentSquares[i]) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return [row, col];
    }
  }
  return [null, null];
}


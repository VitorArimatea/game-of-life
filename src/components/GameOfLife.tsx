import React, { useState, useEffect, useRef } from "react";

const GRID_SIZE = 10;
const CELL_SIZE = 30;

const GameOfLife: React.FC = () => {
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [running, setRunning] = useState<boolean>(false);

  const runningRef = useRef<boolean>(running);
  runningRef.current = running;

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid: boolean[][] = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => false)
    );
    setGrid(newGrid);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!runningRef.current) {
      const newGrid = grid.map((row) => [...row]);
      newGrid[row][col] = !newGrid[row][col];
      setGrid(newGrid);
    }
  };

  const handleStart = () => {
    if (!running) {
      setRunning(true);
    }
  };

  const handleStop = () => {
    setRunning(false);
  };

  const handleClear = () => {
    setRunning(false);
    initializeGrid();
  };

  const countNeighbors = (row: number, col: number) => {
    let count = 0;
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (
        newRow >= 0 && newRow < GRID_SIZE &&
        newCol >= 0 && newCol < GRID_SIZE &&
        grid[newRow][newCol]
      ) {
        count++;
      }
    }

    return count;
  };

  useEffect(() => {
    if (running) {
      const intervalId = setInterval(() => {
        const newGrid = grid.map((row) => [...row]);
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            const neighbors = countNeighbors(row, col);
            if (grid[row][col]) {
              newGrid[row][col] = neighbors === 2 || neighbors === 3;
            } else {
              newGrid[row][col] = neighbors === 3;
            }
          }
        }
        setGrid(newGrid);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [running, grid]);

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: grid[rowIndex][colIndex] ? "lightblue" : "white",
                border: "1px solid black",
              }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      <div>
        {!running ? (
          <button onClick={handleStart}>Iniciar</button>
        ) : (
          <button onClick={handleStop}>Parar</button>
        )}
        <button onClick={handleClear}>Limpar</button>
      </div>
    </div>
  );
};

export default GameOfLife;

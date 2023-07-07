function generateCellGrid(rows, columns, random) {
  let cellGrid = [];
  let counter = 0;
  let newCell = 0;

  while (counter < rows * columns) {
    newCell = random ? Math.floor(Math.random() * 2) : 0;
    cellGrid.push(newCell);
    counter++;
  }
  return cellGrid;
}


function getNeighbourIndexes() {
  let arr = [];
  let tempArr = [];
  let index = 0;

  for (let x = 0; x < cells.length; x++) {
    tempArr = [
      x - columns - 1,
      x - columns,
      x - columns + 1,
      x - 1,
      x + 1,
      x + columns - 1,
      x + columns,
      x + columns + 1
    ];

    for (i in tempArr) {
      index = tempArr[i];

      if (tempArr[i] < 0) {
        index = (length + 1) + tempArr[i];
        tempArr[i] = index;
      }

      if (tempArr[i] >= length) {
        index = tempArr[i] - length;
        tempArr[i] = index;
      }
    }
    arr.push(tempArr);
  }
  return arr;
}


function drawCellGrid(cellSize, columns) {
  let y = -1;
  let cellX = 0;
  let cellY = 0;

  for (let x = 0; x < cells.length; x++) {
    // Move to the next row
    if (x % columns === 0) {
      y++;
      cellY = y * cellSize;
    }
    cellX = (x % columns) * cellSize;

    context.fillStyle = cells[x] ? "black" : "white";
    context.fillRect(cellX, cellY, cellX + cellSize, cellY + cellSize);
  }
}


function toggleCell(e) {
  const mouseX = Math.floor(e.clientX / cellSize)
  const mouseY = Math.floor(e.clientY / cellSize)
  const index = mouseX + columns * mouseY;

  // console.log(mouseY, mouseX, index);

  cells[index] = Math.abs(cells[index] - 1);
  drawCellGrid(cellSize, columns);
}


function simulate() {
  const length = cells.length;
  let newCellGrid = [];
  let neighbours = 0;
  let newCell = 0;

  for (let x = 0; x < length; x++) {
    newCell = cells[x];

    for (i of neighbourIndexes[x]) {
      if (cells[i]) {
        neighbours++;
      }
    }

    if (newCell) {
      if (neighbours < 2 || neighbours > 3) {
        newCell = 0;
      }
    } else {
      if (neighbours === 3) {
        newCell = 1;
      }
    }
    neighbours = 0;

    newCellGrid.push(newCell);
  }

  cells = newCellGrid;
  generations++;
  generationsOutput.innerText = generations;

  drawCellGrid(cellSize, columns);
}


function startSimulation() {
  interval = setInterval(simulate, 1000 * 0.06);
}


function stopSimulation() {
  clearInterval(interval);
}


function handleKeyDown(e) {
  if (e.key === "Enter") {
    play = !play;

    if (play) {
      startSimulation();
      document.querySelector("#body").classList.toggle("on");
    } else {
      stopSimulation();
      document.querySelector("#body").classList.toggle("on");
    }
  }

  if (e.key === "Backspace") {
    cells = generateCellGrid(columns, rows, true);
    drawCellGrid(cellSize, columns);
  }

  if (e.key === "0") {
    generations = 0;
    generationsOutput.innerText = generations;
    cells = generateCellGrid(columns, rows, false);
    drawCellGrid(cellSize, columns);
  }
}


const canvas = document.querySelector("#canvas");
const generationsOutput = document.querySelector("#generations");
const context = canvas.getContext("2d");
const cellSize = 10;
const columns = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);

let play = false;
let generations = 0;
let interval;
let cells = generateCellGrid(columns, rows, false);
let neighbourIndexes = getNeighbourIndexes();

drawCellGrid(cellSize, columns);

document.addEventListener("click", e => toggleCell(e));
document.addEventListener("keydown", e => handleKeyDown(e));
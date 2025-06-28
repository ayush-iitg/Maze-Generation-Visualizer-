let form = document.querySelector("#settings");
let size = document.querySelector("#size");
let rowsCols = document.querySelector("#number");
let complete = document.querySelector(".complete");
let replay = document.querySelector(".replay");
let close = document.querySelector(".close");

let newMaze;

form.Backtracking.addEventListener("click", generateMazeBacktracking);
form.RecursiveDivision.addEventListener("click", generateMazeRecursiveDivision);
form.Kruskals.addEventListener("click", generateMazeKruskals);
form.BinaryTree.addEventListener("click", generateMazeBt);
form.Prims.addEventListener("click", generateMazePrims);
form.AldousBroder.addEventListener("click", generateMazeAldous);
form.Sidewinder.addEventListener("click", generateMazeSidewinder);


document.addEventListener("keydown", move);

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('replay').addEventListener('click', () => {
        console.log('replayed');
        location.reload();
    });

    document.getElementById('close').addEventListener('click', () => {
        console.log('closed');
        document.getElementById('complete').style.display = 'none';
    });
});

function generateMazeBacktracking(e) {
    e.preventDefault();
  
    if (rowsCols.value == "" || size.value == "") {
      return alert("Please enter all fields");
    }
  
    let mazeSize = size.value;
    let number = rowsCols.value;
    if (mazeSize > 600 || number > 50) {
      alert("Maze too large!");
      return;
    }
  
    form.style.display = "none";
  
    newMaze = new Maze(mazeSize, number, number);
    newMaze.setup();
    newMaze.drawBacktracking();
  }

  function generateMazeRecursiveDivision(e) {
    e.preventDefault();
  
    if (rowsCols.value == "" || size.value == "") {
      return alert("Please enter all fields");
    }
  
    let mazeSize = size.value;
    let number = rowsCols.value;
    if (mazeSize > 600 || number > 50) {
      alert("Maze too large!");
      return;
    }
  
    form.style.display = "none";
  
    newMaze = new Maze(mazeSize, number, number);
    newMaze.setup();
    newMaze.drawRecursiveDivision();
  }

  function generateMazeKruskals(e) {
    e.preventDefault();
  
    if (rowsCols.value == "" || size.value == "") {
      return alert("Please enter all fields");
    }
  
    let mazeSize = size.value;
    let number = rowsCols.value;
    if (mazeSize > 600 || number > 50) {
      alert("Maze too large!");
      return;
    }
  
    form.style.display = "none";
  
    newMaze = new Maze(mazeSize, number, number);
    newMaze.setup();
    newMaze.drawKruskals();
  }

  function generateMazeBt(e) {
    e.preventDefault();
  
    if (rowsCols.value == "" || size.value == "") {
      return alert("Please enter all fields");
    }
  
    let mazeSize = size.value;
    let number = rowsCols.value;
    if (mazeSize > 600 || number > 50) {
      alert("Maze too large!");
      return;
    }


form.style.display = "none";

newMaze = new Maze(mazeSize, number, number);
newMaze.setup();
newMaze.drawBinaryTree();
}


  function generateMazePrims(e) {
    e.preventDefault();
  
    if (rowsCols.value == "" || size.value == "") {
      return alert("Please enter all fields");
    }
  
    let mazeSize = size.value;
    let number = rowsCols.value;
    if (mazeSize > 600 || number > 50) {
      alert("Maze too large!");
      return;
    }
  
    form.style.display = "none";
  
    newMaze = new Maze(mazeSize, number, number);
    newMaze.setup();
    newMaze.drawPrims();
  }


  function generateMazeAldous(e) {
    e.preventDefault();
  
    if (rowsCols.value == "" || size.value == "") {
      return alert("Please enter all fields");
    }
  
    let mazeSize = size.value;
    let number = rowsCols.value;
    if (mazeSize > 600 || number > 50) {
      alert("Maze too large!");
      return;
    }
  
    form.style.display = "none";
  
    newMaze = new Maze(mazeSize, number, number);
    newMaze.setup();
    newMaze.drawAldous();
  }

  function generateMazeSidewinder(e) {
    e.preventDefault();
  
    if (rowsCols.value == "" || size.value == "") {
      return alert("Please enter all fields");
    }
  
    let mazeSize = size.value;
    let number = rowsCols.value;
    if (mazeSize > 600 || number > 50) {
      alert("Maze too large!");
      return;
    }
  
    form.style.display = "none";
  
    newMaze = new Maze(mazeSize, number, number);
    newMaze.setup();
    newMaze.drawSidewinderer();
  }


function move(e) {
  if (!generationComplete) return;
  let key = e.key;
  let row = current.rowNum;
  let col = current.colNum;

  switch (key) {
    case "ArrowUp":
      if (!current.walls.topWall) {
        let next = newMaze.grid[row - 1][col];
        current = next;
        newMaze.draw();
        current.highlight(newMaze.columns);
        // not required if goal is in bottom right
        if (current.goal) complete.style.display = "block";
      }
      break;

    case "ArrowRight":
      if (!current.walls.rightWall) {
        let next = newMaze.grid[row][col + 1];
        current = next;
        newMaze.draw();
        current.highlight(newMaze.columns);
        if (current.goal) complete.style.display = "block";
      }
      break;

    case "ArrowDown":
      if (!current.walls.bottomWall) {
        let next = newMaze.grid[row + 1][col];
        current = next;
        newMaze.draw();
        current.highlight(newMaze.columns);
        if (current.goal) complete.style.display = "block";
      }
      break;

    case "ArrowLeft":
      if (!current.walls.leftWall) {
        let next = newMaze.grid[row][col - 1];
        current = next;
        newMaze.draw();
        current.highlight(newMaze.columns);
        // not required if goal is in bottom right
        if (current.goal) complete.style.display = "block";
      }
      break;
  }
}
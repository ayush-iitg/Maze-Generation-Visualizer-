
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let generationComplete = false;

let current;
let goal;


class DisjointSet {
    constructor(n) {
        this.parent = Array(n).fill(null).map((_, idx) => idx);
        this.rank = Array(n).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX !== rootY) {
            if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
        }
    }
}



class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.columns = columns;
    this.rows = rows;
    this.grid = [];
    this.stack = [];
    this.wallList=[];
    this.begin;
    this.randBegin;
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    this.begin = this.grid[Math.floor(Math.random() * this.rows)][Math.floor(Math.random() * this.columns)];
    this.addNeighborsFrontiers(this.begin);
    current = this.grid[0][0];
    this.grid[this.rows - 1][this.columns - 1].goal = true;
  }

  drawBacktracking() {
    // Setting the dimensions of the canvas and its background color
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";

    // Marking the starting cell as visited
    current.visited = true;

    // Drawing the initial grid on the canvas
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.rows, this.columns);
      }
    }

    // Finding the next unvisited neighboring cell
    let next = current.checkNeighbours();

    // If there is an unvisited neighboring cell
    if (next) {
      // Marking the neighboring cell as visited
      next.visited = true;

      // Pushing the current cell to the stack
      this.stack.push(current);

      // Highlighting the current cell
      current.highlight(this.columns);

      // Removing the walls between the current cell and the neighboring cell
      current.removeWalls(current, next);

      // Moving to the neighboring cell
      current = next;
    }
    // If there are no unvisited neighboring cells
    else if (this.stack.length > 0) {
      // Popping a cell from the stack
      let cell = this.stack.pop();

      // Moving to the popped cell
      current = cell;

      // Highlighting the current cell
      current.highlight(this.columns);
    }

    // If the stack is empty, it means the maze generation is completing
    if (this.stack.length === 0) {
      // Setting the generationComplete flag to true
      generationComplete = true;
      
      complete.style.display = "block";
      // Exiting the function
      return;
    }

    // Requesting the next animation frame to continue the maze generation
    window.requestAnimationFrame(() => {
      this.drawBacktracking();
    });
}
  
async drawRecursiveDivision() {
    // Setting the canvas size and background color
    const canvasSize = this.size;
    const totalRows = this.rows;
    const totalCols = this.columns;
    maze.width = canvasSize;
    maze.height = canvasSize;
    maze.style.background = "black";
  
    // Initializing the grid with no walls
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalCols; col++) {
        this.grid[row][col].walls = {
          topWall: false,
          rightWall: false,
          bottomWall: false,
          leftWall: false,
        };
        this.grid[row][col].show(canvasSize, totalRows, totalCols);
      }
    }
  
    // Recursive function to divide the grid into regions
    const divide = async (x, y, width, height, orientation) => {
      // Base case: If the region is too small, return
      if (width < 2 || height < 2) return;
  
      // Randomly choose the orientation (horizontal or vertical)
      let horizontal = orientation === undefined ? Math.random() < 0.5 : orientation;
  
      // Randomly choose a wall position
      let wx = x + (horizontal ? 0 : Math.floor(Math.random() * (width - 1)));
      let wy = y + (horizontal ? Math.floor(Math.random() * (height - 1)) : 0);
  
      // Randomly create a passage in the wall
      let px = wx + (horizontal ? Math.floor(Math.random() * width) : 0);
      let py = wy + (horizontal ? 0 : Math.floor(Math.random() * height));
  
      // Calculate the length of the wall
      let length = horizontal ? width : height;
  
      // Offsets for horizontal and vertical directions
      let dx = horizontal ? 1 : 0;
      let dy = horizontal ? 0 : 1;
  
      // Drawing the wall with a passage
      for (let i = 0; i < length; i++) {
        if (wx !== px || wy !== py) {
          let cell = this.grid[wy][wx];
          if (horizontal) {
            cell.addBottomWall();
            cell.drawAddedWall('bottom', canvasSize, totalCols, totalRows);
            if (wy + 1 < totalRows) {
              this.grid[wy + 1][wx].addTopWall();
              this.grid[wy + 1][wx].drawAddedWall('top', canvasSize, totalCols, totalRows);
            }
          } else {
            cell.addRightWall();
            cell.drawAddedWall('right', canvasSize, totalCols, totalRows);
            if (wx + 1 < totalCols) {
              this.grid[wy][wx + 1].addLeftWall();
              this.grid[wy][wx + 1].drawAddedWall('left', canvasSize, totalCols, totalRows);
            }
          }
          // Adding a delay for animation
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        wx += dx;
        wy += dy;
      }
  
      // Recursively dividing the remaining regions
      let nx = x;
      let ny = y;
      let w = horizontal ? width : wx - x + 1;
      let h = horizontal ? wy - y + 1 : height;
      await divide(nx, ny, w, h, !horizontal);
  
      nx = horizontal ? x : wx + 1;
      ny = horizontal ? wy + 1 : y;
      w = horizontal ? width : x + width - wx - 1;
      h = horizontal ? y + height - wy - 1 : height;
      await divide(nx, ny, w, h, !horizontal);
    };
  
    // Starting the recursive division from the entire grid
    await divide(0, 0, totalCols, totalRows);
  
    // Indicating that the maze generation is complete
    generationComplete = true;
    complete.style.display = "block";
  }
  
  async drawKruskals() {
    // Setting the canvas size and background color
    const canvasSize = this.size;
    const numRows = this.rows;
    const numCols = this.columns;
    maze.width = canvasSize;
    maze.height = canvasSize;
    maze.style.background = "black";
  
    // Drawing the initial grid
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        this.grid[row][col].show(canvasSize, numRows, numCols);
      }
    }
  
    // Creating a disjoint set data structure
    const disjointSet = new DisjointSet(numRows * numCols + 10);
    let wallList = [];
  
    // Creating a list of all walls in the grid
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const currentCell = this.grid[row][col];
        if (row > 0) wallList.push([currentCell, this.grid[row - 1][col]]);
        if (col > 0) wallList.push([currentCell, this.grid[row][col - 1]]);
        if (row + 1 < numRows) wallList.push([currentCell, this.grid[row + 1][col]]);
        if (col + 1 < numCols) wallList.push([currentCell, this.grid[row][col + 1]]);
      }
    }
  
    // Shuffling the wall list
    wallList.sort(() => Math.random() - 0.5);
  
    // Iterating through the wall list
    for (let i = 0; i < wallList.length; i++) {
      const [cellA, cellB] = wallList[i];
      const setA = disjointSet.find(cellA.rowNum * numCols + cellA.colNum);
      const setB = disjointSet.find(cellB.rowNum * numCols + cellB.colNum);
  
      // If the cells are not in the same set
      if (setA !== setB) {
        // Removing the wall between the cells
        cellA.removeWalls(cellA, cellB);
  
        // Highlighting the cells (except the destination cell)
        if (!(cellA.rowNum == numRows - 1 && cellA.colNum == numCols - 1)) {
          cellA.highlight(this.columns);
        }
        if (!(cellB.rowNum == numRows - 1 && cellB.colNum == numCols - 1)) {
          cellB.highlight(this.columns);
        }
  
        // Unioning the cells in the disjoint set
        disjointSet.union(cellA.rowNum * numCols + cellA.colNum, cellB.rowNum * numCols + cellB.colNum);
  
        // Drawing the removed wall
        cellA.printCommonWall(cellA, cellB, canvasSize, numCols, numRows);
  
        // Adding a delay for animation
        await new Promise(resolve => setTimeout(resolve, 20));
      }
    }
  
    // Indicating that the maze generation is complete
    generationComplete = true;
    complete.style.display = "block";
  }

  async drawBinaryTree() {
    // Setting the canvas size and background color
    const canvasSize = this.size;
    const totalRows = this.rows;
    const totalCols = this.columns;
    maze.width = canvasSize;
    maze.height = canvasSize;
    maze.style.background = "black";
  
    // Drawing the initial grid on the canvas
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalCols; col++) {
        this.grid[row][col].show(canvasSize, totalRows, totalCols);
      }
    }
  
    // Function to remove the wall between two adjacent cells
    const removeWall = (cell1, cell2) => {
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
      ctx.lineWidth = 2;
  
      let x1 = (cell1.colNum * canvasSize) / totalCols;
      let y1 = (cell1.rowNum * canvasSize) / totalRows;
  
      // If the cells are in the same row
      if (cell1.rowNum === cell2.rowNum) {
        // Remove the right wall of cell1 and the left wall of cell2
        cell1.walls.rightWall = false;
        cell2.walls.leftWall = false;
        cell1.drawRightWall(x1, y1, canvasSize, totalCols, totalRows);
      }
      // If the cells are in the same column
      else {
        // Remove the bottom wall of cell1 and the top wall of cell2
        cell1.walls.bottomWall = false;
        cell2.walls.topWall = false;
        cell1.drawBottomWall(x1, y1, canvasSize, totalCols, totalRows);
      }
    };
  
    // Creating the top row of cells
    for (let col = 0; col < totalCols - 5; col++) {
      let currentCell = this.grid[0][col];
      let rightCell = this.grid[0][col + 1];
      removeWall(currentCell, rightCell);
    }
  
    // Generating the rest of the maze
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalCols; col++) {
        let currentCell = this.grid[row][col];
  
        // Highlighting the current cell (except the destination cell)
        if (!(currentCell.colNum == totalCols - 1 && currentCell.rowNum == totalRows - 1)) {
          currentCell.highlight(this.columns);
        }
        await new Promise(resolve => setTimeout(resolve, 50));
  
        // Randomly choosing the direction (right or down)
        let direction = Math.random() < 0.5 ? "right" : "down";
  
        // If the direction is right and the cell is not at the rightmost column
        if (direction === "right" && col < totalCols - 1) {
          let rightCell = this.grid[row][col + 1];
          removeWall(currentCell, rightCell);
        }
        // If the direction is down and the cell is not at the bottommost row
        else if (row < totalRows - 1) {
          let downCell = this.grid[row + 1][col];
          removeWall(currentCell, downCell);
        }
  
        // Unhighlighting the current cell (except the destination cell)
        if (!(currentCell.colNum == totalCols - 1 && currentCell.rowNum == totalRows - 1)) {
          currentCell.remHighlight(this.columns);
        }
      }
    }
  
    // Indicating that the maze generation is complete
    generationComplete = true;
    complete.style.display = "block";
  }
  

  async drawPrims() {
    // Setting the canvas size and background color
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";
  
    // Marking the starting cell as visited
    this.begin.visited = true;
  
    // Drawing the initial grid on the canvas
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.grid[r][c].show(this.size, this.rows, this.columns);
      }
    }
  
    // If the wall list is not empty
    if (this.wallList.length > 0) {
      // Selecting a random wall from the wall list
      let randomIndex = Math.floor(Math.random() * this.wallList.length);
      let wall = this.wallList[randomIndex];
      let [cell1, cell2] = wall;
      cell1.highlight(this.columns);
  
      // Checking if the cells on either side of the wall are visited or not
      let c1 = cell1.visited;
      let c2 = cell2.visited;
  
      // If cell1 is visited and cell2 is not
      if (c1 && !c2) {
        // Removing the wall between cell1 and cell2
        cell1.removeWalls(cell1, cell2);
        // Marking cell2 as visited
        cell2.visited = true;
        // Adding the unvisited neighbors of cell2 to the wall list
        this.addNeighborsFrontiers(cell2);
      }
      // If cell2 is visited and cell1 is not
      else if (!c1 && c2) {
        // Removing the wall between cell2 and cell1
        cell2.removeWalls(cell1, cell2);
        // Marking cell1 as visited
        cell1.visited = true;
        // Adding the unvisited neighbors of cell1 to the wall list
        this.addNeighborsFrontiers(cell1);
      }
  
      // Removing the selected wall from the wall list
      this.wallList.splice(randomIndex, 1);
    }
  
    // If the wall list is empty, it means the maze generation is complete
    if (this.wallList.length === 0) {
      generationComplete = true;
      complete.style.display = "block";
      return;
    }
  
    // Scheduling the next frame for animation
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.drawPrims();
      });
    }, 30);
  }
  
  addNeighborsFrontiers(cell) {
    // Getting the row and column indices of the given cell
    let { rowNum, colNum } = cell;
    let grid = this.grid;
  
    // Adding the unvisited neighbors of the cell to the wall list
    if (rowNum > 0) {
      this.wallList.push([cell, grid[rowNum - 1][colNum]]);
    }
    if (colNum < this.columns - 1) {
      this.wallList.push([cell, grid[rowNum][colNum + 1]]);
    }
    if (rowNum < this.rows - 1) {
      this.wallList.push([cell, grid[rowNum + 1][colNum]]);
    }
    if (colNum > 0) {
      this.wallList.push([cell, grid[rowNum][colNum - 1]]);
    }
  }


  async drawSidewinderer() {
    const canvasSize = this.size;
    const totalRows = this.rows;
    const totalCols = this.columns;
    maze.width = canvasSize;
    maze.height = canvasSize;
    maze.style.background = "black";
  
    // Start with an empty grid (no walls)
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalCols; col++) {
        this.grid[row][col].walls = {
          topWall: false,
          rightWall: false,
          bottomWall: false,
          leftWall: false,
        };
        this.grid[row][col].show(canvasSize, totalRows, totalCols);
      }
    }
  
    // Add outer walls
    for (let col = 0; col < totalCols; col++) {
      this.grid[0][col].addTopWall(true);
      this.grid[totalRows - 1][col].swaddBottomWall(true);
    }
    for (let row = 0; row < totalRows; row++) {
      this.grid[row][0].addLeftWall(true);
      this.grid[row][totalCols - 1].swaddRightWall(true);
    }
  
    // Remove top wall of the start cell and bottom wall of the end cell
    this.grid[0][0].addTopWall(false);
    this.grid[totalRows - 1][totalCols - 1].swaddBottomWall(false);
  
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalCols; col++) {
        let currentCell = this.grid[row][col];
        currentCell.highlight(this.columns);
        await new Promise(resolve => setTimeout(resolve, 50));
  
        if (col === totalCols - 1) {
          // Last cell in the row, always carve north (except for top row)
          if (row > 0) {
            currentCell.addTopWall(false);
            this.grid[row - 1][col].swaddBottomWall(false);
          }
        } else {
          // Randomly decide to close out the run or continue
          let shouldCloseOut = Math.random() < 0.5;
  
          if (shouldCloseOut) {
            // Randomly choose a cell in the run to carve north
            let carveCol = Math.floor(Math.random() * (col + 1));
            let carveCell = this.grid[row][carveCol];
            
            if (row > 0) {
              carveCell.swaddTopWall(false);
              this.grid[row - 1][carveCol].swaddBottomWall(false);
            }
  
            // Always carve east at the end of a run (to connect runs)
            currentCell.swaddRightWall(false);
            this.grid[row][col + 1].swaddLeftWall(false);
          }
        }
  
        currentCell.remHighlight(this.columns);
      }
    }
  
    generationComplete = true;
    complete.style.display = "block";
  }


 
  async drawAldous() {
    // Setting the canvas size and background color
    const canvasSize = this.size;
    const totalRows = this.rows;
    const totalCols = this.columns;
    maze.width = canvasSize;
    maze.height = canvasSize;
    maze.style.background = "black";
  
    // Selecting a random starting cell
    const randBegin = this.grid[Math.floor(Math.random() * totalRows)][Math.floor(Math.random() * totalCols)];
    randBegin.visited = true;
  
    // Drawing the initial grid on the canvas
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalCols; col++) {
        this.grid[row][col].show(canvasSize, totalRows, totalCols);
      }
    }
  
    // Initializing variables for the algorithm
    let remainingCells = totalRows * totalCols - 1;
    let previousCell = null;
    let currentCell = randBegin;
 
    // Main loop for the algorithm
    while (remainingCells > 0) {
      // Unhighlighting the previous cell
      if (previousCell) {
        previousCell.remHighlight(totalCols);
      }
  
      // Highlighting the current cell (except the destination cell)
      //if(!(currentCell.rowNum==numRows-1 && currentCell.colNum==numCols-1)){

      if (currentCell == totalRows * totalCols ) {
        console.log("final reached");
      } else {
        currentCell.highlight(totalCols);
      }//}
  
      // Temporarily storing the current cell as the previous cell
      previousCell = currentCell;
  
      // Unhighlighting the previous cell
      if (previousCell) {
        previousCell.remHighlight(totalCols);
      }
  
      // Checking for an unvisited neighboring cell
      const neighbor = currentCell.checkNeighboursAldusBroder();
  
      // Highlighting the current cell (except the destination cell)
      //if(!(currentCell.rowNum==numRows-1 && currentCell.colNum==numCols-1)){
      if (currentCell == totalRows * totalCols) {
        console.log("final reached");
      } else {
        currentCell.highlight(this.columns);
      }//}
  
      // If an unvisited neighboring cell is found
      if (neighbor) {
        // If the neighboring cell is unvisited
        if (!neighbor.visited) {
          // Decrementing the count of remaining cells
          remainingCells--;
          // Marking the neighboring cell as visited
          neighbor.visited = true;
          // Removing the wall between the current cell and the neighboring cell
          currentCell.removeWalls(currentCell, neighbor);
          // Drawing the removed wall on the canvas
          currentCell.printCommonWallBlack(currentCell, neighbor, canvasSize, totalCols, totalRows);
        }
        // Updating the previous cell and the current cell
        previousCell = currentCell;
        currentCell = neighbor;
      }
      // Adding a delay for animation
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    const destCell = this.grid[totalRows-1][totalCols-1];
    destCell.greenhighlight(this.columns);
    // Indicating that the maze generation is complete
    generationComplete = true;
    complete.style.display = "block";
  }
     
}

class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.visited = false;
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true,
    };
    this.goal = false;
  
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
  }
 
  
    swaddTopWall(draw) {
        this.walls.topWall = draw;
        this.drawAddedWall('top', this.parentSize, this.parentGrid[0].length, this.parentGrid.length, draw);
      }
    
      swaddRightWall(draw) {
        this.walls.rightWall = draw;
        this.drawAddedWall('right', this.parentSize, this.parentGrid[0].length, this.parentGrid.length, draw);
      }
    
      swaddBottomWall(draw) {
        this.walls.bottomWall = draw;
        this.drawAddedWall('bottom', this.parentSize, this.parentGrid[0].length, this.parentGrid.length, draw);
      }
    
      swaddLeftWall(draw) {
        this.walls.leftWall = draw;
        this.drawAddedWall('left', this.parentSize, this.parentGrid[0].length, this.parentGrid.length, draw);
      }
    
      swdrawAddedWall(direction, size, columns, rows, draw) {
        let x = (this.colNum * size) / columns;
        let y = (this.rowNum * size) / rows;
        
        ctx.strokeStyle = draw ? "purple" : "black";
        ctx.fillStyle = draw ? "purple" : "black";
        ctx.lineWidth = 3;
    
        switch (direction) {
          case 'top':
            this.drawTopWall(x, y, size, columns, rows);
            break;
          case 'right':
            this.drawRightWall(x, y, size, columns, rows);
            break;
          case 'bottom':
            this.drawBottomWall(x, y, size, columns, rows);
            break;
          case 'left':
            this.drawLeftWall(x, y, size, columns, rows);
            break;
        }
      }
    
    addTopWall() {
      this.walls.topWall = true;
    }
  
    addRightWall() {
      this.walls.rightWall = true;
    }
  
    addBottomWall() {
      this.walls.bottomWall = true;
    }
  
    addLeftWall() {
      this.walls.leftWall = true;
    }
  
    drawAddedWall(direction, size, columns, rows) {
      let x = (this.colNum * size) / columns;
      let y = (this.rowNum * size) / rows;
      
      ctx.strokeStyle = "white";
      ctx.fillStyle = "white";
      ctx.lineWidth = 3;
  
      switch (direction) {
        case 'top':
          this.drawTopWall(x, y, size, columns, rows);
          break;
        case 'right':
          this.drawRightWall(x, y, size, columns, rows);
          break;
        case 'bottom':
          this.drawBottomWall(x, y, size, columns, rows);
          break;
        case 'left':
          this.drawLeftWall(x, y, size, columns, rows);
          break;
      }
    }
  
  

  checkNeighbours() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;
    let neighbours = [];

  
    let top = row !== 0 ? grid[row - 1][col] : undefined;
    let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col !== 0 ? grid[row][col - 1] : undefined;

    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }

  drawTopWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / columns, y);
    ctx.stroke();
  }

  drawRightWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawBottomWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawLeftWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }

  recdrawRightWall(x, y, size, columns, rows) {
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  recdrawBottomWall(x, y, size, columns, rows) {
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  printCommonWallBlack(cell1, cell2, size, columns, rows) {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.lineWidth = 3;
    let x = cell1.colNum - cell2.colNum;
    let x1 = (cell1.colNum * size) / columns;
    let y1 = (cell1.rowNum * size) / rows;
    if (x === 1 && cell1.walls['leftWall'] == false) {
      cell1.drawLeftWall(x1, y1, size, columns, rows);
    } 
    else if (x === -1 && cell1.walls['rightWall'] === false) {
      cell1.drawRightWall(x1, y1, size, columns, rows);
    }
    let y = cell1.rowNum - cell2.rowNum;
    if (y === 1 && cell1.walls['topWall'] === false) {
      cell1.drawTopWall(x1, y1, size, columns, rows);

    } else if (y === -1 && cell1.walls['bottomWall'] === false) {
      cell1.drawBottomWall(x1, y1, size, columns, rows);
    }

  }

  printCommonWall(cell1, cell2, size, columns, rows) {
    ctx.strokeStyle = "purple";
    ctx.fillStyle = "purple";
    ctx.lineWidth = 3;
    let x = cell1.colNum - cell2.colNum;
    let x1 = (cell1.colNum * size) / columns;
    let y1 = (cell1.rowNum * size) / rows;
    if (x === 1 && cell1.walls['leftWall'] == false) {
      cell1.drawLeftWall(x1, y1, size, columns, rows);
    } 
    else if (x === -1 && cell1.walls['rightWall'] === false) {
      cell1.drawRightWall(x1, y1, size, columns, rows);
    }
    let y = cell1.rowNum - cell2.rowNum;
    if (y === 1 && cell1.walls['topWall'] === false) {
      cell1.drawTopWall(x1, y1, size, columns, rows);

    } else if (y === -1 && cell1.walls['bottomWall'] === false) {
      cell1.drawBottomWall(x1, y1, size, columns, rows);
    }

  }

  highlightKruskals(columns) {
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    ctx.fillStyle = "purple";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3 ,
      this.parentSize / columns - 3
        );
  }
  highlight(columns) {
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    ctx.fillStyle = "purple";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
  }
  greenhighlight(columns) {
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    ctx.fillStyle = "rgb(83, 247, 43)"
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
  }
  reccHighlight(columns) {
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    ctx.fillStyle = "white";
    ctx.fillRect(
      x,
      y,10,10
    );
  }

  remHighlight(columns) {
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    ctx.fillStyle = "black";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns-3 ,
      this.parentSize / columns -3
    );
  }

  removeWalls(cell1, cell2) {
    let x = cell1.colNum - cell2.colNum;
    if (x === 1) {
      cell1.walls.leftWall = false;
      cell2.walls.rightWall = false;
    } else if (x === -1) {
      cell1.walls.rightWall = false;
      cell2.walls.leftWall = false;
    }
    let y = cell1.rowNum - cell2.rowNum;
    if (y === 1) {
      cell1.walls.topWall = false;
      cell2.walls.bottomWall = false;
    } else if (y === -1) {
      cell1.walls.bottomWall = false;
      cell2.walls.topWall = false;
    }
  }

  show(size, rows, columns) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;
    
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
    if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
    if (this.goal) {
      ctx.fillStyle = "rgb(83, 247, 43)";
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
  }

  reccShow(size, rows, columns) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;
    
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "black";
    ctx.lineWidth = 0;
   
    if (this.visited) {
      ctx.fillRect(x+1 , y+1, size/columns-2 , size/rows-2);
    }
    if (this.goal) {
      ctx.fillStyle = "rgb(83, 247, 43)";
      ctx.fillRect(x + 1 , y+1 , size / columns-2, size / rows-2 );
    }
  }
  checkNeighboursAldusBroder() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;
    let neighbours = [];

  
    let top = row !== 0 ? grid[row - 1][col] : undefined;
    let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col !== 0 ? grid[row][col - 1] : undefined;

    if (top) neighbours.push(top);
    if (right) neighbours.push(right);
    if (bottom ) neighbours.push(bottom);
    if (left) neighbours.push(left);

    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }
}

// let newMaze = new Maze(600, 50, 50);
// newMaze.setup();
// newMaze.draw();
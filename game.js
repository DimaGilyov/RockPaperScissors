(function () {
    let gameCanvas = document.getElementById("gameCanvas");
    let gameContext = gameCanvas.getContext("2d");
    gameCanvas.width = 840;
    gameCanvas.height = 780;

    gameCanvas.addEventListener("mousedown", mouseDownHandler);
    gameCanvas.addEventListener("mouseup", mouseUpHandler);

    let tiles = null;
    let map = null;
    let warriorsCoodinates = null;
    let isWaitingOpponentMove = false;
    let mouseDownCoords = {};
    initGame();

    async function initGame(){
        tiles = await loadTiles();
        map = buildMap();
        drawMap();
        warriorsCoodinates = getWarriorsCoodinates();
        drawWarriors();
    }
    
    async function loadTiles(){
        let tiles = {};

        tiles.cell1  = await loadImage("images/cell_1.png");
        tiles.cell2  = await loadImage("images/cell_2.png");

        tiles.rock  = await loadImage("images/rock.png");
        tiles.paper  = await loadImage("images/paper.png");
        tiles.scissors  = await loadImage("images/scissors.png");

        tiles.warriorBackBlue  = await loadImage("images/warrior_back_blue.png");
        tiles.warriorFrontBlue  = await loadImage("images/warrior_front_blue.png");

        tiles.warriorBackRed  = await loadImage("images/warrior_back_red.png");
        tiles.warriorFrontRed  = await loadImage("images/warrior_front_red.png");

        tiles.warriorBackFake  = await loadImage("images/warrior_back_fake.png");

        tiles.flagBlue  = await loadImage("images/flag_blue.png");
        tiles.flagRed  = await loadImage("images/flag_red.png");

        tiles.background  = await loadImage("images/background.png");
       
        return tiles;
    }
    
    function buildMap(){
        let map = [];

        gameContext.drawImage(tiles.background, 0, 0);

        let cellSize = 100;
        let startX = 60;
        let startY = 125;
        let cellImage = tiles.cell1;
        for(let row = 0; row < 6; row++){
            map[row] = [];
            for(let col = 0; col < 7; col++){
                cellImage = cellImage == tiles.cell1 ? tiles.cell2 : tiles.cell1;
                let x = startX + col * cellSize;
                let y = startY + row * cellSize;
                let width = cellSize;
                let height = cellSize;
                map[row].push(new Cell(x, y, width, height, cellImage));
            }
        }

        return map;
    }

    function drawMap(){
        for(let row = 0; row < map.length; row++){
            for(let col = 0; col < map[0].length; col++){
                let cell = map[row][col];
                gameContext.drawImage(cell.image, cell.x, cell.y, cell.width, cell.height);
            }
        }       
    }

    function getWarriorsCoodinates(){
        return getFakeWarriorsCoodinates();
    }

    function getFakeWarriorsCoodinates(){
        let warriorsCoodinates = [];
        warriorsCoodinates.push(new Warrior(0, 0, true, false, "rock", "red"));
        warriorsCoodinates.push(new Warrior(1, 0, true, false, "rock", "red"));
        warriorsCoodinates.push(new Warrior(2, 0, true, true, "rock", "red"));
        warriorsCoodinates.push(new Warrior(3, 0, true, true, "rock", "red"));
        warriorsCoodinates.push(new Warrior(4, 0, true, false, "paper", "red"));
        warriorsCoodinates.push(new Warrior(5, 0, true, false, "paper", "red"));
        warriorsCoodinates.push(new Warrior(6, 0, true, true, "paper", "red"));
        warriorsCoodinates.push(new Warrior(0, 1, true, true, "paper", "red"));
        warriorsCoodinates.push(new Warrior(1, 1, true, false, "scissors", "red"));
        warriorsCoodinates.push(new Warrior(2, 1, true, false, "scissors", "red"));
        warriorsCoodinates.push(new Warrior(3, 1, true, true, "scissors", "red"));
        warriorsCoodinates.push(new Warrior(4, 1, true, true, "scissors", "red"));
        warriorsCoodinates.push(new Warrior(5, 1, true, false, "fake", "red"));
        warriorsCoodinates.push(new Warrior(6, 1, true, false, "flag", "red"));
        warriorsCoodinates.push(new Warrior(0, 2, true, true, "fake", "red"));
        warriorsCoodinates.push(new Warrior(1, 2, true, true, "flag", "red"));

        warriorsCoodinates.push(new Warrior(0, 5, false, false, "rock", "blue"));
        warriorsCoodinates.push(new Warrior(1, 5, false, false, "rock", "blue"));
        warriorsCoodinates.push(new Warrior(2, 5, false, true, "rock", "blue"));
        warriorsCoodinates.push(new Warrior(3, 5, false, true, "rock", "blue"));
        warriorsCoodinates.push(new Warrior(4, 5, false, false, "paper", "blue"));
        warriorsCoodinates.push(new Warrior(5, 5, false, false, "paper", "blue"));
        warriorsCoodinates.push(new Warrior(6, 5, false, true, "paper", "blue"));
        warriorsCoodinates.push(new Warrior(0, 4, false, true, "paper", "blue"));
        warriorsCoodinates.push(new Warrior(1, 4, false, false, "scissors", "blue"));
        warriorsCoodinates.push(new Warrior(2, 4, false, false, "scissors", "blue"));
        warriorsCoodinates.push(new Warrior(3, 4, false, true, "scissors", "blue"));
        warriorsCoodinates.push(new Warrior(4, 4, false, true, "scissors", "blue"));
        warriorsCoodinates.push(new Warrior(5, 4, false, false, "fake", "blue"));
        warriorsCoodinates.push(new Warrior(6, 4, false, false, "flag", "blue"));
        warriorsCoodinates.push(new Warrior(0, 3, false, true, "fake", "blue"));
        warriorsCoodinates.push(new Warrior(1, 3, false, true, "flag", "blue"));

        return warriorsCoodinates;
    }
    
    function drawWarriors(){
        drawMap();
        for(let i = 0; i < warriorsCoodinates.length; i++){
            let warrior = warriorsCoodinates[i];
            let cell = map[warrior.y][warrior.x];
            let x = cell.x;
            let y = cell.y;
            
            let warriorImage = null;
            let weaponImage = null;
            if (warrior.weapon == "rock"){
                weaponImage = tiles.rock;
            } else if (warrior.weapon == "paper"){
                weaponImage = tiles.paper;
            } else if (warrior.weapon == "scissors"){
                weaponImage = tiles.scissors;
            } else if (warrior.weapon == "flag"){
                if (warrior.color == "red"){
                    weaponImage = tiles.flagRed;
                } else if (warrior.color == "blue"){
                    weaponImage = tiles.flagBlue;
                }
            }

            if (warrior.isOpponent){
                if (warrior.color == "red"){
                    warriorImage = tiles.warriorFrontRed;
                } else if (warrior.color == "blue"){
                    warriorImage = tiles.warriorFrontBlue;
                }
            } else {
                if (warrior.weapon == "fake"){
                    warriorImage = tiles.warriorBackFake;
                } else if (warrior.color == "red"){
                    warriorImage = tiles.warriorBackRed;
                } else if (warrior.color == "blue"){
                    warriorImage = tiles.warriorBackBlue;
                }
            }

            if (warrior.isShowWeapon){
                gameContext.drawImage(warriorImage, x, y);
                if (weaponImage != null){
                    if (warrior.isOpponent){
                        if (warrior.weapon == "rock"){
                            gameContext.drawImage(weaponImage,  x + 40, y, 70, 100);
                        } else {
                            gameContext.drawImage(weaponImage,  x + 25, y);
                        }
                    } else {
                        if (warrior.weapon == "rock"){
                            gameContext.drawImage(weaponImage,  x + 10, y, 70, 100);
                        } else {
                            gameContext.drawImage(weaponImage,  x, y);
                        }
                    }
                }
            } else {
                if (weaponImage != null && !warrior.isOpponent){
                    if (warrior.weapon == "rock"){
                        gameContext.drawImage(weaponImage,  x + 28, y, 70, 100);
                    } else {
                        gameContext.drawImage(weaponImage,  x + 28, y);
                    }
                }
               
                gameContext.drawImage(warriorImage,  x, y);
            }
        }  
    }

    function getCellCoords(x, y){
        for(let row = 0; row < map.length; row++){
            for(let col = 0; col < map[0].length; col++){
                let cell = map[row][col];
                if (x >= cell.x && y >= cell.y && x <= cell.x + cell.width && y <= cell.y + cell.height){
                    let coords = {};
                    coords.x = col;
                    coords.y = row;
                    return coords;
                }
            }
        } 

        return null;
    } 


    function Cell(x, y, width, height, image){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    } 

    function Warrior(x, y, isOpponent, isShowWeapon , weapon, color){
        this.x = x;
        this.y = y;
        this.isOpponent = isOpponent;
        this.isShowWeapon = isShowWeapon;
        this.weapon = weapon;
        this.color = color;
    }

    function mouseDownHandler(event){
        let rect = gameCanvas.getBoundingClientRect()
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        mouseDownCoords.x = x;
        mouseDownCoords.y = y;
    }

    function mouseUpHandler(event){
        let rect = gameCanvas.getBoundingClientRect()
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (!isWaitingOpponentMove){
            let fromCellCoords = getCellCoords(mouseDownCoords.x, mouseDownCoords.y);
            let toCellCoords = getCellCoords(x, y);
            if (fromCellCoords != null && toCellCoords != null){
                if (isMove(fromCellCoords, toCellCoords)){
                    sendWarriorMove(fromCellCoords, toCellCoords);
                }
            }
        }
    }

    function sendWarriorMove(fromCellCoords, toCellCoords){
        warriorMove(fromCellCoords, toCellCoords);

        drawWarriors()
    }

    function warriorMove(fromCellCoords, toCellCoords){
        for(let j= 0; j < warriorsCoodinates.length; j++){
            let warrairCoords2 = warriorsCoodinates[j];
            if (warrairCoords2.x == fromCellCoords.x && warrairCoords2.y == fromCellCoords.y){          
                warrairCoords2.x = toCellCoords.x;
                warrairCoords2.y = toCellCoords.y;
            }
        }
    }

    function isMove(fromCellCoords, toCellCoords){
        if (fromCellCoords.x != toCellCoords.x || fromCellCoords.y != toCellCoords.y){
            let diffX = fromCellCoords.x - toCellCoords.x;
            let diffY = fromCellCoords.y - toCellCoords.y;

            for(let i= 0; i < warriorsCoodinates.length; i++){
                let warrairCoords = warriorsCoodinates[i];
                if (!warrairCoords.isOpponent && warrairCoords.x == fromCellCoords.x && warrairCoords.y == fromCellCoords.y){
                    
                    // Не ходим на своих игроков
                    for(let j= 0; j < warriorsCoodinates.length; j++){
                        let warrairCoords2 = warriorsCoodinates[j];
                        if (!warrairCoords2.isOpponent && warrairCoords2.x == toCellCoords.x && warrairCoords2.y == toCellCoords.y){
                            
                            return false;
                        }
                    }

                    return (Math.abs(diffX) == 0 || Math.abs(diffX) == 1) && (Math.abs(diffY) == 0 || Math.abs(diffY) == 1);
                }
            }
        }

        return false;
    }


    function loadImage(src){
        return new Promise((resolve) => {
            let image = new Image();
            image.src = src;
            image.onload = () => resolve(image);
        });
    }
 }());
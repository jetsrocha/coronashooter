const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = [ 'img/dirtybag.png', 'img/dirtywallet.png', 'img/dirtyhand.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;

//movimento e tiro da nave
function flyShip(event) {
    if(event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if(event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if(event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

//função de subir
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === "0px") {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 50;
        yourShip.style.top = `${position}px`;
    }
}

//função de descer
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if(topPosition === "400px"){
        return
    } else {
        let position = parseInt(topPosition);
        position += 50;
        yourShip.style.top = `${position}px`;
    }
}

//funcionalidade de tiro
function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada alien foi atingido, se sim, troca o src da imagem
            if(checkLaserCollision(laser, alien)) {
                if(alien.src.includes('img/dirtybag.png')){
                    alien.src = 'img/cleanbag.png';
                    alien.classList.remove('alien');
                    alien.classList.add('dead-bag');
                }else if(alien.src.includes('img/dirtywallet.png')){
                    alien.src = 'img/cleanwallet.png';
                    alien.classList.remove('alien');
                    alien.classList.add('dead-wallet');
                }else if(alien.src.includes('img/dirtyhand.png')){
                    alien.src = 'img/cleanhand.png';
                    alien.classList.remove('alien');
                    alien.classList.add('dead-hand');
                }else{
                    alien.src = 'img/explosion.png';
                    alien.classList.remove('alien');
                    alien.classList.add('dead-alien');
                }
                
            }
        })

        if(xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

//função para criar inimigos aleatórios
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens
    newAlien.src = alienSprite;
    if(alienSprite == 'img/dirtybag.png') {
        newAlien.classList.add('alien')
        newAlien.classList.add('bag')
    } else if(alienSprite == 'img/dirtywallet.png'){
        newAlien.classList.add('alien')
        newAlien.classList.add('wallet')
    }else if(alienSprite == 'img/dirtyhand.png'){
        newAlien.classList.add('alien')
        newAlien.classList.add('hand')
    }else {
        newAlien.classList.add('alien');    
    }
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '295px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//função para movimentar os inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien') 
                || Array.from(alien.classList).includes('dead-bag')
                || Array.from(alien.classList).includes('dead-wallet')
                || Array.from(alien.classList).includes('dead-hand')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

//função para  colisão
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop + 40 && laserTop >= alienBottom -50) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//inicio do jogo 
startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}


//função de game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        instructionsText.style.display = "block";
        instructionsText.innerHTML = "<h1 class = 'over-text'>OPA! Descuidou?</br>Continue tentando</h1>"
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        
    });
}
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 10;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = "STRONGATTACK";
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const eneteredValue = prompt("Maximum value for you and monster", '100');

let chosenMaxLife = parseInt(eneteredValue)
let battlelog = [];

if(isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let haseBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth){
    let logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
    };
    if(ev === LOG_EVENT_PLAYER_ATTACK){
        logEntry.target = "Monster"
    }else if(ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
        logEntry.target = "Monster"
    }else if(ev === LOG_EVENT_MONSTER_ATTACK){
        logEntry.target = "Player"
    }else if(ev === LOG_EVENT_PLAYER_HEAL){
        logEntry.target = "Player"
    }else if(ev === LOG_EVENT_GAME_OVER){  
    }
    battlelog.push(logEntry);
}

function reset(){
    let currentMonsterHealth = chosenMaxLife;
    let currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const monstDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= monstDamage;

    if(currentPlayerHealth <= 0 && haseBonusLife){
        haseBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('Bonus life saved you');
    }

    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        alert("You Won!");
        reset();
    }else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert("You Lost!");
        reset();
    }else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0){
        alert("Draw");
        reset();
    }
}

function attackMonster(mode){
    let maxDamage;
    if(mode === MODE_ATTACK){
        maxDamage = ATTACK_VALUE;
    }else if(mode === MODE_STRONG_ATTACK){
        maxDamage = STRONG_ATTACK_VALUE
    }

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    endRound();
}

function attackHandler(){
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler(){
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert("You Can't Heal");
        healValue = chosenMaxLife - currentPlayerHealth;
    }else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += HEAL_VALUE;
    endRound();
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', writeToLog);
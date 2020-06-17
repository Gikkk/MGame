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


let battlelog = [];

function getMaxLifeValue(){
    const eneteredValue = prompt("Maximum value for you and monster", '100');
    
    let parseValue = parseInt(eneteredValue)
    if(isNaN(parseValue) || parseValue <= 0){
        throw {message: "Invalid user input"}
    }
    return parseValue;
}

let chosenMaxLife;

try{
    chosenMaxLife = getMaxLifeValue();
}catch(error){
    console.log(error);
    chosenMaxLife = 100;
    alert("Def value 100")
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

    switch (ev){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = "Monster";
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = "Monster";
            break;
        case   LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = "Player";
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = "Player";
        case LOG_EVENT_GAME_OVER:
            break;
        default: 
        logEntry = {};      
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

    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        monstDamage,
        currentMonsterHealth,
        currentPlayerHealth)

    if(currentPlayerHealth <= 0 && haseBonusLife){
        haseBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('Bonus life saved you');
    }

    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        alert("You Won!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "Player Won",
            currentMonsterHealth,
            currentPlayerHealth
        )
        reset();
    }else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert("You Lost!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "Monster Won",
            currentMonsterHealth,
            currentPlayerHealth
        )
        reset();
    }else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0){
        alert("Draw");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "Draw",
            currentMonsterHealth,
            currentPlayerHealth
        )
        reset();
    }
}

function attackMonster(mode){
    const maxDamage = mode === MODE_ATTACK
    ? ATTACK_VALUE
    : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK
    ? LOG_EVENT_PLAYER_ATTACK
    : LOG_EVENT_PLAYER_STRONG_ATTACK
    
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(
        logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth
    );
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
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function logHandler(){
    let i = 0;
    for(const logEntry of battlelog){
        console.log(`#${i}`);
        for(const key in logEntry){
            console.log(key);
            console.log(logEntry[key]);          
        }
        i++;
        break;
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', logHandler);
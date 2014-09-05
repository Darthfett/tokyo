/* CONSTANTS */
var PHASE_COUNT = 6;
var PHASES = {
    "PRE_ROLL": 0,
    "ROLL": 1,
    "PRE_RESOLVE": 2,
    "RESOLVE_DICE": 3,
    "BUY_CARDS": 4,
    "END_TURN": 5,
};
var NUM_TO_PHASE; // To be setup in init
var PHASE_INIT_FUNCTIONS = {}; // To be setup in init
var PHASE_END_FUNCTIONS = {}; // To be setup in init
var NUM_PLAYERS = 4;
var MAX_PLAYERS = 6;
var MAX_DICE = 8;


/* GLOBAL STATE */
var Roll = 0;
var CurrentPlayer;
var CurrentPhase;
var Players = [];


/* UTILITY FUNCTIONS */
function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

function isInt(n) {
    return typeof n == "number" && isFinite(n) && n % 1 === 0;
}

function inverted(obj) {
    var new_obj = {};

    for (var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            new_obj[obj[prop]] = prop;
        }
    }

    return new_obj;
}


/* GAME FUNCTIONS */
function Player(id, name) {
    if (!isInt(id)) {
        return undefined;
    }
    this.id = id;
    if (typeof name == 'undefined') {
        name = "Player " + (id + 1);
    }
    this.name = name;
    this.hp = 10;
    this.max_hp = 10;
    this.vp = 10;
    this.energy = 0;
    this.dice = 6;
    this.max_rolls = 3;
    this.in_tokyo = false;
    
    Players[id] = this;
    return this;
}

function next_phase() {
    CurrentPhase = (CurrentPhase + 1) % PHASE_COUNT;
    var current_phase_span = document.getElementById("current_phase");
    current_phase_span.innerHTML = NUM_TO_PHASE[CurrentPhase];
    PHASE_INIT_FUNCTIONS[CurrentPhase]();
}

function get_next_player() {
    var i = (CurrentPlayer.id + 1) % NUM_PLAYERS;
    while (i != CurrentPlayer.id) {
        var p = Players[i];
        if (p.hp >= 0) {
            return p;
        }
        i++;
    }
    return CurrentPlayer;
}

function on_next_phase() {
    PHASE_END_FUNCTIONS[CurrentPhase]();
}

/* PRE_ROLL Phase */
function end_pre_roll_phase() {}

function init_pre_roll_phase() {
    // Update current player
    var turnmarker_img = document.getElementById("player_" + (CurrentPlayer.id + 1) + "_turnmarker");
    turnmarker_img.hidden = true;
    
    CurrentPlayer = get_next_player();
    
    turnmarker_img = document.getElementById("player_" + (CurrentPlayer.id + 1) + "_turnmarker");
    turnmarker_img.hidden = false;
    var current_player_span = document.getElementById("current_player-name");
    current_player_span.innerHTML = CurrentPlayer.name;
    
    next_phase();
}


/* ROLL Phase */
function end_roll_phase() {
    // Hide/disable die selections
    for(var i = 1; i <= MAX_DICE; i++) {
        var die_checkbox = document.getElementById("select_die" + i);
        
        die_checkbox.checked = true;
        die_checkbox.disabled = true;
        die_checkbox.hidden = true;
        
    }
    
    // Hide controls
    controls_roll_dice = document.getElementById("controls_roll_dice");
    controls_roll_dice.hidden = true;
    
    next_phase();
}

function reset_dice() {
    // Hide all dice
    for(var i = 1; i <= MAX_DICE; i++) {
        var die_div = document.getElementById("die" + i);
        var die_img = document.getElementById("die" + i + "_img");
        var die_checkbox = document.getElementById("select_die" + i);
        die_div.hidden = false;
        die_img.src = "assets/dice/die_blank.png";
        die_checkbox.checked = false;
        die_checkbox.disabled = true;
        die_checkbox.hidden = true;
        
    }
}

function unhide_player_dice() {
    for(var i = 1; i <= CurrentPlayer.dice; i++) {
        var die_div = document.getElementById("die" + i);
        var die_checkbox = document.getElementById("select_die" + i);
        die_div.hidden = false;
        die_checkbox.hidden = false;
        
    }
}

function update_rolls_left() {
    var roll_number_span = document.getElementById("roll_number");
    var rolls_left_span = document.getElementById("rolls_left");
    roll_number_span.innerHTML = Roll;
    rolls_left_span.innerHTML = CurrentPlayer.max_rolls-Roll;
}

function roll_dice() {
    for(var i = 1; i <= CurrentPlayer.dice; i++) {
        var die_checkbox = document.getElementById("select_die" + i);
        var die_img = document.getElementById("die" + i + "_img");
        
        if (!die_checkbox.checked) {
            die_img.src = "assets/dice/die_" + randomChoice(["one", "two", "three", "energy", "slap", "heart"]) + ".png";
        }
        
        die_checkbox.disabled = false;
    }
    Roll++;
}

function on_roll_dice() {
    if (CurrentPhase !== PHASES["ROLL"]) return;
    if (Roll >= CurrentPlayer.max_rolls) return;
    
    roll_dice();
    
    update_rolls_left();
    
    if (Roll >= CurrentPlayer.max_rolls) {
        end_roll_phase();
        
    }
}

function init_roll_phase() {
    Roll = 0;
    
    // Unhide Roll controls
    reset_dice();    
    unhide_player_dice();
    controls_roll_dice = document.getElementById("controls_roll_dice");
    controls_roll_dice.hidden = false;
}


/* PRE_RESOLVE Phase */
function end_pre_resolve_phase() {}

function init_pre_resolve_phase() {
    next_phase();
}


/* RESOLVE_DICE Phase */
function end_resolve_dice_phase() {
    next_phase();
}

function init_resolve_dice_phase() {}


/* BUY_CARDS Phase */
function end_buy_cards_phase() {}

function init_buy_cards_phase() {
    next_phase();
}


/* END_TURN Phase */
function end_end_turn_phase() {}

function init_end_turn_phase() {
    next_phase();
}


/* Setup */
function start_game() {
    CurrentPlayer = Players[0];
    CurrentPhase = 0;
    
    next_phase();
}

function setup_players() {
    for(var i = 0; i < NUM_PLAYERS; i++) {
        (new Player(i));
    }
}

function setup_listeners() {
    var roll_dice_btn = document.getElementById("roll_dice");
    roll_dice_btn.addEventListener("click", on_roll_dice);
    
    var next_phase_btn = document.getElementById("next_phase");
    next_phase_btn.addEventListener("click", on_next_phase);
}

function init() {
    NUM_TO_PHASE = inverted(PHASES);
    
    PHASE_INIT_FUNCTIONS[PHASES["PRE_ROLL"]] = init_pre_roll_phase;
    PHASE_INIT_FUNCTIONS[PHASES["ROLL"]] = init_roll_phase;
    PHASE_INIT_FUNCTIONS[PHASES["PRE_RESOLVE"]] = init_pre_resolve_phase;
    PHASE_INIT_FUNCTIONS[PHASES["RESOLVE_DICE"]] = init_resolve_dice_phase;
    PHASE_INIT_FUNCTIONS[PHASES["BUY_CARDS"]] = init_buy_cards_phase;
    PHASE_INIT_FUNCTIONS[PHASES["END_TURN"]] = init_end_turn_phase;
    
    PHASE_END_FUNCTIONS[PHASES["PRE_ROLL"]] = end_pre_roll_phase;
    PHASE_END_FUNCTIONS[PHASES["ROLL"]] = end_roll_phase;
    PHASE_END_FUNCTIONS[PHASES["PRE_RESOLVE"]] = end_pre_resolve_phase;
    PHASE_END_FUNCTIONS[PHASES["RESOLVE_DICE"]] = end_resolve_dice_phase;
    PHASE_END_FUNCTIONS[PHASES["BUY_CARDS"]] = end_buy_cards_phase;
    PHASE_END_FUNCTIONS[PHASES["END_TURN"]] = end_end_turn_phase;
}

function main() {
    init();
    setup_listeners();
    setup_players();
    start_game();
}

document.addEventListener("DOMContentLoaded", main);
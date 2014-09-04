var NUM_DICE = 6;
var ROLL = 0;

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

function on_roll_dice() {
    if (ROLL >= 3) return;
    
    var roll_count = 0;
    
    for(var i = 1; i <= NUM_DICE; i++) {
        var die_checkbox = document.getElementById("select_die" + i);
        var die_img = document.getElementById("die" + i);
        
        if (!die_checkbox.checked) {
            roll_count++;
            die_img.src = "assets/dice/die_" + randomChoice(["one", "two", "three", "energy", "slap", "heart"]) + ".png";
        }
        
        die_checkbox.disabled = false;
    }
    if (roll_count <= 0) return;
    ROLL++;    
    var roll_number_span = document.getElementById("roll_number");
    var rolls_left_span = document.getElementById("rolls_left");
    roll_number_span.innerHTML = ROLL;
    rolls_left_span.innerHTML = 3-ROLL;
    
    if (ROLL >= 3) {
    
        for(var i = 1; i <= NUM_DICE; i++) {
            var die_checkbox = document.getElementById("select_die" + i);
            
            die_checkbox.checked = true;
            die_checkbox.disabled = true;
            
        }
        
    }
}

function main() {
    var roll_dice_btn = document.getElementById("roll_dice");
    roll_dice_btn.addEventListener("click", on_roll_dice);
}

document.addEventListener("DOMContentLoaded", main);
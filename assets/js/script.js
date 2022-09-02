const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
var canvas_width = canvas.clientWidth;
var canvas_height = canvas.clientHeight;

function resize() {
    canvas_width = canvas.width = window.innerWidth - window.innerWidth * 0.20;
    canvas_height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

var game = new Game(60);

Utilities.load_json('assets/json/settings/settings.json', (response) => {
    var settings = null;

    try {
        settings = JSON.parse(response);
    } catch (error) {
        createToast('No se han podido obtener los ajustes del juego', 'error');
    }
    
    if (settings !== null) {
        createToast('Se ha iniciado el juego con los ajustes recibidos', 'success');
    }
    
    create_range_sliders(settings);
    game.start_game(settings);
}, (error) => {
    createToast(error, 'error');
});

canvas.onmousemove = function (e) {
    var rect = this.getBoundingClientRect(),
        screen_x = Math.floor(e.clientX - rect.left),
        screen_y = Math.floor(e.clientY - rect.top);
};

canvas.onmousedown = function (e) {
    var rect = this.getBoundingClientRect(),
        screen_x = Math.floor(e.clientX - rect.left),
        screen_y = Math.floor(e.clientY - rect.top);
}

function show_confirmation_dialbox(
    title = "Do you want to confirm this?",
    confirm_text = "Yes",
    decline_text = "No",
    confirm_action = () => { },
    decline_action = hide_confirmation_dialbox
) {
    var confirmation_dialbox = document.getElementById("confirmation-dialbox");
    var confirmation_confirm = document.getElementById("confirmation-confirm");
    var confirmation_decline = document.getElementById("confirmation-decline");
    var confirmation_title = document.getElementById("confirmation-title");
    var content = document.getElementById("content");

    content.classList.add("blur");
    confirmation_dialbox.classList.add("active");
    confirmation_title.innerHTML = title;
    confirmation_confirm.innerText = confirm_text;
    confirmation_decline.innerText = decline_text;

    confirmation_confirm.onclick = confirm_action;
    confirmation_decline.onclick = decline_action;
}

function hide_confirmation_dialbox() {
    var confirmation_dialbox = document.getElementById("confirmation-dialbox");
    var confirmation_confirm = document.getElementById("confirmation-confirm");
    var confirmation_decline = document.getElementById("confirmation-decline");
    var confirmation_title = document.getElementById("confirmation-title");
    var content = document.getElementById("content");

    content.classList.remove("blur");
    confirmation_dialbox.classList.remove("active");

    setTimeout(() => {
        confirmation_title.innerText = "";
        confirmation_confirm.innerText = "";
        confirmation_decline.innerText = "";
        confirmation_confirm.onclick = null;
    }, 500);
}

async function task(action = () => { }) {
    await timer(0);
    action();
}

function timer(ms) { return new Promise(res => setTimeout(res, ms)); }

function reset_game() {
    game.random_start();
}

function create_range_sliders(settings = null) {
    if (settings === null) return;
    if (settings.length === 0) return;

    var life_settings_container = document.getElementById("life-settings");

    settings.forEach(setting => {
        var setting_template =
        '<div class="setting">' +
            '<span class="setting-name">' + setting.color + '</span>' +
            '<div class="range-container">' +
                '<span class="range-value">' + setting.amount + '</span>' +
                '<input type="range" data-color="' + setting.color + '" data-amount="' + setting.amount + '" class="range" value="' + setting.amount +'" min="0" max="1000" step="1" oninput="update_range(this, this.value)"></input>' +
            '</div>';
                
        setting.rules.forEach(rule => {
            setting_template +=
            '<div class="range-container">' +
                '<span class="range-value">' + rule.value + '</span>' +
                '<input type="range" data-color="' + setting.color + '" data-rule_color="' + rule.color + '" data-value="' + rule.value + '" class="range" value="' + rule.value + '" min="-1" max="1" step="0.01" oninput="update_range(this, this.value)"></input>' +
            '</div>';
        });
                
        setting_template += '</div>';
        life_settings_container.insertAdjacentHTML('beforeend', setting_template);
    });
}

function update_range(range, value) {
    var range_value_element = range.parentNode.firstElementChild;
    range_value_element.innerHTML = value;

    var dataset = range.dataset;
    if (dataset.amount) {
        dataset.amount = value;
    }

    if (dataset.value) {
        dataset.value = value;
    }

    game.update_settings(dataset);
}
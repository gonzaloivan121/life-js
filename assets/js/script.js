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

Utilities.load_json('assets/json/info/info.json', (response) => {
    var info = null;

    try {
        info = JSON.parse(response);
    } catch (error) {
        createToast('No se ha podido obtener la información sobre las redes sociales', 'error');
    }

    if (info !== null) {
        generate_info_modal(info);
    }
}, (error) => {
    createToast(error, TOAST_TYPE.ERROR);
});

Utilities.load_json('assets/json/settings/settings.json', (response) => {
    var settings = null;

    try {
        settings = JSON.parse(response);
    } catch (error) {
        createToast('No se han podido obtener los ajustes del juego', TOAST_TYPE.ERROR);
    }
    
    if (settings !== null) {
        create_range_sliders(settings);
        game.start_game(settings);
        createToast('Se ha iniciado el juego con los ajustes recibidos', TOAST_TYPE.SUCCESS);
    }
}, (error) => {
    createToast(error, TOAST_TYPE.ERROR);
});

/**
 * 
 * @param {{description: string, socials: [{name: string, icon: string, url: string}]}} info 
 * @returns 
 */
function generate_info_modal(info = null) {
    if (info === null) return;

    var info_description_element = document.getElementById("info-description");
    var info_buttons_element = document.getElementById("info-buttons");

    info_description_element.innerText = info.description;

    info.socials.forEach(social => {
        const button = document.createElement('button');
        const img = document.createElement('img');

        img.src = social.icon;
        img.height = "25";

        button.classList.add('button');
        button.classList.add('box-shadow');

        if (social.url) {
            button.onclick = () => {
                window.open(social.url, '_blank').focus();
            }
        } else {
            const share_data = {
                title: 'Life JS',
                text: social.share_text,
                url: window.location.href
            };
            button.onclick = () => {
                navigator.share(share_data);
            }
        }

        button.innerText = social.name;
        button.prepend(img);

        info_buttons_element.appendChild(button);
    });
}

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

function show_upload_modal() {
    var upload_modal = document.getElementById("upload-modal");
    var content = document.getElementById("content");
    upload_modal.classList.add("active");
    content.classList.add("blur");
}

function hide_upload_modal() {
    var upload_modal = document.getElementById("upload-modal");
    var content = document.getElementById("content");
    upload_modal.classList.remove("active");
    content.classList.remove("blur");
}

function show_info_modal() {
    var info_modal = document.getElementById("info-modal");
    var content = document.getElementById("content");
    info_modal.classList.add("active");
    content.classList.add("blur");
}

function hide_info_modal() {
    var info_modal = document.getElementById("info-modal");
    var content = document.getElementById("content");
    info_modal.classList.remove("active");
    content.classList.remove("blur");
}

async function task(action = () => { }) {
    await timer(0);
    action();
}

function timer(ms) { return new Promise(res => setTimeout(res, ms)); }

function reset_game() {
    Utilities.load_json('assets/json/settings/settings.json', (response) => {
        var data = null;
        var success = true;

        try {
            data = JSON.parse(response);
            console.log(data)
        } catch (error) {
            success = false;
            createToast('There has been an error resetting the simulation', TOAST_TYPE.ERROR);
        }

        if (success) {
            game.settings = data;
            regenerate_range_sliders();
            game.random_start();
            toogle_pannel();
        }
    });
}

function show_save_confirmation() {
    show_confirmation_dialbox(
        'Do you want to save these settings?',
        'Yes, save them!',
        'No, I don\'t think I will...',
        () => {
            save_settings();
            hide_confirmation_dialbox();
        },
        () => {
            createToast('Settings not saved', TOAST_TYPE.WARNING);
            hide_confirmation_dialbox();
        }
    );
}
    
function save_settings() {
    var colors = [];
    game.settings.forEach(setting => {
        colors.push(setting.color);
    });

    var data = {
        settings: game.settings,
        particles: game.particles
    }
    
    if (Utilities.download_json(data)) {
        createToast('Settings saved!', TOAST_TYPE.SUCCESS);
    } else {
        createToast('Settings not saved', TOAST_TYPE.WARNING);
    }
}

function test_load() {
    load_settings('assets/json/saves/1662252386989.json');
}

function load_settings(url = null, json = null) {
    var result = { success: false, message: null };
    if (url === null) {
        if (json === null) return;
        result.success = game.load_all_settings(json);
        
        if (result.success) {
            createToast('Settings loaded succesfully', TOAST_TYPE.SUCCESS);
            regenerate_range_sliders();
        } else {
            createToast('There has been an error loading these settings', TOAST_TYPE.WARNING);
        }

        hide_upload_modal();
    }

    Utilities.load_json(url, (response) => {
        var data;
        try {
            data = JSON.parse(response);
        } catch (error) {
            createToast('There has been an error loading these settings', TOAST_TYPE.WARNING);
        }
    
        game.load_all_settings(data);
        regenerate_range_sliders();
    });
}

function regenerate_range_sliders() {
    var life_settings_container = document.getElementById("life-settings");
    life_settings_container.textContent = '';
    create_range_sliders(game.settings);
}

function create_range_sliders(settings = null) {
    if (settings === null) return;
    if (settings.length === 0) return;

    var life_settings_container = document.getElementById("life-settings");

    settings.forEach(setting => {
        var setting_template =
        '<div class="setting" id="' + setting.color + '-setting">' +
            '<span class="setting-name">' + setting.color + '</span>';

            setting_template += create_amount_range_template(setting.color, setting.amount);
            setting_template += create_attraction_range_template(setting.color, setting.range);
                
        setting.rules.forEach(rule => {
            setting_template += create_rule_range_template(setting.color, rule);
        });

        setting_template += create_add_rule_button(setting.color);  
        setting_template += '</div>';

        life_settings_container.insertAdjacentHTML('beforeend', setting_template);
    });
}

function create_attraction_range_template(color, range) {
    return '<div class="range-container tooltip">' +
        '<span class="range-value">' + range + '</span>' +
        '<span class="tooltip-text">Range of attraction for <strong style="color: ' + color + ';">' + color + '</strong> particles</span>' +
        '<input type="range" data-color="' + color + '" data-range="' + range + '" class="range" value="' + range + '" min="0" max="100" step="1" oninput="update_range(this, this.value, \'range\')"></input>' +
    '</div>';
}

function create_amount_range_template(color, amount) {
    return '<div class="range-container tooltip">' +
        '<span class="range-value">' + amount + '</span>' +
        '<span class="tooltip-text">Amount of <strong style="color: ' + color + ';">' + color + '</strong> particles</span>' +
        '<input type="range" data-color="' + color + '" data-amount="' + amount + '" class="range" value="' + amount +'" min="0" max="1000" step="1" oninput="update_range(this, this.value, \'amount\')"></input>' +
    '</div>';
}

function create_rule_range_template(color, rule) {
    return '<div class="range-container tooltip">' +
        '<span class="range-value">' + rule.value + '</span>' +
        '<span class="tooltip-text">How much <strong style="color: ' + color + ';">' + color + '</strong> particles attract to <strong style="color: ' + rule.color + ';">' + rule.color + '</strong> particles</span>' +
        '<input type="range" data-color="' + color + '" data-rule_color="' + rule.color + '" data-value="' + rule.value + '" class="range" value="' + rule.value + '" min="-1" max="1" step="0.01" oninput="update_range(this, this.value, \'attraction\')"></input>' +
    '</div>';
}

function create_add_rule_button(color) {
    return '<div class="range-container" id="add-' + color + '-rule">' +
        '<div><button class="button" onclick="add_select_rule(\'' + color + '\')">+</button></div>' +
    '</div>';
}

function update_range(range_element, value, type) {
    var range_value_element = range_element.parentNode.firstElementChild;
    range_value_element.innerHTML = value;

    var dataset = range_element.dataset;
    if (dataset.amount) {
        dataset.amount = value;
    }

    if (dataset.value) {
        dataset.value = value;
    }

    if (dataset.range) {
        dataset.range = value;
    }

    game.update_settings(dataset, type);
}

function add_select_rule(color) {
    var color_setting = document.getElementById(color + "-setting");
    var add_rule_button = document.getElementById("add-" + color + "-rule");

    var select_template =
    '<div class="range-container select" id="select-' + color + '-rule">' +
        '<select class="custom-select" onchange="add_rule(\'' + color + '\', this.value)">' +
            '<option hidden selected>Select an option</option>';
    
    var added_colors = [];

    game.settings.forEach(setting => {
        if (setting.color === color) {
            setting.rules.forEach(rule => {
                added_colors.push(rule.color);
            });
        }
    });

    game.colors.forEach((game_color) => {
        if (!added_colors.includes(game_color)) {
            select_template += '<option value="' + game_color + '">' + Utilities.capitalize(game_color) + '</option>';
        }
    });

    select_template += '<option value="">Cancel</option>';

    select_template +=
        '</select>' +
    '</div>';

    add_rule_button.remove();

    color_setting.insertAdjacentHTML('beforeend', select_template);
    color_setting.insertAdjacentHTML('beforeend', create_add_rule_button(color));
}

function add_rule(color, rule_color) {
    var select_color_rule = document.getElementById("select-" + color + "-rule");

    if (rule_color === '') {
        select_color_rule.remove();
        return;
    }

    var color_setting = document.getElementById(color + "-setting");
    var add_rule_button = document.getElementById("add-" + color + "-rule");

    var new_rule = game.add_new_rule(color, rule_color);
    
    select_color_rule.remove();
    add_rule_button.remove();

    var added_colors = [];

    game.settings.forEach(setting => {
        if (setting.color === color) {
            setting.rules.forEach(rule => {
                added_colors.push(rule.color);
            });
        }
    });

    color_setting.insertAdjacentHTML('beforeend', create_rule_range_template(color, new_rule));

    if (added_colors.length !== game.colors.length) {
        color_setting.insertAdjacentHTML('beforeend', create_add_rule_button(color));
    }
}

function upload_settings(element) {
    if (element.files.length > 0) {
        Utilities.upload_json(element.files[0], (response) => {
            var data;

            try {
                data = JSON.parse(response);
            } catch (error) {
                createToast('File is not in JSON format', TOAST_TYPE.ERROR);
            }

            load_settings(null, data);
        })
    }
}

function toogle_pannel() {
    var pannel = document.getElementById("pannel");
    if (pannel.classList.contains("active")) {
        pannel.classList.remove("active");
    } else {
        pannel.classList.add("active");
    }
}
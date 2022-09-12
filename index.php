<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Primary Meta Tags -->
    <title>Life JS</title>
    <meta name="title" content="Life JS">
    <meta name="description" content="Life JS is a small simulation where life can form as cells. Play around with the sliders and see what happens!">
    <meta name="author" content="Gonzalo Iván Chaparro Barese">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://gonzaloivan121.github.io/isomatrix-js/">
    <meta property="og:title" content="Life JS">
    <meta property="og:description"
        content="Life JS is a small simulation where life can form as cells. Play around with the sliders and see what happens!">
    <meta property="og:image" content="https://gonzaloivan121.github.io/isomatrix-js/assets/img/content.png">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://gonzaloivan121.github.io/isomatrix-js/">
    <meta property="twitter:title" content="Life JS">
    <meta property="twitter:description"
        content="Life JS is a small simulation where life can form as cells. Play around with the sliders and see what happens!">
    <meta property="twitter:image" content="https://gonzaloivan121.github.io/isomatrix-js/assets/img/content.png">
    
    <link rel="stylesheet" href="./assets/css/styles.css">
</head>

<body>
    <div id="toast"></div>
    <!-- START CONTENT -->
    <div class="content" id="content">
        <div class="menu-button-container" onclick="toogle_pannel()">
            <div class="menu-button"></div>
        </div>
        <div class="menu-info-container" onclick="show_info_modal()">
            <img src="assets/svg/icons/info.svg" height="30" width="30">
        </div>
        <!-- START PANNEL -->
        <div class="pannel" id="pannel">
            <div class="title">Life Settings</div>
            <div class="settings" id="life-settings">
                <!-- Insert settings via script -->
            </div>
            <div class="buttons">
                <button class="button box-shadow" onclick="reset_game()">Reset</button>
                <button class="button box-shadow" onclick="show_save_confirmation()">Save Settings</button>
                <button class="button box-shadow" onclick="show_upload_modal()">Load Settings</button>
            </div>
        </div>
        <!-- END PANNEL -->
        <!-- START CANVAS -->
        <canvas id="canvas" class="canvas" width="1200" height="628"></canvas>
        <!-- END CANVAS -->
    </div>
    <!-- END CONTENT -->
    <!-- START CONFIRMATION DIALBOX -->
    <div id="confirmation-dialbox" class="confirmation-dialbox box-shadow">
        <div class="header">
            <div class="confirmation-close" onclick="hide_confirmation_dialbox()">X</div>
        </div>
        <div class="container">
            <div class="confirmation-title" id="confirmation-title"></div>
        </div>
        <div class="footer">
            <button id="confirmation-confirm" class="button box-shadow" onclick="">Yes</button>
            <button id="confirmation-decline" class="button box-shadow" onclick="hide_confirmation_dialbox()">No</button>
        </div>
    </div>
    <!-- END CONFIRMATION DIALBOX -->
    <!-- START UPLOAD MODAL -->
    <div id="upload-modal" class="upload-modal box-shadow">
        <div class="header">
            <div class="modal-close" onclick="hide_upload_modal()">X</div>
        </div>
        <div class="container">
            <input type="file" id="file_upload" accept="application/json" onchange="upload_settings(this)">
        </div>
    </div>
    <!-- END UPLOAD MODAL -->
    <!-- START INFO MODAL -->
    <div id="info-modal" class="info-modal box-shadow">
        <div class="header">
            <div class="modal-close" onclick="hide_info_modal()">X</div>
        </div>
        <div class="container">
            <p style="text-align: center;" id="info-description"></p>
        </div>
        <div class="footer" id="info-buttons">
            <!-- Insert buttons via script -->
        </div>
    </div>
    <!-- END INFO MODAL -->

    <!-- START IMPORTING SCRIPTS -->
    <script src="./assets/js/toast.js"></script>
    <script src="./assets/js/game/vector.js"></script>
    <script src="./assets/js/game/particle.js"></script>
    <script src="./assets/js/game/utilities.js"></script>
    <script src="./assets/js/game/input.js"></script>
    <script src="./assets/js/game/rule.js"></script>
    <script src="./assets/js/game/game.js"></script>
    <script src="./assets/js/script.js"></script>
    <!-- END IMPORTING SCRIPTS -->
</body>
const Text = {
    init() {
        this._fill();
    },

    _fill(){

        // fill use-keyboard-input and disable for copy and paste
        var myInput = document.getElementById('content');
        var text = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus culpa et quod reiciendis ullam sit aperiam libero laboriosam error distinctio repellendus omnis, quos perferendis facere sed! Minus fuga molestiae magni?";

        myInput.readOnly = "true";
        myInput.innerHTML = text;
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Text.init();
});


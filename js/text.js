const Text = {
    init() {
        this._fill();
    },

    _fill(){
        var myInput = document.getElementById('textcontent');
        var text = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus culpa et quod reiciendis ullam sit aperiam libero laboriosam error distinctio repellendus omnis, quos perferendis facere sed! Minus fuga molestiae magni?";

        myInput.readOnly = "true";
        myInput.innerHTML = text;
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Text.init();
});


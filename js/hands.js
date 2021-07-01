const Hands = {
    init() {
        // Select container
        const hands = document.querySelectorAll(".hands");
    },

    open() {
        document.querySelectorAll(".hands").forEach(function(element) {
            element.classList.add("hands--show");
        });
    },

    close() {
        document.querySelectorAll(".hands").forEach(function(element) {
            element.classList.remove("hands--show");
        });
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Hands.init();
});
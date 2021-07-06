const Hands = {
    init() {
        document.querySelectorAll("circle").forEach(element=> {
            this.fingerAnimation(element);
        });
    },

    fingerAnimation(element){
        transition.begin(element, [
            ["transform", "translateY(0)", "translateY(0px)", "1s", "ease-in-out"],
            ["fill", "#cf3e3e", "#E9E9E9", "500ms", "linear"],
            ["stroke", "#cf3e3e", "#5f5f5f", "500ms", "linear"],
            //["transform", "scale(1)", "scale(0.5)"]
        ]);
    },

    open() {
        document.querySelectorAll(".content-hands").forEach(element=> {
            element.classList.add("content-hands--show");
        });
    },

    close() {
        document.querySelectorAll(".content-hands").forEach(element=> {
            element.classList.remove("content-hands--show");
        });
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Hands.init();
});
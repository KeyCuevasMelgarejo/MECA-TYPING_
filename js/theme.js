const Theme = {
    colores: {
        properties: [
            {name: "default", one: "#1f1f1f", two: "#5f5f5f", three: "#E9E9E9", four: "#cf3e3e", five:"#1a0b0c"},
            {name: "vintage", one: "#6B0C22", two: "#D9042B", three: "#F4CB89", four: "#588C8C", five:"#011C26"},
            {name: "selva", one: "#052613", two: "#07593B", three: "#06BF69", four: "#078C5B", five:"#0D0D0D"},
            {name: "acuario", one: "#25252B", two: "#06BF69", three: "#2E2E35", four: "#18C09A", five:"#0B857D"}
        ]
    },

    init() {        
        let theme = JSON.parse(localStorage.getItem('theme'));
        if(theme){
            switch(theme.name){
                case "default":counterTheme=0;break;
                case "vintage":counterTheme=1;break;
                case "selva":counterTheme=2;break;
                case "acuario":counterTheme=3;break;
            }
            this.previousSelectedTheme(theme);
        }
    },

    previousSelectedTheme(theme){
        this._elements(theme);
    },

    changeTheme(){
        counterTheme++;
        counterTheme = counterTheme==4 ? 0 : counterTheme;
        theme=this.colores.properties[counterTheme];
        this._elements(theme);
        localStorage.setItem('theme',JSON.stringify(theme));
    },

    _elements(theme){
        let root = document.documentElement;
        root.style.setProperty('--color-uno', theme.one);
        root.style.setProperty('--color-dos', theme.two);
        root.style.setProperty('--color-tres', theme.three);
        root.style.setProperty('--color-cuatro', theme.four);
        root.style.setProperty('--color-cinco', theme.five);
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Theme.init();
});

document.querySelector('#switch-theme').onchange = function (e) {
    Theme.changeTheme();
};
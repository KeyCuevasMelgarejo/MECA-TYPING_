const Hands = {  
    fingers: {
        properties: [
            {name: "meniqueL", r: "5%", cx: "7.8mm", cy: "44mm"},
            {name: "anularL", r: "6%", cx: "29mm", cy: "19mm"},
            {name: "medioL", r: "6%", cx: "60mm", cy: "9mm"},
            {name: "indiceL", r: "6%", cx: "93.5mm", cy: "17mm"},
            {name: "gordoL", r: "5.5%", cx: "122.5mm", cy: "73.9mm"},
            {name: "meniqueR", r: "5%", cx: "7.8mm", cy: "44mm"},
            {name: "anularR", r: "6%", cx: "29mm", cy: "19mm"},
            {name: "medioR", r: "6%", cx: "60mm", cy: "9mm"},
            {name: "indiceR", r: "6%", cx: "93.5mm", cy: "17mm"},
            {name: "gordoR", r: "5.5%", cx: "122.5mm", cy: "73.9mm"},
        ]
    },

    fingerAnimation(fingerPending){
        var palma;
        var element = document.querySelector(fingerPending);
        var r = element.getAttribute("r");
        var cx = element.getAttribute("cx");
        var cy = element.getAttribute("cy");

        this.fingers.properties.forEach(finger=>{
            if(finger.name==element.className.animVal){
                // effect for hand
                if(element.className.animVal.slice(-1)=="R"){
                    palma = document.querySelector(".palmaR");
                    this._handAnimation(palma);
                }else if(element.className.animVal.slice(-1)=="L"){
                    palma = document.querySelector(".palmaL");
                    this._handAnimation(palma);
                }

                // effect for finger(s)
                transition.begin(element, [
                    {property: "r", from: r, to: finger.r},
                    {property: "cx", from: cx, to: finger.cx},
                    {property: "cy", from: cy, to: finger.cy},
                    ["fill", "#f9cfac", "#cf3e3e", "300ms"],
                    ["stroke", "#5f5f5f", "#f9cfac", "300ms"]
                ], {
                    // Both "property" transitions will use "linear" timing function
                    timingFunction: "linear",
                    // Only "property" will use "400ms" duration, the "fill" and "stroke" transitions define
                    // their own duration of "300ms"
                    duration: "300ms"
                });
            }
        });
    },

    fingerReturn(fingerPending){
        var palma;
        var element = document.querySelector(fingerPending);
        var r = element.getAttribute("r");
        var cx = element.getAttribute("cx");
        var cy = element.getAttribute("cy");

        this.fingers.properties.forEach(finger=>{
            if(finger.name==element.className.animVal){
                if(element.className.animVal.slice(-1)=="R"){
                    palma = document.querySelector(".palmaR");
                    this._handReturn(palma);
                }else if(element.className.animVal.slice(-1)=="L"){
                    palma = document.querySelector(".palmaL");
                    this._handReturn(palma);
                }

                transition.begin(element, [
                    {property: "r", from: finger.r, to: r},
                    {property: "cx", from: finger.cx, to: cx},
                    {property: "cy", from: finger.cy, to: cy},
                    ["fill", "#cf3e3e", "#f9cfac"],
                    ["stroke", "#f9cfac", "#5f5f5f"]
                ], {
                    timingFunction: "linear",
                    duration: "100ms"
                });
            }
        });
    },

    _handAnimation(palma){
        transition.begin(palma, [
            {property: "fill", from: "#cf3e3e", to: "#662B2F"}
        ])
    },

    _handReturn(palma){
        transition.begin(palma, [
            {property: "fill", from: "#662B2F", to: "#cf3e3e"}
        ])
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

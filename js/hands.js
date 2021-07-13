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
        var element = document.querySelector(fingerPending);
        var r = element.getAttribute("r");
        var cx = element.getAttribute("cx");
        var cy = element.getAttribute("cy");

        this.fingers.properties.forEach(finger=>{
            if(finger.name==element.className.animVal){
                transition.begin(element, [
                    {property: "r", from: r, to: finger.r},
                    {property: "cx", from: cx, to: finger.cx},
                    {property: "cy", from: cy, to: finger.cy},
                    ["fill", "#E9E9E9", "#3CD2E6", "300ms"],
                    ["stroke", "#5f5f5f", "#E9E9E9", "300ms"]
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
        var element = document.querySelector(fingerPending);
        var r = element.getAttribute("r");
        var cx = element.getAttribute("cx");
        var cy = element.getAttribute("cy");

        this.fingers.properties.forEach(finger=>{
            if(finger.name==element.className.animVal){
                transition.begin(element, [
                    {property: "r", from: finger.r, to: r},
                    {property: "cx", from: finger.cx, to: cx},
                    {property: "cy", from: finger.cy, to: cy},
                    ["fill", "#3CD2E6", "#E9E9E9"],
                    ["stroke", "#E9E9E9", "#5f5f5f"]
                ], {
                    timingFunction: "linear",
                    duration: "100ms"
                });
            }
        });
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

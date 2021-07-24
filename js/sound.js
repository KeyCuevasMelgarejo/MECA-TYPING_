const Sound = {
    play(track){
        var keypressSound=null;
        switch(track){
            case "keypress":
                keypressSound = new Audio("./audio/keypress.mp3");
                keypressSound.volume = 1;
                break;
            case "success":
                keypressSound = new Audio("./audio/success.mp3");
                keypressSound.volume = 0.2;
                break;
            case "badkeypressed":
                keypressSound = new Audio("./audio/badkeypressed.mp3");
                keypressSound.volume = 1;
                break;
        }
        var promise=keypressSound.play();
        if (promise) {
            //Older browsers may not return a promise, according to the MDN website
            promise.catch(function(error) { console.error(error); });
        }
    }
};
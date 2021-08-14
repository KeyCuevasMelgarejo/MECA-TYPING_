const Text = {
    // 'parts' are pdfs pieces divided by titles and belong to just one book
    idiomas: {
        properties: [
            {name: "castellano", parts:[1,2,4,6,8,10,12,14,16,18,20]},
            {name: "quechua", parts:[3,5,7,9,11,13,15,17,19]},
            {name: "aymara", parts:[1,2,3,5,7,8,11]}
        ]
    },

    init() {
        // especify worker path
        PDFJS.workerSrc = '../lib/pdf/pdf.worker.min.js';
        // disable for copy and paste
        writeInput.readOnly = "true";
        placeHolderInput.readOnly= "true";
        
        // fill use-content-text
        let idiom = JSON.parse(localStorage.getItem('idiom'));
        if(idiom){
            switch(idiom.name){
                case "castellano":counterIdiom=0;break;
                case "quechua":counterIdiom=1;break;
                case "aymara":counterIdiom=2;break;
            }
            this._fillContent(idiom)
        }else{
            this._fillContent(this.idiomas.properties[counterIdiom]);
        }
    },

    // for characters
    // compare placeHolderInput and WriteInput 
    compareText(placeHolderInput, writeInput){
        let writeInputLenght = writeInput.length;
        // on 'enter' key case asign '\n', in other way, a 'character'
        let nextWord = (placeHolderInput.innerHTML.charAt(writeInputLenght) && placeHolderInput.innerHTML[writeInputLenght].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght));
        let previousWord = (placeHolderInput.innerHTML.charAt(writeInputLenght-1) && placeHolderInput.innerHTML[writeInputLenght-1].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght-1));

        let okNextWord = false;
        
        if(writeInput.slice(-1)==placeHolderInput.innerHTML.charAt(writeInputLenght - 1)){
            if(writeInputLenght!=0){
                Sound.play("keypress");
                let resultToCompare = placeHolderInput.value.localeCompare(writeInput);

                okNextWord = true;

                // some special cases
                this._specialWordsIndicateTop(nextWord);
          
                this._decoloringPreviousKey(previousWord);
                if(Keyboard.properties.shift && is_key_down('Shift')==false){
                    Keyboard._toggleShift();
                }
                this._coloringPendingKey(nextWord);

                // session ends when you complete all words successfully
                if(resultToCompare==0){
                    Sound.play("success");
                    placeHolderInput.classList.toggle("sucess");
                    // message after complete the session correctly
                    alerta.querySelector("div").innerHTML='<strong>¡Muy bien!</strong> Has completado la sesión';
                    alerta.style="display:block";
                    
                    this._specialWordsIndicateTop(null);
                    setTimeout(function() {
                        Keyboard.close();
                        placeHolderInput.classList.toggle("sucess");
                    }, 200);
                }
            }else{
                this._specialWordsIndicateTop(nextWord);
                this._coloringPendingKey(nextWord);
            }
        }else{  
            Sound.play("badkeypressed");
            // that's my solution to toggle, remove and toggle again after error
            placeHolderInput.classList.toggle("error");
            setTimeout(function() {
                placeHolderInput.classList.toggle("error");
            }, 200);
        }

        return okNextWord;
    },

    // for backspace
    removeText(placeHolderInput, writeInput){
        Sound.play("keypress");

        let writeInputLenght = writeInput.length;
        let previousColoredWord = (placeHolderInput.innerHTML.charAt(writeInputLenght+1) && placeHolderInput.innerHTML[writeInputLenght+1].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght+1));
        let previousWord = (placeHolderInput.innerHTML.charAt(writeInputLenght) && placeHolderInput.innerHTML[writeInputLenght].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght));

        this._specialWordsIndicateTop(previousWord);
        this._decoloringPreviousKey(previousColoredWord);
        this._coloringPendingKey(previousWord);
    },

    // for erase
    removeAllText(placeHolderInput){
        let previousWord = placeHolderInput.innerHTML.charAt(0);
        let keyboardKey = document.querySelectorAll(".keyboard__key"); 
        let fingers = document.querySelectorAll("circle");

        this._specialWordsIndicateTop(previousWord);

        //remove all pendingColors
        keyboardKey.forEach(key => {
            key.classList.remove("keyboard__key--pending");
        });

        //remove all pendingColors finger
        fingers.forEach(finger => {
            Hands.fingerReturn("."+finger.className.animVal);
        });

        this._coloringPendingKey(previousWord);
    },

    undo(placeHolderInput,writeInput){
        let writeInputLenght = writeInput.length;
        let previousWord = (placeHolderInput.innerHTML.charAt(writeInputLenght) && placeHolderInput.innerHTML[writeInputLenght].match(/\n/gm)!==null ? '\\n' :placeHolderInput.innerHTML.charAt(writeInputLenght));
        let keyboardKey = document.querySelectorAll(".keyboard__key"); 
        let fingers = document.querySelectorAll("circle");

        this._specialWordsIndicateTop(previousWord);
        
        //remove all pendingColors key
        keyboardKey.forEach(key => {
            key.classList.remove("keyboard__key--pending");
        });

        //remove all pendingColors finger
        fingers.forEach(finger => {
            Hands.fingerReturn("."+finger.className.animVal);
        });

        this._coloringPendingKey(previousWord);
    },

    changeIdiom(){
        counterIdiom++;
        counterIdiom = counterIdiom==3 ? 0 : counterIdiom;
        idiom=this.idiomas.properties[counterIdiom];
        this._fillContent(idiom);
        localStorage.setItem('idiom',JSON.stringify(idiom));
    },

    _coloringPendingKey(letra){
        let keyboardKey = document.querySelectorAll(".keyboard__key");   
        keyboardKey.forEach(key => {
            // add color to 'shift' key when 'letra' is on LowerCase
            if((key.innerText=="keyboard_arrow_up" && letra!=letra.toLowerCase() && Keyboard.properties.shift==false)
            ||(key.innerText=="keyboard_arrow_up" 
            && (letra=="!" || letra=="\"" || letra=="\/" || letra=="\(" || letra=="\)" || letra=="?" || letra=="¿" || letra=="\;" || letra=="\:" || letra=="\_"))){
                key.classList.add("keyboard__key--pending");
                Keyboard.properties.shiftPending=true;
                isMobile==true ? Hands.fingerAnimation(".meniqueL") : Hands.fingerAnimation(".meniqueR");
            }

            // look for words with 'tilde', 'apostrophe', etc; add color and animation
            if(key.innerText=="´" && letra.normalize("NFD").match(/[\u0300-\u036f]/g)){
                key.classList.add("keyboard__key--pending");
                Hands.fingerAnimation(".meniqueR");
            }

            // add color to the key which represents next word to type 
            if(key.innerText=="keyboard_return" && letra=='\\n'){
                key.classList.add("keyboard__key--pending");
                Hands.fingerAnimation(".meniqueR");
            }else if(key.innerText=="space_bar" && letra==" "){
                key.classList.add("keyboard__key--pending");
                Hands.fingerAnimation(".gordoR");
            }else if((key.innerText=="'" && letra=="?") 
            || (key.innerText=="1" && letra=="!")
            || (key.innerText=="2" && letra=="\"")
            || (key.innerText=="7" && letra=="\/")
            || (key.innerText=="8" && letra=="\(")
            || (key.innerText=="9" && letra=="\)")
            || (key.innerText=="¡" && letra=="¿")
            || (key.innerText=="," && letra=="\;")
            || (key.innerText=="." && letra=="\:")
            || (key.innerText=="-" && letra=="\_")){
                key.classList.add("keyboard__key--pending");
                this._activeAnimation(letra);
            // string.normalize("NFD").replace(/[\u0300-\u036f]/g, "") remove words with tildes, apostrophe, etc
            // https://en.wikipedia.org/wiki/Combining_Diacritical_Marks
            }else if(key.innerText.toLowerCase()==letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()){
                key.classList.add("keyboard__key--pending");
                this._activeAnimation(letra.toLowerCase());
            }
        });
    },

    _decoloringPreviousKey(letra){
        let keyboardKey = document.querySelectorAll(".keyboard__key");   
        keyboardKey.forEach(key => {
            // add color to 'shift' key when 'letra' is on LowerCase
            if((key.innerText=="keyboard_arrow_up" && letra==letra.toUpperCase()) 
            ||(key.innerText=="keyboard_arrow_up" 
            && (letra=="!" || letra=="\"" || letra=="\/" || letra=="\(" || letra=="\)" || letra=="?" || letra=="¿" || letra=="\;" || letra=="\:" || letra=="\_"))){
                key.classList.remove("keyboard__key--pending");
                Keyboard.properties.shiftPending=false;
                isMobile ? Hands.fingerReturn(".meniqueL") : Hands.fingerReturn(".meniqueR");
            }

            // look for words with 'tilde', 'apostrophe', etc; add color and animation
            if(key.innerText=="´" && letra.normalize("NFD").match(/[\u0300-\u036f]/g)){
                key.classList.remove("keyboard__key--pending");
                Hands.fingerReturn(".meniqueR");
            }

            // add color to the key which represents next word to type 
            if(key.innerText=="keyboard_return" && letra=='\\n'){
                key.classList.remove("keyboard__key--pending");
                Hands.fingerReturn(".meniqueR");
            }else if(key.innerText=="space_bar" && letra==" "){
                key.classList.remove("keyboard__key--pending");
                Hands.fingerReturn(".gordoR");
            }else if((key.innerText=="'" && letra=="?") 
            || (key.innerText=="1" && letra=="!")
            || (key.innerText=="2" && letra=="\"")
            || (key.innerText=="7" && letra=="\/")
            || (key.innerText=="8" && letra=="\(")
            || (key.innerText=="9" && letra=="\)")
            || (key.innerText=="¡" && letra=="¿")
            || (key.innerText=="," && letra=="\;")
            || (key.innerText=="." && letra=="\:")
            || (key.innerText=="-" && letra=="\_")){
                key.classList.remove("keyboard__key--pending");
                this._inactiveAnimation(letra);
            }else if(key.innerText.toLowerCase()==letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()){
                key.classList.remove("keyboard__key--pending");
                this._inactiveAnimation(letra.toLowerCase());
            }
        });
    },

    _specialWordsIndicateTop(word){
        let cardText = document.querySelector('.card-text');
        switch (word){
            case "\\n":
                cardText.innerHTML='La siguiente letra es: [ <p>Enter [<i class="material-icons">keyboard_return</i>]</p> ]';
                break;
            case " ":
                cardText.innerHTML='La siguiente letra es: [ <p>Espacio [<i class="material-icons">space_bar</i>]</p> ]';
                break;
            case null:
                cardText.innerHTML="La siguiente letra es: [ <p>-Vacío-</p> ]";
                break;
            default:
                cardText.innerHTML="La siguiente letra es: [ <p>"+word+"</p> ]";
                break;
        }
    },

    _activeAnimation(word){
        switch (word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
            case "1": case "q": case "a": case "z": case "!":
                Hands.fingerAnimation(".meniqueL");
                break;
            case "2": case "w": case "s": case "x": case "\"":
                Hands.fingerAnimation(".anularL");
                break;
            case "3": case "e": case "d": case "c":
                Hands.fingerAnimation(".medioL");
                break;
            case "4": case "r": case "f": case "v":
                Hands.fingerAnimation(".indiceL");
                break;
            case "5": case "t": case "g": case "b":
                Hands.fingerAnimation(".indiceL");
                break;
            case "6": case "y": case "h": case "n":
                Hands.fingerAnimation(".indiceR");
                break;
            case "7": case "u": case "j": case "m": case "\/":
                Hands.fingerAnimation(".indiceR");
                break;
            case "8": case "i": case "k": case ",": case "\(": case "\;":
                Hands.fingerAnimation(".medioR");
                break;
            case "9": case "o": case "l": case ".": case "\)": case "\:":
                Hands.fingerAnimation(".anularR");
                break;
            case "0": case "p": case "ñ": case "-": case "\_": case "\'": case "?": case "\¡": case "¿":
                Hands.fingerAnimation(".meniqueR");
                break;
        }
    },

    _inactiveAnimation(word){
        switch (word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
            case "1": case "q": case "a": case "z": case "!":
                Hands.fingerReturn(".meniqueL");
                break;
            case "2": case "w": case "s": case "x": case "\"":
                Hands.fingerReturn(".anularL");
                break;
            case "3": case "e": case "d": case "c":
                Hands.fingerReturn(".medioL");
                break;
            case "4": case "r": case "f": case "v":
                Hands.fingerReturn(".indiceL");
                break;
            case "5": case "t": case "g": case "b":
                Hands.fingerReturn(".indiceL");
                break;
            case "6": case "y": case "h": case "n":
                Hands.fingerReturn(".indiceR");
                break;
            case "7": case "u": case "j": case "m": case "\/":
                Hands.fingerReturn(".indiceR");
                break;
            case "8": case "i": case "k": case ",": case "\(": case "\;":
                Hands.fingerReturn(".medioR");
                break;
            case "9": case "o": case "l": case ".": case "\)": case "\:":
                Hands.fingerReturn(".anularR");
                break;
            case "0": case "p": case "ñ": case "-": case "\_": case "\'": case "?": case "\¡": case "¿":
                Hands.fingerReturn(".meniqueR");
                break;
        }
    },

    async _fillContent(idiom){
        let num;
        let random;
        let PDF_URL;

        //select pdf
        switch(idiom.name){
            case 'castellano': case 'quechua':  
                random=Math.floor(Math.random() * ((idiom.parts.length-1) - 0) + 0);
                num=idiom.parts[random];
                // especify pdf path
                PDF_URL = '../books/'+idiom.name+'/'+num+'-katatay.pdf';
                break;
            case 'aymara':
                random=Math.floor(Math.random() * ((idiom.parts.length-1) - 0) + 0);
                num=idiom.parts[random];
                // especify pdf path
                PDF_URL = '../books/'+idiom.name+'/'+num+'-parlama.pdf';
                break;
        }
        
        try{
            // clear write input
            writeInput.value="";
            writeInput.innerText="";

            // extract pdf text
            let doc = await PDFJS.getDocument(PDF_URL).promise;
            let pageTexts = Array.from({length: doc.numPages}, async (v,i) => {
                return (await (await doc.getPage(i+1)).getTextContent()).items.map(token => token.str).join('');
            });
    
            // when finish extraction, fill pdf text on textarea
            let text=(await Promise.all(pageTexts)).join('');
            placeHolderInput.innerHTML = text.trim();

            // remove pending keys colors
            this.removeAllText(placeHolderInput);

            // compare both textarea to show initial pending word
            this.compareText(placeHolderInput, writeInput.value);

            // restart mementos(undo) and save actual text content
            mementos = [];
            saveMemento();

            // modify visible text on switch-idiom label small
            document.querySelector('.fa-language small').innerHTML= idiom ? '&nbsp;'+idiom.name.charAt(0).toUpperCase() + idiom.name.slice(1) : '&nbsp;Castellano';
        }catch(e){
            console.log(e.message);
            // message on error
            alerta.querySelector("div").innerHTML='<strong>¡Ups!</strong> Error al cargar el texto';
            alerta.style="display:block";
        }
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Text.init();
});

document.querySelector('#switch-idiom').onchange = function () {
    Text.changeIdiom();
};
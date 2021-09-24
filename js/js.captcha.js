function Captcha() {
    let alpha1 = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '# ','$', '%', '&', '(', ')', '=', '+', '[', ']', '{', '}', '/', '?', '<', '>'),
        alpha2 = new Array('@', '# ', '$', '%', '&', '(', ')', '=', '+', '[', ']', '{', '}', '/', '?', '<', '>'),
        alpha3 = new Array('1', '2', '3', '4', '5', '6', '7', '8', '9', '0'),
        a,b,c,d,e,f,g,
        code;

    for (let i = 0; i < 6; i++) {
        a = alpha1[Math.floor(Math.random() * alpha1.length)];
        b = alpha2[Math.floor(Math.random() * alpha2.length)];
        c = alpha3[Math.floor(Math.random() * alpha3.length)];
        d = alpha1[Math.floor(Math.random() * alpha1.length)];
        e = alpha2[Math.floor(Math.random() * alpha2.length)];
        f = alpha3[Math.floor(Math.random() * alpha3.length)];
        g = alpha1[Math.floor(Math.random() * alpha1.length)];
    }
    code = a + ' ' + b + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
    setCookie('c', code, 0.0025); // just 3 cookie's minutes
    
    if(modalCaptcha.children.length==0){
        var captcha = document.createElement('canvas');
        let hr = document.createElement('hr'),
            pCaptcha = document.createElement('p'),
            inputCaptcha = document.createElement('input'),
            refresh = document.createElement('button'),
            check = document.createElement('button');
    
        modalCaptcha.addEventListener("mousedown",function(){
            // disable modal body
            modalBody.style.opacity ="0.4";
            // enable modal captcha
            modalCaptcha.style.opacity ="1";

            // avoid modalCaptcha style 'display' turns 'none'
            clearTimeout(timer);
        }); 

        captcha.id = 'captcha';
    
        refresh.type = "submit";
        refresh.classList.add("btn-short","btn-no-border");
        refresh.innerHTML = '&olarr;';
        refresh.addEventListener("click",function(){
            modalMessage.style.display = "none";
            inputCaptcha.value="";
            Captcha();
        });  

        pCaptcha.innerHTML="Ingrese los caracteres de la imagen superior:";
        inputCaptcha.type = "text";
        inputCaptcha.maxLength = 7;
    
        check.type = "submit";
        check.className = "btn-short";
        check.innerHTML = "&#10003;";
        check.addEventListener("click",function(){
            ValidCaptcha(inputCaptcha);
        });  
    
        modalCaptcha.appendChild(hr);
        modalCaptcha.appendChild(captcha);
        modalCaptcha.appendChild(refresh);
        modalCaptcha.appendChild(pCaptcha);
        modalCaptcha.appendChild(inputCaptcha);
        modalCaptcha.appendChild(check);
    }else{
        var captcha = modalCaptcha.querySelector('canvas');
    }
    CreaIMG(code,captcha);
}

async function ValidCaptcha(inputCaptcha) {
    let string1 = removeSpaces(getCookie('c')),
        string2 = removeSpaces(inputCaptcha.value);
    
    if (string1 == string2) {
        // create 'nueva clase'
        socket.emit("new-match", "PROFESOR");
        // get code sesion
        await socket.on("new-pin",function(data){
            showFaIcon(".fa-chalkboard-teacher");

            // show new message on title
            document.querySelector(".title").innerHTML = "¡CLASE CREADA!";

            // disable modal part
            modalBody.style.pointerEvents = "none";
            disableModalPart(modalCaptcha);

            // hidden modal-body and modal-captcha
            modalBody.style.display = "none";
            modalCaptcha.style.display = "none";

            // show message
            document.querySelector(".modal-message > p").innerHTML = "Su código de sesión es: <strong>"+data+"</strong>";
            modalMessage.style.display = "inline-block";

            ClassRoomView.init();
        });
    }else{
        inputCaptcha.value="";
        document.querySelector(".modal-message > p").innerHTML = "<strong>ERROR:</strong> Los caracteres ingresados no coinciden con los de la imagen.";
        modalMessage.style.display = "inline-block";
        Captcha();
    }
}

function removeSpaces(string) {
    return string.split(' ').join('');
}

function CreaIMG(texto,captcha) {
    let ctxCanvas = captcha.getContext('2d'),
        fontSize = "2rem",
        fontFamily = "Quicksand",
        fontWeight='bold',
        width = captcha.width,
        height = 42,
        line;

    // text position
    let x = (width / 5),
        y = (height / 3) * 2;

    // tamaño
    ctxCanvas.canvas.width = width;
    ctxCanvas.canvas.height = height;
    // color de fondo
    ctxCanvas.fillStyle = "#1a0b0c";
    ctxCanvas.fillRect(0, 0, width, height);
    // puntos de distorsion
    ctxCanvas.setLineDash([7, 10]);
    ctxCanvas.lineDashOffset = 5;
    ctxCanvas.beginPath();
    
    for (let i = 0; i < (width); i++) {
        line = i * 5;
        ctxCanvas.moveTo(line, 0);
        ctxCanvas.lineTo(0, line);
    }
    ctxCanvas.strokeStyle = "#5f5f5f";
    ctxCanvas.stroke();
    // formato texto
    ctxCanvas.direction = 'ltr';
    ctxCanvas.font = fontWeight + " " +fontSize + " " + fontFamily;
    // color borde del texto
    ctxCanvas.strokeStyle = "#cf3e3e";
    ctxCanvas.strokeText(texto, x, y);
    // color texto
    ctxCanvas.fillStyle = "#3CD2E6";
    ctxCanvas.fillText(texto, x, y);

    modalCaptcha.style.display = "inline-block";
}

function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=",
        ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
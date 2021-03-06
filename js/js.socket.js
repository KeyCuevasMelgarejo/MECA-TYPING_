/* general
 * ------------------------------------------------- */

const socket = io('https://mecatyping.herokuapp.com',{ //http://localhost:3000',{
    reconnection:true,
    reconnectionDelay: 4000,
    reconnectionDelayMax: 8000,
    reconnectionAttempts: 5
});

socket.on('connect', function() {
    if(modalBody.children.length==0){
        let pName = document.createElement('p'),
            inputName = document.createElement('input'),
            pText=document.createElement("p"),
            inputCodeSession=document.createElement("input"),
            btnJoinToSession=document.createElement("button"),
            aToBeTeacher=document.createElement("a");
    
        // initilize modalBody every time to connect with socket even after disconnect
        modalBody.innerHTML="";
        
        modalBody.addEventListener("mousedown",function(){
            // disable modal body
            modalBody.style.opacity ="1";
            // enable modal captcha
            modalCaptcha.style.opacity ="0.4";

            timer=setTimeout(function() {
                modalCaptcha.style.display="none";
                document.getElementById("id-input-captcha").value="";
            }, 4000);
        }); 

        pName.innerHTML="Ingrese su nombre completo:";
        inputName.type = "text";
        inputName.maxLength = 35;
        inputName.classList.add("large");
        inputName.id = "modal-input-name";

        inputCodeSession.maxLength = 4;
    
        btnJoinToSession.className='btn-short';
        btnJoinToSession.innerHTML='&#10140';
        btnJoinToSession.addEventListener("click",async function(){
            // on case inputName would be empty
            if(!inputName.value){
                document.querySelector(".modal-message > p").innerHTML = "<strong>ERROR:</strong> Debe ingresar su nombre completo.";
                modalMessage.style.display = "inline-block";
                return;
            }

            socket.emit("PIN-check", inputCodeSession.value);
            btnJoinToSession.style.pointerEvents = "none";
            await socket.on("PIN-checked",function(data){
                data?(
                    PIN=inputCodeSession.value,
                    showFaIcon(".fa-users"),

                    // show new message on title
                    document.querySelector(".title").innerHTML = "??BIENVENIDO!",

                    // disable modal part
                    disableModalPart(modalBody),
                    disableModalPart(modalCaptcha),

                    // hidden modal-body and modal-captcha
                    modalBody.style.display = "none",
                    modalCaptcha.style.display = "none",

                    // show message
                    document.querySelector(".modal-message > p").innerHTML = "Usted se encuentra dentro de la clase",
                    modalMessage.style.display = "inline-block",

                    socket.emit("join-match", inputName.value, inputCodeSession.value),
                    socket.on("wait",(data)=>{ // about new
                        Text._fillContentByTeacher(data);
                    }),
                    socket.on("play",()=>{ // about init
                        if(timePause!=0){
                            let continues=dayjs();

                            // add plugin duration.min.js to dayjs
                            dayjs.extend(dayjs_plugin_duration);

                            pauseDuration = dayjs.duration(continues.diff(timePause))+pauseDuration;  
                        }
                        splashWait.classList.remove("splashWait--showen");
                    }),
                    socket.on("pause",()=>{ //about pause
                        timePause = dayjs();
                        splashWait.classList.add("splashWait--showen");
                    }),
                    socket.on("stop",()=>{ //about stop
                        Keyboard.close();
                        if(timeInit===undefined){
                            timeInit = dayjs();
                        }
                        timeFinish = dayjs();
                        ResultPanel.init();
                        socket.emit("resume", timeUsed, qualification, PIN);
                    })
                ):(
                    inputName.value="",
                    inputCodeSession.value="",
                    document.querySelector(".modal-message > p").innerHTML = "<strong>ERROR:</strong> El c??digo de sesi??n ingresado, es incorrecto.",
                    modalMessage.style.display = "inline-block",

                    btnJoinToSession.style.pointerEvents = "auto" 
                );
            });
        }); 


        aToBeTeacher.setAttribute('id', "#");
        aToBeTeacher.setAttribute('href', "#");
        aToBeTeacher.innerHTML="<br>crear nueva clase";
        aToBeTeacher.addEventListener("mouseup",function(){
            Captcha();
            // disable visual modal body
            modalBody.style.opacity ="0.4";
            // enable visual modal captcha
            modalCaptcha.style.opacity ="1";

            // avoid modalCaptcha style 'display' turns 'none'
            clearTimeout(timer);

            // send a clic fake to activate mousedown 'clearTimeout()' to avoid desappear modal-captcha 
            // see captcha.js
            modalCaptcha.dispatchEvent(new Event("mousedown"));
        }); 

        pText.innerHTML = "Ingrese el c??digo de la sesi??n:";
        
        modalBody.appendChild(pName);
        modalBody.appendChild(inputName);
        modalBody.appendChild(pText);
        modalBody.appendChild(inputCodeSession);
        modalBody.appendChild(btnJoinToSession);
        modalBody.appendChild(aToBeTeacher);
    }
    document.querySelector(".title").innerHTML = "??NASE A UNA CLASE";

    btnClientServer.style.visibility = "visible";
});

socket.on("disconnect", function() {
    btnClientServer.classList.add("btn-client-server--disconnect");

    showFaIcon(".fa-exclamation-triangle");

    document.querySelector(".title").innerHTML = "AVISO";
    document.querySelector(".modal-message > p").innerHTML = "Se est?? intentando reconectar al servicio...";

    // disable visual modal parts
    disableModalPart(modalBody);
    disableModalPart(modalCaptcha);

    modalMessage.style.display = "inline-block";
});

socket.io.on("reconnect", function() {
    btnClientServer.classList.remove("btn-client-server--disconnect");

    showFaIcon(".fa-mask");

    // enable modal part
    enableModalPart(modalBody);
    enableModalPart(modalCaptcha);

    modalMessage.style.display = "none";
});

socket.io.on("reconnect_failed", function() {
    document.querySelector(".modal-message > p").innerHTML = "No se pudo reconectar al servicio :(";
    btnClientServer.style.visibility = "hidden";
});
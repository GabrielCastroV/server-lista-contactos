const loginForm = document.querySelector('#login-form');
const login = document.querySelector('#login');
const registerForm = document.querySelector('#register-form');
const register = document.querySelector('#register');
const notification = document.querySelector('.notification');
const loader = document.querySelector('.loader');
const registerBtn = document.querySelector('#register-btn');
const loginBtn = document.querySelector('#login-btn');
const REGEX = /^.{1,20}$/;

const popUp = async()=>{ // función diseñada para mostrar notificacion por 3 segundos y a su vez, desactivar los botones por dicho tiempo.
    notification.classList.add("show");
    loginBtn.disabled = true;
    registerBtn.disabled = true;
    setTimeout(() => {
    notification.classList.remove("show");
    loginBtn.disabled = false;
    registerBtn.disabled = false;
    }, 3000);
};

registerForm.addEventListener('submit', async e =>{
    e.preventDefault();
    const response = await fetch('http://localhost:3000/users', { method: 'GET' });
    const users = await response.json();
    const user = users.find(user => user.username === register.value);
    const registerLong = register.value;

    if (!register.value) {
        notification.innerHTML = `<span class="noti">NOTIFICACIÓN</span> No puedes registrar un nombre vacío.`;
        popUp();
    }else if (!REGEX.test(registerLong)) {
        notification.innerHTML = `<span class="noti">NOTIFICACIÓN</span> El nombre no debe contener más de 20 caracteres.`;
        popUp();
        register.value = '';
    }else if (user) {
        notification.innerHTML = `<span class="noti">NOTIFICACIÓN</span> El usuario "${register.value}" <br >ya existe.`;
        popUp();
        register.value = '';
    }else{
        await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: register.value}),
        });
    notification.innerHTML = `El usuario "${register.value}" <br>ha sido creado exitosamente.`;
    notification.classList.add('showgreen');
    loginBtn.disabled = true;
    registerBtn.disabled = true;
    setTimeout(() =>{
        notification.classList.remove('showgreen');
        loginBtn.disabled = false;
        registerBtn.disabled = false;
    },3000);
    register.value = '';
    };
});
loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/users', { method: 'GET' });
    const users = await response.json();
    const user = users.find(user => user.username === login.value); //filtro el usuario ingresado y comparo con mi base de datos para posteriormente comprobar si existe.

    if (!login.value) {
        notification.innerHTML =`<span class="noti">NOTIFICACIÓN</span> No puedes ingresar un nombre vacío. <br> Por favor, regístrate.`;
        popUp();
        login.value = '';
    }else if (!user) {
        notification.innerHTML = `<span class="noti">NOTIFICACIÓN</span> El usuario no existe. <br> Por favor, regístrate.`;
        popUp();
        login.value = '';
    }else{
        const minDelay = 500;
        const maxDelay = 3000; 
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay; //genera un numero aleatorio entre 500 milisegundos y 3000 milisegundos.
        localStorage.setItem('user',JSON.stringify(user));
        loader.classList.add('show-loader');
        console.log(`Ingresarás en ${delay} ms segundos pq sí.`);
        localStorage.setItem('user',JSON.stringify(user));
        loginBtn.disabled = true;
        registerBtn.disabled = true;
        setTimeout(() => {
            loader.classList.remove('show-loader');
            window.location.href = '../contact-list/contactList.html';
            loginBtn.disabled = false;
            registerBtn.disabled = false;
        }, delay); //el tiempo del loader (timeout) oscila entre 500ms y 3000ms. (0.5 segundos y 3 segundos). Para dar un efecto real de carga al ingresar.
        login.value = '';
    };
});
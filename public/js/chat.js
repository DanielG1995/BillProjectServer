
const url = 'http://' + window.location.hostname + ":8080/api/auth/";


const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');
const ulMensajesPrivados = document.querySelector('#ulMensajesPrivados');

let socket = null;

const validarToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location = 'index.html';
        throw new Error('No hay token');
    }
    return token;
}


const main = async () => {
    const tokenClient = await validarToken();
    const resp = await fetch(url, {
        headers: { 'x-token': tokenClient }
    });
    const { usuario, token } = await resp.json();
    localStorage.setItem('token', token)
    console.log(usuario, token);
    await conectarSocket();




}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
    socket.on('connect', () => {

    });

    socket.on('disconnect', () => {
    });
    socket.on('recibir-mensaje', (payload) => {
        ulMensajes.innerHTML = '';
        payload.forEach(element => {
            ulMensajes.innerHTML = ulMensajes.innerHTML + `
            <span><b> ${element.nombre}</b> : ${element.mensaje}</span>
             <br>
        `;
        });

    });
    socket.on('usuarios-activos', (usuarios) => {
        ulUsuarios.innerHTML = '';
        if (usuarios) {
            for (let i = 0; i < usuarios.length; i++) {
                ulUsuarios.innerHTML = ulUsuarios.innerHTML +
                    `<li>
                    <div class="text text-success">${usuarios[i].nombre}<br>
                     </div>
                    <span style="font-size:80%">${usuarios[i].uid}</span>
                   
                </li>`;
            }
        }
    });
    socket.on('mensaje-privado', (payload) => {
        console.log(payload);
        ulMensajesPrivados.innerHTML = ulMensajesPrivados.innerHTML +
            `<li>
                    <span><b> ${payload.de}</b> : ${payload.mensaje}</span>
             <br>
                </li>`;
    });
}

btnSalir.addEventListener('click', (ev) => {
    localStorage.setItem('token', '');
    socket.disconnect();
    window.location = '/index.html';
});

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if (keyCode !== 13) { return; }
    if (mensaje.length <= 0) { return; }
    if (mensaje.length <= 0) { uid = null }

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = '';
})


main();
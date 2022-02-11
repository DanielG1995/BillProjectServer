const { Socket } = require("socket.io");
const { validarTokenCliente } = require("../helpers/generar-jwt");
const { ChatMensajes } = require("../models");
const chatMensajes = new ChatMensajes();
const socketController = async (socket = new Socket(), io) => {
    const token = socket.handshake.headers['x-token'];
    const usuario = await validarTokenCliente(token);
    if (!usuario) {
        return socket.disconnect();
    }
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensaje', chatMensajes.ultimosMensajes);
    socket.join(usuario.id);
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });
    socket.on('enviar-mensaje', async ({ mensaje, uid }) => {
        if (uid) {
            socket.to(uid).emit('mensaje-privado',{ de: usuario.nombre, mensaje });
        } else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensaje', chatMensajes.ultimosMensajes);

        }
    })
}

module.exports = {
    socketController
}
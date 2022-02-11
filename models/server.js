const express = require("express");
const cors = require('cors');
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../db/config");
const { runInThisContext } = require("vm");
const { socketController } = require("../sockets/socketController");


class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server=require('http').createServer(this.app);
    this.io= require('socket.io')(this.server);
    this.conectarDB();
    this.middleware();
    this.routes();
    this.sockets();
  }

  async conectarDB() {
    await dbConnection();
  }

  middleware() {
    this.app.use(express.static("public"));
    this.app.use(cors());
    this.app.use(express.json());

    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }));
  }

  routes() {
    this.app.use('/api/usuarios', require('../routes/user.routes'));
    this.app.use('/api/auth', require('../routes/auth'));
    this.app.use('/api/categorias', require('../routes/categorias'))
    this.app.use('/api/productos', require('../routes/productos'))
    this.app.use('/api/buscar', require('../routes/buscar'))
    this.app.use('/api/uploads', require('../routes/uploads'))
    this.app.use('/api/facturas', require('../routes/facturas'))
  }

  sockets(){
    this.io.on('connection',(socket)=>socketController(socket,this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en puerto: " + this.port);
    });
  }
}

module.exports = Server;

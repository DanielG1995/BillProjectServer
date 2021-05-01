const express = require("express");
const cors = require('cors');
const { dbConnection } = require("../db/config");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.conectarDB();
    this.middleware();
    this.routes();
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
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto: " + this.port);
    });
  }
}

module.exports = Server;

const express = require("express");
const cors=require('cors');
const { dbConnection } = require("../db/config");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.conectarDB();
    this.middleware();
    this.routes();
  }

  async conectarDB(){
    await dbConnection();
  }

  middleware() {
    this.app.use(express.static("public"));
    this.app.use(cors());
    this.app.use(express.json());
}

  routes() {
   this.app.use('/api/usuarios', require('../routes/user.routes'));
   this.app.use('/api/auth',require ('../routes/auth'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto" + this.port);
    });
  }
}

module.exports = Server;

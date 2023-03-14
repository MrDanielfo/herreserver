// Servidor de Express
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const path = require("path");
const { dbConnection } = require("../database/config");

const Sockets = require("./sockets");
const authRouter = require("../router/auth");
const messagesRouter = require("../router/messages");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Conectar a DB
    this.db = dbConnection();

    // Http server
    this.server = http.createServer(this.app);

    // Configuraciones de sockets
    this.io = socketio(this.server, {
      /* configuraciones */
    });
  }

  middlewares() {
    // Desplegar el directorio público
    this.app.use(express.static(path.resolve(__dirname, "../public")));
    // cors
    this.app.use(cors());
    // body parser
    this.app.use(express.json());
    // routes
    this.app.use("/api/login", authRouter);
    this.app.use("/api/messages", messagesRouter);
  }

  // Esta configuración se puede tener aquí o como propieda de clase
  // depende mucho de lo que necesites
  configurarSockets() {
    new Sockets(this.io);
  }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    // Inicializar sockets
    this.configurarSockets();

    // Inicializar Server
    this.server.listen(this.port, () => {
      // console.log(process.env);
      console.log("Server corriendo en puerto:", this.port);
    });
  }
}

module.exports = Server;

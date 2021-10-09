import * as socket from '../sockets/sockets';
import express from 'express';
import socketIO from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;


    private constructor() {

        this.app = express();
        this.port = parseInt(process.env.PORT as string);

        this.httpServer = http.createServer( this.app );
        this.io = new socketIO.Server( this.httpServer, { cors: { origin: true } } );

        this.escucharSockets();
    }

    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }


    private escucharSockets() {

        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {

            // Conectar cliente
            socket.conectarCliente(cliente);

            // Configurar usuario
            socket.configurarUsuario(cliente, this.io);

            // Obtener usuarios activos
            socket.obtenerUsuarios(cliente, this.io);

            
            // Mensajes
            socket.mensaje( cliente, this.io );

            // Desconectar
            socket.desconectar( cliente, this.io );

        });

    }

    start( callback: any ) {
        this.httpServer.listen( this.port, callback );
    }

}
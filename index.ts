import express from 'express';
import cors from 'cors';
import router from './routes/api';
import path from 'path';
import Server from './classes/server';

const server = Server.instance;

// Body Parsing
server.app.use(express.json());
server.app.use(express.urlencoded({extended: true}));

// CORS
server.app.use(cors());

// Routes
server.app.use('/api', router);

// Non defined routes
server.app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'))
});

// Run Server
server.start(() => {
    console.log('Servidor corriendo en el puerto - No tengo ganas de importarlo');
})
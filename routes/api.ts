import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/sockets';

const router = Router();

router.get('/mensajes', (req: Request, res: Response) => {
    res.json({
        ok: true,
        msg: 'Todo esta bien!!'
    });
});

router.post('/mensajes', (req: Request, res: Response) => {
  
    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const server = Server.instance;

    server.io.emit('mensaje-nuevo', { de, cuerpo});

    res.json({
        ok: true,
        cuerpo,
        de
    });
});

router.post('/mensajes/:id', (req: Request, res: Response) => {
  
    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id

    const payload = { de, cuerpo }

    const server = Server.instance;

    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

// Servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', async(req: Request, res: Response) => {

    const server = Server.instance;
    // const clientes: string[] = []; 

    await server.io.allSockets().then( (clientes) => {
        res.json({
            ok: true,
            clientes: Array.from(clientes)
        });
    }).catch(err => res.status(500).json( {ok: false, err} ));



    // My Method
    // await server.io.allSockets().then( (resp) => {
    //     resp.forEach( (v) => clientes.push(v) )
    // }).catch(err => res.status(500).json( {ok: false, err} ));

    // res.json({
    //     ok: true,
    //     clientes
    // });
});

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', async(req: Request, res: Response) => {
 
    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

});

export default router;
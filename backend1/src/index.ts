import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8000 });

const gameManeger = new GameManager();

wss.on('connection', function connection(ws) {
    gameManeger.addUser(ws);
    ws.on('error', console.error);

    ws.on('disconnect', ()=> gameManeger.removeUser(ws));

    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
});
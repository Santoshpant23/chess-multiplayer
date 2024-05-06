import { WebSocket } from "ws";
import { Game } from "./Game";
import { MOVE, ST_Game } from "./messages";

export class GameManager{
    private games: Game[];
    private pendingUser: WebSocket | null
    private users: WebSocket[]

    constructor(){
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }


    addUser(socket: WebSocket){
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket): string | void{
        this.users = this.users.filter(user=> user!=socket);
    }

    private addHandler(socket: WebSocket){
        socket.on('message', (msg)=>{
            const message = JSON.parse(msg.toString());
            console.log("Got this message "+ message);
            
            if(message.type == ST_Game){
                if(this.pendingUser){
                    //start the game
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                } else{
                    this.pendingUser = socket;
                }
            }

            if(message.type ==MOVE){
                console.log("I am inside make move in Gamemanager");
                console.log("I am the socket "+ socket);
                
             const game =   this.games.find(game=> game.player1 == socket || game.player2 ==socket);
             if(game){
                console.log("Got inside if meaning got a game player");
                console.log(message);
                console.log(message.payload.move);
               const resp =  game.makeMove(socket , message.payload.move);
               return resp;
               
             }
            }
        })
    }
}
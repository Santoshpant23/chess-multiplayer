import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { Game_Over, MOVE, ST_Game, ERR} from "./messages";

export class Game{
    public player1: WebSocket;
    public player2: WebSocket;
    private gameTime: Date;
    private moves: []
    private board: Chess
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.gameTime = new Date();
        this.moves = [];
        this.board = new Chess();
        this.player1.send(JSON.stringify({
            type: ST_Game,
            payload:{
                color: "white"
            }
        }))
        this.player2.send(JSON.stringify({
            type: ST_Game,
            payload:{
                color: "black"
            }
        }))
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }){
        //validating type of move using zod
        console.log("Got inside makeMove");
        console.log("Logged"+ this.moveCount);
        
        console.log("Move Made is "+ move.from + " " + move.to);
        console.log("Socket is player 1? " + (socket == this.player1));
        // console.log("Socket is player 1? "  +  );
        console.log(" move count is " + this.moveCount);
        
        // if(this.moveCount%2==0 && socket!=this.player1){
        //     console.log("Inside even");
            
        //     return;
        // }
        if(this.moveCount%2==0){
            if(socket!=this.player1){
                console.log('Invalid Move');
                
                this.player2.send(JSON.stringify({
                    type: ERR,
                    payload: move
                }))
                return;
            }
        }
        if(this.moveCount%2!=0){
            if(socket!=this.player2){
                console.log('Invalid Move');
                
                this.player1.send(JSON.stringify({
                    type: ERR,
                    payload: move
                }))
                return;
            }
        }

        // if(this.moveCount%2!=0 && socket!=this.player2){
        //     console.log("Inside odd");
        //     return;
        // }

        try{
            this.board.move(move);
            console.log('Was a valid move');
            
        } catch(e){
            console.log('Was not a valid move');
            
            return;
        }

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type: Game_Over,
                payload: {
                    winner: this.board.turn() === "w" ?  "black" : "white"
                }
            }))
            this.player2.send(JSON.stringify({
                type: Game_Over,
                payload: {
                    winner: this.board.turn() === "w" ?  "black" : "white"
                }
            }))
        }
        console.log("Game was not over");
        console.log("the move I received is " + JSON.stringify(move));
        if (this.moveCount % 2 == 0) {
            console.log("Send info to black");

            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
            console.log("Send info to white");

            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        console.log("Everything was alright");
        this.moveCount++;
        console.log(this.moveCount);
        return "VM";
        
        
      
    }
}
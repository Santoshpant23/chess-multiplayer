import { useEffect } from "react";
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket";
import { useState } from "react";
import { Chess } from "chess.js";
import ShowMoves from "../components/ShowMoves";

 const ST_Game = 'start_game';
 const MOVE = 'move';
 const Game_Over = 'game_over';
 const ERR = 'error';

export const Game = () => {

    const socket  = useSocket();
    const [chess, setChess] = useState(new Chess())
    const [board, setBoard] = useState(chess.board());
    const [color, setColor] = useState('white');
    const [hasGameStarted, setHasGameStarted] = useState(false);
    const [message, setMessage] = useState<WebSocket | null>(null);
    
    const [moves, setMoves] = useState<string[]>([]);

    useEffect(() => {
        if(!socket) return;
        socket.onmessage = (event) => {
            // console.log(event.data);
            
            const message = JSON.parse(event.data);
            // console.log(message);
            setMessage(message);
            console.log(message);
            switch(message.type){
                case ST_Game:
                    setHasGameStarted(true);
                    // setMessage(message.type);
                    setColor(message.payload.color);
                    setBoard(chess.board());
                    console.log('Game Started');
                    break;
                case MOVE:
                    // moves.push(message.payload.to);
                    console.log("Moves before: ", moves);
                    setMoves(prevMoves => [...prevMoves, message.payload.to]);
                    console.log(message.payload.to);
                    console.log("Moves after: ", moves);             
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log('Move Received');
                    // setMessage(message.type);
                    break;
                case Game_Over:
                    console.log('Game Over');
                    // setMessage(message.type);
                    break;
                case ERR:
                    console.log(message.type);
                    // setMessage(message.type);
                    break;
                default:
                    break;
            }
        }
        }, [socket]);

        useEffect(() => {
            console.log("If moves updates, this is the current moves " + moves);
        }, [moves]);

    if(!socket) return <div>Connecting...</div>

    return <div className="justify-center flex">
        <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                     <div className="col-span-4 w-full flex justify-center">
                                <ChessBoard moves={moves} setMoves={setMoves} message={message}  color={color} chess={chess} setBoard={setBoard} socket={socket} board={board} />
                     </div>
                
                        <div className="col-span-2 bg-slate-900 w-full flex justify-center">

                        <div className="pt-2">

                      <div>
                        {/* if game has started, return a play button, else return nothing */}
                        {hasGameStarted ? <div><ShowMoves moves={moves} /></div> : <button onClick={()=>{
                            console.log('Play');
                        socket.send(JSON.stringify({type: ST_Game}));
                        }} className="bg-green-500 px-4 py-2 mt-6 rounded-lg mt-4 text-white text-3xl font-semibold">
                          Play
                            </button>}
                      </div>
                        
                       
                        
                                
                    </div>
                    </div>
                </div>

                </div>
                
            </div>
}
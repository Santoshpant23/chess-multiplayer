import { Color, PieceSymbol, Square } from "chess.js";
import { useSocket } from "../hooks/useSocket";
import { SetStateAction, useState } from "react";
const ST_Game = 'start_game';
const MOVE = 'move';
const Game_Over = 'game_over';
import image from '../assets/k.png';
import { useNavigate } from "react-router-dom";

export const ChessBoard = ({chess ,board, socket, setBoard, color, message, setMoves, moves}:{
    board:({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    chess: any;
    setBoard: any;
    color: string;
    message: any;
    setMoves: any;
    moves: string[];
    }) => {

const [from, setFrom] = useState<Square | null>(null);
const [to, setTo] = useState<Square | null>(null);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
const [fromSquare, setFromSquare] = useState<Square | null>(null);
// const socket = useSocket();

const navigate = useNavigate();
if(message){
    if(message.type == Game_Over){
        if(message.payload.winner == color){    
            alert('You Won');
            navigate('/');
        } else{
            alert('You Lost');
            navigate('/');
        }
        // alert('Game Over');
        
    }
}


if(color == "white"){
    return(
        <div className="text-white-200">
      {  board.map((row, i) => {
            return (
                <div key={i} className="flex">
                   { row.map((square, j) => {
                    const squareRepresentation  = String.fromCharCode(97 + (j%8)) + "" + (8-i) as Square;
                        return (
                            <div onClick={()=>{
                                if(!from){
                                    setFrom(squareRepresentation);
                                    setFromSquare(squareRepresentation);
                                } else{
                                    // console.log("Message Before Sending Data is " + message);
                                    
                                    setTo(square?.square ?? null);
                                    const pieceInfo = chess.get(fromSquare);
                                    console.log("Piece Info is " + pieceInfo.type + " " + pieceInfo.color);
                                    
                                    try{
                                        if(pieceInfo.color != 'w'){
                                            //throw error
                                            throw new Error('Invalid Move');
                                        }
                                        chess.move({
                                            from,
                                            to: squareRepresentation
                                        
                                        });
                                        
                                        socket.send(JSON.stringify({
                                            type: MOVE,
                                            payload: {
                                                move: {
                                                    from,
                                                    to: squareRepresentation
                                                }
                                            }
                                        }));
                                        console.log("Moves before clicking: ", moves);
                                        console.log(squareRepresentation);              
                                        setMoves([...moves, squareRepresentation]);
                                        console.log("Moves after clicking: ", moves);
                                        console.log('Was a valid move');
                                        setFrom(null);
                                        setBoard(chess.board());
                                        console.log({
                                            from,
                                            to: squareRepresentation
                                        });
                                      
                                        
                                    } catch(e){
                                        setFrom(null);
                                        console.log('Was not a valid move');
                                        alert('Invalid Move');
                                        return;
                                    }
                                    
                                }
                            }} key={j} className={`w-16 h-16 ${(i+j)%2 == 0 ?  'bg-green-500' : 'bg-white'} flex justify-center items-center`}>
                            <div className="w-full h-full justify-center flex">
                                <div className="h-full justify-center flex flex-col">
                                    {square ? <img src={square?.color === "b" ? "./assets/"+ square.type + " B.png" : "./assets/"+ square?.type + ".png"} alt="piece" /> : null}
                                </div>
                            </div>
                        </div>
                        )
                    })
                }
                </div>
            )
        })
    }
    </div>
)
} else{



return (
    <div className="text-white-200">
        {board.slice().reverse().map((row, i) => {
            return (
                <div key={i} className="flex">
                    {row.slice().reverse().map((square, j) => {
                     const squareRepresentation = String.fromCharCode(97 + (7 - j % 8)) + "" + (i + 1) as Square;
                        return (
                            <div onClick={() => {
                                console.log("The square is " + square);
                                
                                if (!from) {
                                    setFrom(squareRepresentation);
                                    setFromSquare(squareRepresentation);
                                } else {
                                    setTo(square?.square ?? null);
                                    const pieceInfo = chess.get(fromSquare);
                                    console.log("Piece Info is " + pieceInfo.color + " " + pieceInfo.type);
                                    try{
                                        if(pieceInfo.color != 'b'){
                                            //throw error
                                            throw new Error('Invalid Move');
                                        }
                                        chess.move({
                                            from,
                                            to: squareRepresentation
                                        
                                        });
                                       
                                        socket.send(JSON.stringify({
                                            type: MOVE,
                                            payload: {
                                                move: {
                                                    from,
                                                    to: squareRepresentation
                                                }
                                            }
                                        }));
                                        console.log("Moves before clicking: ", moves);
                                        
                                        setMoves([...moves, squareRepresentation]);
                                        console.log("Moves after clicking: ", moves);
                                        
                                        console.log('Was a valid move');
                                        setFrom(null);
                                        setBoard(chess.board());
                                        console.log({
                                            from,
                                            to: squareRepresentation
                                        });
                                      
                                        
                                    } catch(e){
                                        setFrom(null);
                                        console.log('Was not a valid move');
                                        alert('Invalid Move');
                                        return;
                                    }
                                    
                                }
                            }} key={j} className={`w-16 h-16 ${(i + j) % 2 == 0 ? 'bg-green-500' : 'bg-white'} flex justify-center items-center`}>
                                <div className="w-full h-full justify-center flex">
                                    <div className="h-full justify-center flex flex-col">
                                        {square ? <img src={square?.color === "b" ? "./assets/" + square.type + " B.png" : "./assets/" + square?.type + ".png"} alt="piece" /> : null}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        })}
    </div>
);
}
 }

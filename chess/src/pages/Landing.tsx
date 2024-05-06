import image from '../assets/chess.png';
import {useNavigate} from 'react-router-dom';

export const Landing = () => {

   const navigate  = useNavigate();

    return <div className="h-full w-full mt-10" >
    <div className=" h-full w-full flex justify-evenly">
        <div className="w-2/5  m-5">
            <img
            className="rounded-xl w-full  "
            src="/assets/chess.png"
            alt="chess-board"
            />
        </div>


      
        <div className=" w-1/5 flex flex-col justify-center items-center mb-36">
            <h1 className="text-4xl font-bold text-center text-white">Play Chess Online on the #1 Site!</h1>
            
            <button className="bg-green-500 px-4 py-2 rounded-lg mt-4 text-white text-3xl font-semibold " onClick={()=>{
                navigate('/game');
            }}>
            Play Online
            </button>
     </div>
     
    </div>
  </div>
}
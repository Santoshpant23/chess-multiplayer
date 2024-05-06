import { useEffect, useState } from "react";
const URL = 'ws://localhost:8000';

export const useSocket = () => {

    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(URL);

        ws.onopen = () => {
            setSocket(ws);
        }
        ws.onclose = () => {
           setSocket(null);
        }

        return () => {
            ws.close();
        }
    }, []);


return socket;


}

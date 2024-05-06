export default function ShowMoves({ moves }: { moves: string[] }) {
    // Function to group moves into pairs
    const groupMoves = (moves: string[]) => {
        const groupedMoves: string[][] = [];
        for (let i = 0; i < moves.length; i += 2) {
            groupedMoves.push([moves[i], moves[i + 1]]);
        }
        return groupedMoves;
    };

    // Group the moves into pairs
    const groupedMoves = groupMoves(moves);

    return (
        <div>
            <p className="text-green-600 text-3xl">Moves</p>
            <div className="text-white font-semibold overflow-y-auto max-h-200 mt-5">
                {/* Render grouped moves */}
                {groupedMoves.map((movePair, index) => (
                    <div key={index} className="mb-2">
                        <span className="font-bold">{index + 1}. </span>
                        <span className="ml-4">
                            {/* Render individual moves within the pair */}
                            {movePair.map((move, subIndex) => (
                                <span key={subIndex}>{move} </span>
                            ))}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

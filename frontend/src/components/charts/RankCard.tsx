export const RankCard = ({ rank, probability }: { rank: number | string, probability: string }) => {
    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-white/10 backdrop-blur-md">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">AI Predicted Rank</h3>
            <div className="mt-2 flex items-baseline">
                <span className="text-5xl font-bold text-white">#{rank}</span>
                <span className="ml-2 text-green-400 text-sm font-semibold">{probability}</span>
            </div>
            <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                *Based on pichle 5 saal ke NIMCET difficulty level aur normalization trends.
            </p>
        </div>
    );
}
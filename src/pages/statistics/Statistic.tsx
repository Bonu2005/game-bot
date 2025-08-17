const players = [
  { name: "Umidjon Abdullayev", level: "Pre-intermediate", score: 350, isTop: true },
  { name: "Otabek Mahkamov", level: "Beginner", score: 340 },
  { name: "Husan Qayumov", level: "Beginner", score: 300 },
  { name: "Botir Azimov", level: "Elementary", score: 200 },
  { name: "Bobur Mansurov", level: "Beginner", score: 186 },
];

const Statistic = () => {
  return (
    <div className=" text-white pt-10 pb-6 px-4">


      {/* Title */}
      <h2 className="text-[20px] font-bold text-center mb-4">Leaders board</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-4 space-x-2">
        <button className="bg-[#1E2A3A] text-white px-4 py-1 rounded-full text-sm">All</button>
        <button className="bg-[#1E2A3A] text-white px-4 py-1 rounded-full text-sm">Level</button>
      </div>

      {/* Player list */}
      <div className="space-y-3">
        {players.map((p, i) => (
          <div
            key={i}
            className={`w-[344px] mx-auto flex items-center justify-between px-4 py-3 rounded-xl ${
              p.isTop ? "bg-[#2DBE64] text-white" : "bg-white text-black"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                  p.isTop ? "bg-yellow-400 text-black" : "bg-yellow-400 text-black"
                }`}
              >
                {i + 1}
              </div>
              <div>
                <p className={`text-sm font-semibold ${p.isTop ? "text-white" : "text-black"}`}>{p.name}</p>
                <p className={`text-xs ${p.isTop ? "text-white opacity-80" : "text-green-500"}`}>{p.level}</p>
              </div>
            </div>
            <div className={`text-sm font-bold ${p.isTop ? "text-white" : "text-black"}`}>{p.score}</div>
          </div>
        ))}
      </div>

      {/* Show more */}
      <div className="mt-4 text-center text-blue-400 text-sm cursor-pointer">Show more</div>

      {/* Play again */}
      <div className="mt-8 flex justify-center w-[344px]">
        <button className="flex items-center gap-2 bg-[#FFA500] text-white font-semibold rounded-full px-6 py-3 w-[344px] text-center">
          <span>▶</span> Play again
        </button>
      </div>
    </div>
  );
};

export default Statistic;

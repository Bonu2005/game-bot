 

const Game = () => {
const answers = ["exhausted", "happy", "apple", "sad"];

  return (
    <div className=" text-white px-6 py-10 flex flex-col items-center">
      {/* ВЕРХ */}
      <div className="w-full flex justify-between items-center mb-4">
        <button className="text-blue-400 font-semibold">Back</button>
        <p className="text-white font-bold">Quiz</p>
        <div className="w-[60px] h-[24px] bg-[#1E2A3A] rounded-full flex items-center justify-center text-[12px]">
          50 s
        </div>
      </div>

      {/* ТАЙМЕР */}
      <div className="w-full h-[6px] bg-gray-600 rounded-full mb-6">
        <div className="h-full w-[40%] bg-orange-400 rounded-full"></div>
      </div>

      {/* ВОПРОС */}
      <p className="text-[16px] mb-2 text-center">Find the English translations of the given words.</p>
      <h2 className="text-[24px] font-bold mb-6 text-center">charchagan</h2>

      {/* ВАРИАНТЫ ОТВЕТОВ */}
      <div className="w-full space-y-4">
        {answers.map((ans, index) => (
          <button
            key={index}
            className="w-full py-4 bg-[#2C3A4D] rounded-xl text-white text-[16px] font-semibold"
          >
            {ans}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Game

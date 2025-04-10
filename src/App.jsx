import { useState, useEffect } from "react";

export default function App() {
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Stop at exactly 50 to win!");
  const [isRunning, setIsRunning] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showWinEffect, setShowWinEffect] = useState(false);
  const [difficulty, setDifficulty] = useState('medium'); 

  // Get speed based on difficulty
  const getSpeed = () => {
    switch(difficulty) {
      case 'easy': return 150;
      case 'hard': return 60;
      default: return 100;
    }
  };

  // Calculate how close the user was to 50
  const calculateAccuracy = (value) => {
    return Math.abs(50 - value);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setScore((prev) => {
          // Only reset when we reach exactly 100
          if (prev >= 99) return 0;
          return prev + 1;
        });
      }, getSpeed());
    } else if (score > 0) {
      // Game ended, evaluate result
      setAttempts((prev) => prev + 1);
      
      const accuracy = calculateAccuracy(score);
      
      if (score === 50) {
        setMessage("🎉 Perfect! You win!");
        setShowWinEffect(true);
        setHighScore((prev) => Math.max(prev, 100));
      } else if (accuracy <= 3) {
        const points = 90 - (accuracy * 10);
        setMessage(`Close! Only ${accuracy} away!`);
        setHighScore((prev) => Math.max(prev, points));
      } else {
        setMessage(`Missed it by ${accuracy}!`);
      }
      
      // Reset automatically after delay but DON'T reset score to 0 here
      // This prevents unwanted resets
      setTimeout(() => {
        setMessage("Stop at exactly 50 to win!");
        setShowWinEffect(false);
      }, 2000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, score, difficulty]);

  const handleClick = () => {
    if (isRunning) {
      // Stopping the game
      setIsRunning(false);
    } else {
      // Starting a new game - explicitly set score to 0
      setScore(0);
      setMessage("Stop at exactly 50 to win!");
      setIsRunning(true);
    }
  };

  const changeDifficulty = (level) => {
    if (!isRunning) {
      setDifficulty(level);
    }
  };

  // Score display with color based on proximity to 50
  const getScoreColor = () => {
    if (score === 50) return "text-green-400";
    const diff = Math.abs(50 - score);
    if (diff <= 3) return "text-yellow-400";
    if (diff <= 10) return "text-orange-400";
    return "text-white";
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Content */}
      <div className="h-screen flex flex-col items-center justify-center relative z-10 px-4">
        {/* Main Game Card - Transparent with border */}
        <div className="bg-gray-900 bg-opacity-40 backdrop-blur-md border border-white border-opacity-20 p-8 rounded-2xl shadow-xl w-80 h-96 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-white">
            Stop at <span className="text-yellow-300">50</span>
          </h1>
          
          <div className="flex justify-between items-center mb-4 text-gray-200 text-sm">
            <div>Attempts: {attempts}</div>
            <div>High Score: {highScore}</div>
          </div>
          
          {/* Score Display */}
          <div className={`text-6xl font-mono mb-4 text-center ${getScoreColor()}`}>
            {score}
          </div>
          
          {/* Dynamic Message */}
          <p className={`text-lg text-center mb-4 h-8 ${
            message.includes("Perfect") 
              ? "text-green-400" 
              : message.includes("Close") 
              ? "text-yellow-400" 
              : message.includes("Missed") 
              ? "text-red-400" 
              : "text-gray-200"
          }`}>
            {message}
          </p>
          
          {/* Start/Stop Button */}
          <button
            onClick={handleClick}
            className={`w-full py-3 rounded-lg text-white font-bold ${
              isRunning
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isRunning ? "STOP" : "START"}
          </button>
          
          {/* Difficulty selector */}
          {!isRunning && (
            <div className="mt-4">
              <p className="text-center text-gray-300 mb-2">Difficulty:</p>
              <div className="flex justify-center gap-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => changeDifficulty(level)}
                    className={`px-2 py-1 rounded text-sm capitalize ${
                      difficulty === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions Card - Transparent with border */}
        <div className="bg-gray-900 bg-opacity-40 backdrop-blur-md border border-white border-opacity-20 p-4 rounded-lg w-80 text-center">
          <p className="text-gray-200 text-sm">
            Challenge: Stop the counter at exactly 50 to win. 
            <br />The closer you get, the higher your score!
            <br />Numbers reset to 0 after reaching 99.
          </p>
        </div>
        
        {/* Win Effect - Only shown when player wins */}
        {showWinEffect && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-6xl">🎉</div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';

export default function App() {
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Stop at exactly 50 to win!');
  const [isRunning, setIsRunning] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showWinEffect, setShowWinEffect] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');

  const getSpeed = () => {
    switch (difficulty) {
      case 'easy':
        return 150;
      case 'hard':
        return 60;
      default:
        return 100;
    }
  };

  const calculateAccuracy = (value) => {
    return Math.abs(50 - value);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setScore((prev) => {
          if (prev >= 99) return 0;
          return prev + 1;
        });
      }, getSpeed());
    } else if (score > 0) {
      setAttempts((prev) => prev + 1);

      const accuracy = calculateAccuracy(score);

      if (score === 50) {
        setMessage('🎉 Perfect! You win!');
        setShowWinEffect(true);
        setHighScore((prev) => Math.max(prev, 100));
      } else if (accuracy <= 3) {
        const points = 90 - accuracy * 10;
        setMessage(`Close! Only ${accuracy} away!`);
        setHighScore((prev) => Math.max(prev, points));
      } else {
        setMessage(`Missed it by ${accuracy}!`);
      }

      setTimeout(() => {
        setMessage('Stop at exactly 50 to win!');
        setShowWinEffect(false);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isRunning, score, difficulty]);

  const handleClick = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setScore(0);
      setMessage('Stop at exactly 50 to win!');
      setIsRunning(true);
    }
  };

  const changeDifficulty = (level) => {
    if (!isRunning) {
      setDifficulty(level);
    }
  };

  const getScoreColor = () => {
    if (score === 50) return 'text-green-400';
    const diff = Math.abs(50 - score);
    if (diff <= 3) return 'text-yellow-400';
    if (diff <= 10) return 'text-orange-400';
    return 'text-white';
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <div className="h-screen flex flex-col items-center justify-center relative z-10 px-4">
        <div className="bg-gray-900 bg-opacity-40 backdrop-blur-md border border-white border-opacity-20 p-8 rounded-2xl shadow-xl w-80 h-96 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-white">
            Stop at <span className="text-yellow-300">50</span>
          </h1>

          <div className="flex justify-between items-center mb-4 text-gray-200 text-sm">
            <div>Attempts: {attempts}</div>
            <div>High Score: {highScore}</div>
          </div>

          <div
            className={`text-6xl font-mono mb-4 text-center ${getScoreColor()}`}
          >
            {score}
          </div>

          <p
            className={`text-lg text-center mb-4 h-8 ${
              message.includes('Perfect')
                ? 'text-green-400'
                : message.includes('Close')
                ? 'text-yellow-400'
                : message.includes('Missed')
                ? 'text-red-400'
                : 'text-gray-200'
            }`}
          >
            {message}
          </p>

          <button
            onClick={handleClick}
            className={`w-full py-3 rounded-lg text-white font-bold ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRunning ? 'STOP' : 'START'}
          </button>

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

        <div className="w-80 rounded-lg p-4 border border-white/20 bg-gray-900/40 backdrop-blur-md">
          <p className="text-sm text-gray-200 font-semibold mb-2">Challenge:</p>
          <ul className="text-sm text-gray-200 list-disc list-inside text-left">
            <li>
              Stop at exactly{' '}
              <span className="text-yellow-300 font-medium">50</span> to win.
            </li>
            <li>The closer you get, the higher your score!</li>
            <li>
              Numbers reset to{' '}
              <span className="text-yellow-300 font-medium">0</span> after
              reaching <span className="text-yellow-300 font-medium">99</span>.
            </li>
          </ul>
        </div>

        {showWinEffect && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-6xl">🎉</div>
          </div>
        )}
      </div>
    </div>
  );
}

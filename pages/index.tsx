import { useState, useEffect } from 'react';

const symbols = ['🍒', '🍋', '🔔', '⭐', '7️⃣'];

const prizes: { [key: string]: string } = {
  '🍒🍒🍒': 'Small Prize! 🍒🍒🍒',
  '🍋🍋🍋': 'Medium Prize! 🍋🍋🍋',
  '🔔🔔🔔': 'Large Prize! 🔔🔔🔔',
  '⭐⭐⭐': 'Jackpot! ⭐⭐⭐',
  '7️⃣7️⃣7️⃣': 'Mega Jackpot! 777',
};

type ProbabilityData = {
  smallPrize: number;
  mediumPrize: number;
  largePrize: number;
  jackpot: number;
  megaJackpot: number;
};

export default function Home() {
  const [reels, setReels] = useState<string[]>(['🍒', '🍋', '🔔']);
  const [message, setMessage] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [probabilities, setProbabilities] = useState<ProbabilityData | null>(null);

  useEffect(() => {
    // Fetch probabilities on component mount
    fetch('/api/probability')
      .then(response => response.json())
      .then(data => setProbabilities(data))
      .catch(error => console.error('Error fetching probabilities:', error));
  }, []);

  const spin = () => {
    if (isSpinning) return; // Prevent multiple spins at the same time
    setIsSpinning(true);
    setMessage('');

    // Start spinning animation
    const spinDuration = 2000; // Spin for 2 seconds

    // Simulate spinning by cycling symbols every 100ms
    const spinInterval = setInterval(() => {
      setReels((prevReels) =>
        prevReels.map(() => symbols[Math.floor(Math.random() * symbols.length)])
      );
    }, 100);

    // Stop spinning after the duration
    setTimeout(() => {
      clearInterval(spinInterval);

      // Set final symbols based on probabilities
      if (probabilities) {
        const random = Math.random();
        let cumulative = 0;
        let finalCombination = '';

        if (random < (cumulative += probabilities.smallPrize)) {
          finalCombination = '🍒🍒🍒';
        } else if (random < (cumulative += probabilities.mediumPrize)) {
          finalCombination = '🍋🍋🍋';
        } else if (random < (cumulative += probabilities.largePrize)) {
          finalCombination = '🔔🔔🔔';
        } else if (random < (cumulative += probabilities.jackpot)) {
          finalCombination = '⭐⭐⭐';
        } else {
          finalCombination = '7️⃣7️⃣7️⃣';
        }

        const finalReels = Array.from({
          length: 3,
        }, () => symbols[Math.floor(Math.random() * symbols.length)]);
        
        if (prizes[finalCombination]) {
          setReelsAndMessage(finalCombination);
        } else {
          setReels(finalReels);
          setMessage('Try Again!');
        }
      } else {
        // Fallback if probabilities are not loaded
        const finalReels = Array.from({
          length: 3,
        }, () => symbols[Math.floor(Math.random() * symbols.length)]);
        setReels(finalReels);
        const combination = finalReels.join('');
        setMessage(prizes[combination] || 'Try Again!');
      }

      setIsSpinning(false);
    }, spinDuration);
  };

  // Helper function to set reels and message for guaranteed prizes
  const setReelsAndMessage = (combination: string) => {
    // Use Array.from to correctly handle multi-codepoint emojis
    const symbolsArray = Array.from(combination);
    setReels(symbolsArray);
    setMessage(prizes[combination] || 'Try Again!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-4">
      <h1 className="text-5xl font-bold mb-8">🎰 Slot Machine 🎰</h1>
      <div className="flex space-x-4 mb-8">
        {reels.map((symbol, index) => (
          <div
            key={index}
            className="w-24 h-24 flex items-center justify-center bg-gray-800 rounded-lg text-4xl shadow-lg"
          >
            <span
              className={`transition-transform duration-100 ${
                isSpinning ? 'animate-spin-slow' : ''
              }`}
            >
              {symbol}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={spin}
          className={`px-6 py-3 rounded-full text-xl font-semibold transition duration-300 ${
            isSpinning
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={isSpinning}
        >
          {isSpinning ? 'Spinning...' : 'Spin'}
        </button>

        {/* Guaranteed Prize Buttons */}
        <div className="flex flex-wrap justify-center mt-4 space-x-2">
          <button
            onClick={() => setReelsAndMessage('🍒🍒🍒')}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded shadow-md text-lg"
          >
            Small Prize
          </button>
          <button
            onClick={() => setReelsAndMessage('🍋🍋🍋')}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded shadow-md text-lg"
          >
            Medium Prize
          </button>
          <button
            onClick={() => setReelsAndMessage('🔔🔔🔔')}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded shadow-md text-lg"
          >
            Large Prize
          </button>
          <button
            onClick={() => setReelsAndMessage('⭐⭐⭐')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow-md text-lg"
          >
            Jackpot
          </button>
          <button
            onClick={() => setReelsAndMessage('7️⃣7️⃣7️⃣')}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded shadow-md text-lg"
          >
            Mega Jackpot
          </button>
        </div>
      </div>
      {message && <p className="mt-6 text-2xl">{message}</p>}
      <style jsx>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

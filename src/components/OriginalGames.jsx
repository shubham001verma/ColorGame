import React from 'react';

const originalGames = [
  { id: 1, image: '/21.png' },
  { id: 2, image: '/18.png' },
  { id: 3, image: '/17.png' },
  { id: 4, image: '/19.png' },
  { id: 5, image: '/20.png' },
  { id: 6, image: '/icons/original.png' },
];

const OriginalGames = () => {
  return (
 
      <div className="w-full max-w-[500px] px-4 py-5">
        
        {/* Heading */}
        <h2 className="text-lg font-bold text-gray-900">Original</h2>
        <p className="text-sm text-gray-500 mb-4">
          The games are independently developed by our team, fun, fair, and safe
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-3 gap-4">
          {originalGames.map((game) => (
            <div
              key={game.id}
              className="rounded-xl overflow-hidden bg-gray-100 shadow h-full"
            >
              <img
                src={game.image}
                alt={`Game ${game.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

      </div>

  );
};

export default OriginalGames;

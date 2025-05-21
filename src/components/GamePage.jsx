import React from 'react';
import { useNavigate } from 'react-router-dom';

const miniGames = [
  { id: 1, image: '/15.png', name: 'Wingo' },
  { id: 2, image: '/14.png', name: 'K3' },
  { id: 3, image: '/12.png', name: '5D' },
  { id: 4, image: '/13.png', name: 'TRX' },
];

const GamePage = () => {
  const navigate = useNavigate();

  const handleGameClick = (gameName) => {
    const userId = sessionStorage.getItem('useridcolorapp');
    if (!userId) {
      navigate('/user/login');
      return;
    }

    if (gameName === 'Wingo') {
      navigate('/game/colorpridiction');
    }
  };

  return (
    <div className="w-full max-w-[500px] px-2 py-4">
      <h2 className="text-lg font-bold text-gray-900 ml-2">Lottery</h2>
      <p className="text-sm text-gray-500 mb-4 ml-2">
        The games are independently developed by our team, fun, fair, and safe
      </p>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-4 px-2 py-2">
          {miniGames.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.name)}
              className="rounded-xl overflow-hidden bg-gray-100 shadow h-32 w-40 cursor-pointer transition-transform hover:scale-105"
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage;

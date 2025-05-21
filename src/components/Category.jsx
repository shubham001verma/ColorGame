import React from "react";

const categories = [
  { name: "Lottery", image: "/4.png" },
  { name: "Original", image: "/10.png" },
  { name: "Slots", image: "/9.png" },
  { name: "Fishing", image: "/8.png" },
  { name: "Sports", image: "/11.png" },
  { name: "Casino", image: "/6.png" },
  { name: "PVC", image: "/7.png" },
];

const Category = () => {
  return (
 
      <div className="w-full max-w-[500px] px-2">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-4 px-2 py-2">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[70px]"
              >
                <div className="w-18 h-18 rounded-full    flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <p className="text-xs mt-1 text-center text-gray-800">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
   
  );
};

export default Category;



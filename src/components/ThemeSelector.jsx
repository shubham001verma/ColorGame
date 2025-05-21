import { useState, useContext, useEffect, useRef } from "react";
import { ThemeProviderContext } from "../contexts/theme-context";
import { Sun, Moon, Settings, Check, Plus } from "lucide-react";

export default function ThemeSelectorSidebar() {
  const { theme, setTheme, color, setColor } = useContext(ThemeProviderContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [customColor, setCustomColor] = useState(null);
  const colorPickerRef = useRef(null);

  const colors = [
    { value: "#415ef0", label: "Blue" },
   
    
  
   
  ];
  

  // Load theme & color from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedColor = localStorage.getItem("color");

    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setColor(savedColor);
  }, []);

  // Save theme & color to localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("color", color);
  }, [theme, color]);

  // Handle outside click for color picker
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPicker && colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  const handleColorChange = (newColor) => {
    setCustomColor(newColor);
    setColor(newColor);
    setShowPicker(false);
  };

  return (
    <>
      {/* Settings Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 p-4 bg-primary text-white rounded-full shadow-lg"
      >
        <Settings size={24} />
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed top-0 right-0 w-72 h-full shadow-lg z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: theme === "dark" ? "#0f1729" : "#ffffff", color: theme === "dark" ? "#ffffff" : "#000000" }}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Settings</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Theme Mode Selection */}
        <div className="p-4">
          <h4 className="font-semibold mb-2">Theme Option</h4>
          <div className="flex p-3 gap-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
                theme === "light" ? "bg-gray-200" : ""
              }`}
              onClick={() => setTheme("light")}
            >
              <Sun size={18} /> Light
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
                theme === "dark" ? "bg-gray-200" : ""
              }`}
              onClick={() => setTheme("dark")}
            >
              <Moon size={18} /> Dark
            </button>
          </div>

          {/* Theme Color Selection */}
          <h4 className="font-semibold mt-4 mb-2">Theme Colors</h4>
          <div className="grid grid-cols-3 gap-3 p-3 relative">
            {colors.map((c) => (
              <button
                key={c.value}
                className="w-10 h-10 rounded-full relative flex items-center justify-center"
                style={{ backgroundColor: c.value }}
                onClick={() => {
                  setColor(c.value);
                  setCustomColor(null);
                }}
              >
                {color === c.value && <Check size={20} className="text-white absolute" />}
              </button>
            ))}

            {/* Custom Color Picker */}
            {/* <div className="relative ">
              <input
                type="color"
                className="w-10 h-10 rounded-full cursor-pointer "
                ref={colorPickerRef}
                value={customColor }
                onChange={(e) => handleColorChange(e.target.value)}
                onClick={() => setShowPicker(true)}
              />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

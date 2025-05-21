/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
      
            extend: {
              colors: {
                primary: "var(--primary-color)",
                "primary-light": "var(--primary-light)",
              },
              ringColor: {
                primary: "var(--primary-color)",
              },
              animation: {
                'spin-slow': 'spin 2s linear infinite',
              }
            },
       
    },
    plugins: [],
};

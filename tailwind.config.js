module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        keyframes: {
          wiggle: {
            "0%, 100%": { transform: "rotate(-3deg)" },
            "50%": { transform: "rotate(3deg)" }
          }
        },
        animation: {
          wiggle: "wiggle 200ms ease-in-out",
          ping: "ping 400ms ease-in-out",
          pulse: "pulse 700ms ease-in-out"
        }
      }
    },
    plugins: [],
  }
  

  
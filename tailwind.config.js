/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        100: "27rem",
      },
      fontSize: {
        xxs: ["9px", "12px"],
      },
      colors: {
        btnColor: "#2D3540",
        secondaryColor: "#637381",
        primary: "#ffffff",
        backgroundColor: "#f1f1f1",
        errorText: "#ff3333",
      },
      boxShadow: {
        customSmall: "-5px 5px 0px 0px #000000",
        customBig: "-10px 11px 0px 0px #000000",
        customRightSmall: "7px 7px 0px 0px #000000",
      },
      scale: {
        115: "1.15",
      },
      animation: {
        "alert-slide-in": "slide-bottom 0.2s ease-in both;",
      },
      keyframes: {
        "slide-bottom": {
          "0%": {
            transform: "translateY(0)",
          },
          "100%": {
            transform: "translateY(100px)",
          },
        },
      },
    },
  },
  plugins: [],
};

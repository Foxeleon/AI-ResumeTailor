/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-background': '#FFF8F0', // Very light warm beige
                'brand-primary': '#FF7A59',    // A warm, vibrant coral/orange
                'brand-secondary': '#3D405B', // A deep, muted indigo for text
                'brand-accent': '#F2CC8F',     // A soft, warm gold
                'brand-light': '#FDF5E6',      // A lighter beige for cards
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-out forwards',
            },
        },
    },
    plugins: [],
}
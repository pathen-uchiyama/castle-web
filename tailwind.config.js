/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: '#12232E',
                gold: '#D4AF37',
                'gold-light': '#FCE181',
                teal: '#2D5A5A',
                'teal-light': '#7de0e0',
                rose: '#B33951',
                'rose-light': '#ff8fa3',
                alabaster: '#FAF9F6',
                cream: '#F4F1DE',
                parchment: '#F9F7F2',
                slate: '#626466',
                thistle: '#5D4B7A',
                obsidian: '#1A1A1B',
            },
            fontFamily: {
                header: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

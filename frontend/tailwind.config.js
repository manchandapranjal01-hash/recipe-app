/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                surface: '#0e0e0e',
                'surface-container': '#1a1a1a',
                'surface-container-high': '#20201f',
                'surface-container-highest': '#262626',
                'surface-container-low': '#131313',
                'surface-bright': '#2c2c2c',
                primary: '#91f78e',
                'primary-container': '#52b555',
                secondary: '#ff9800',
                'secondary-container': '#8b5000',
                tertiary: '#ffc87f',
                outline: '#767575',
                'outline-variant': '#484847',
                'on-surface-variant': '#adaaaa'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1.5rem',
            }
        },
    },
    plugins: [],
}

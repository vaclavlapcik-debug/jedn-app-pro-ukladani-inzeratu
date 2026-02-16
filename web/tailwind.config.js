/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                firebase: {
                    navy: '#0F172A', // Slate 900
                    surface: '#1E293B', // Slate 800
                    yellow: '#FFCA28', // Accent Primary
                    orange: '#F57C00', // Accent Secondary
                    red: '#EF4444', // Error
                },
                carvago: {
                    primary: '#FF5A00', // Vibrant Orange
                    bg: '#F3F4F6', // Light Gray Background
                    surface: '#FFFFFF', // White Card
                },
                slate: {
                    50: '#F8FAFC', // Text Main
                    400: '#94A3B8', // Text Muted
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

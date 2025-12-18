
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Therapeutic color palette
				serenity: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e'
				},
				lavender: {
					50: '#faf5ff',
					100: '#f3e8ff',
					200: '#e9d5ff',
					300: '#d8b4fe',
					400: '#c084fc',
					500: '#a855f7',
					600: '#9333ea',
					700: '#7c3aed',
					800: '#6b21a8',
					900: '#581c87'
				},
				mint: {
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d'
				},
				// Serenity Ocean - Premium Therapeutic Palette
				ocean: {
					primary: '#326B70',
					aqua: '#A8E4E0',
					light: '#EAFDFC',
					deep: '#164A4A',
					mist: '#C3F4EF'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'breathing': {
					'0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
					'50%': { transform: 'scale(1.05)', opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'float-slow': {
					'0%, 100%': { transform: 'translate(0, 0)' },
					'25%': { transform: 'translate(10px, -10px)' },
					'50%': { transform: 'translate(-5px, -20px)' },
					'75%': { transform: 'translate(-10px, -10px)' }
				},
				'drift': {
					'0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
					'33%': { transform: 'translate(30px, -30px) rotate(5deg)' },
					'66%': { transform: 'translate(-20px, 20px) rotate(-5deg)' }
				},
				'wave': {
					'0%': { transform: 'translateX(0) translateY(0)' },
					'25%': { transform: 'translateX(25px) translateY(-10px)' },
					'50%': { transform: 'translateX(0) translateY(-20px)' },
					'75%': { transform: 'translateX(-25px) translateY(-10px)' },
					'100%': { transform: 'translateX(0) translateY(0)' }
				},
				'gentle-pulse': {
					'0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' }
				},
				'ambient-glow': {
					'0%, 100%': { opacity: '0.3', filter: 'blur(40px)' },
					'50%': { opacity: '0.6', filter: 'blur(60px)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
				animation: {
					'accordion-down': 'accordion-down 0.2s ease-out',
					'accordion-up': 'accordion-up 0.2s ease-out',
					'breathing': 'breathing 4s ease-in-out infinite',
					'float': 'float 6s ease-in-out infinite',
					'float-slow': 'float-slow 12s ease-in-out infinite',
					'drift': 'drift 20s ease-in-out infinite',
					'wave': 'wave 8s ease-in-out infinite',
					'gentle-pulse': 'gentle-pulse 4s ease-in-out infinite',
					'ambient-glow': 'ambient-glow 6s ease-in-out infinite',
					'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
					'fade-in': 'fade-in 0.6s ease-out',
					'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
					'shimmer': 'shimmer 2s infinite'
				},
			backgroundImage: {
				'ocean-flow': 'linear-gradient(135deg, #EAFDFC 0%, #C3F4EF 25%, #A8E4E0 60%, #326B70 100%)',
				'ocean-mist': 'linear-gradient(180deg, #EAFDFC 0%, rgba(168, 228, 224, 0.3) 100%)',
				'glass-morphism': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))',
				'ambient-ocean': 'radial-gradient(circle at 50% 120%, #326B70 0%, #EAFDFC 100%)',
				'serenity-gradient': 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #faf5ff 75%, #f0fdf4 100%)',
				'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
				'therapeutic-gradient': 'linear-gradient(135deg, #bae6fd 0%, #e9d5ff 50%, #dcfce7 100%)'
			},
			blur: {
				xs: '2px',
				'3xl': '48px',
				'4xl': '64px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as PricingCard from '@/components/ui/pricing-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
	CheckCircle2,
	Users,
	Building,
	Briefcase,
	Crown,
	MessageCircle,
	Brain,
	Music,
	BookOpen,
	FileText,
	Heart,
	Activity,
	Sparkles,
	Video,
	Pill,
	Calendar,
	TrendingUp,
	Users2,
	Lock,
	Zap,
	Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { initiatePayment } from '@/services/razorpay';

interface PricingModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [currentSubscription, setCurrentSubscription] = useState<string>('free');

	useEffect(() => {
		if (user) {
			// Check if user is the specific Pro account
			if (user.email === 'codigomaestroinnovations@gmail.com') {
				setCurrentSubscription('pro');
			} else {
				setCurrentSubscription('free');
			}
		}
	}, [user]);

	const plans = [
		{
			icon: <Users />,
			description: 'Perfect for getting started',
			name: 'Free',
			price: '₹0',
			variant: 'outline',
			features: [
				{ text: 'Mental Health Quiz (PHQ-9 & GAD-7)', available: true },
				{ text: 'Motivational Quotes', available: true },
				{ text: 'Inspiring Stories', available: true },
				{ text: 'Wellness Tools (Basic)', available: true },
				{ text: 'E-Books Library (Limited)', available: true },
				{ text: 'Blog Feed Access', available: true },
				{ text: 'Basic Community Support', available: true },
			],
			buttonText: currentSubscription === 'free' ? 'Current Plan' : (user ? 'Sign Up Free' : 'Sign Up Free'),
			disabled: currentSubscription === 'free',
			priceInPaise: 0,
		},
		{
			icon: <Briefcase />,
			description: 'Ideal for personal growth',
			name: 'Pro',
			badge: 'Popular',
			price: '₹499',
			original: '₹999',
			period: '/month',
			variant: 'default',
			features: [
				{ text: 'All Free Plan Features', available: true },
				{ text: 'AI Therapist Chat (Unlimited)', available: true, icon: <MessageCircle className="h-4 w-4 text-purple-500" /> },
				{ text: 'Personal Journal Studio', available: true, icon: <FileText className="h-4 w-4 text-blue-500" /> },
				{ text: 'Mood Tracking & Analytics', available: true, icon: <Activity className="h-4 w-4 text-green-500" /> },
				{ text: 'Music Therapy (Personalized)', available: true, icon: <Music className="h-4 w-4 text-pink-500" /> },
				{ text: 'Guided Meditation Sessions', available: true, icon: <Sparkles className="h-4 w-4 text-indigo-500" /> },
				{ text: 'Yoga Asanas Library', available: true, icon: <Heart className="h-4 w-4 text-red-500" /> },
				{ text: 'Curated Video Library', available: true, icon: <Video className="h-4 w-4 text-orange-500" /> },
				{ text: 'Medicine Recommendations', available: true, icon: <Pill className="h-4 w-4 text-teal-500" /> },
				{ text: 'Connect with Doctors', available: true, icon: <Users2 className="h-4 w-4 text-cyan-500" /> },
				{ text: 'Full E-Books Access', available: true, icon: <BookOpen className="h-4 w-4 text-amber-500" /> },
				{ text: 'Priority Support', available: true },
			],
			buttonText: currentSubscription === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
			disabled: currentSubscription === 'pro',
			priceInPaise: 49900,
		},
		{
			icon: <Building />,
			name: 'Enterprise',
			description: 'For organizations & teams',
			price: '₹4,999',
			original: '₹9,999',
			period: '/month',
			variant: 'outline',
			features: [
				{ text: 'All Pro Plan Features', available: true },
				{ text: 'Multiple User Accounts (Up to 50)', available: true, icon: <Users className="h-4 w-4 text-violet-500" /> },
				{ text: 'Team Dashboard & Analytics', available: true, icon: <TrendingUp className="h-4 w-4 text-blue-600" /> },
				{ text: 'Custom Branding Options', available: true, icon: <Crown className="h-4 w-4 text-yellow-500" /> },
				{ text: 'Dedicated Account Manager', available: true, icon: <Users2 className="h-4 w-4 text-purple-600" /> },
				{ text: 'Advanced Security Features', available: true, icon: <Lock className="h-4 w-4 text-gray-600" /> },
				{ text: 'API Access for Integration', available: true, icon: <Zap className="h-4 w-4 text-yellow-600" /> },
				{ text: 'Custom Workshops & Training', available: true },
				{ text: 'Appointment Scheduling System', available: true, icon: <Calendar className="h-4 w-4 text-green-600" /> },
				{ text: '24/7 Premium Support', available: true },
				{ text: 'Quarterly Mental Health Reports', available: true },
			],
			buttonText: currentSubscription === 'enterprise' ? 'Current Plan' : 'Contact Sales',
			disabled: currentSubscription === 'enterprise',
			priceInPaise: 499900,
		},
	];

	const handlePlanSelect = async (planName: string) => {
		console.log('🎯 Plan selected:', planName);
		console.log('👤 User:', user ? 'Logged in' : 'Not logged in');
		console.log('📊 Current subscription:', currentSubscription);

		if (planName === 'Free') {
			if (!user) {
				console.log('➡️ Redirecting to auth for Free plan');
				navigate('/auth');
				onClose();
			}
			return;
		}

		if (planName === 'Enterprise') {
			console.log('📧 Opening email for Enterprise plan');
			// For enterprise, show contact form or email
			window.location.href = 'mailto:enterprise@serenityapp.com?subject=Enterprise Plan Inquiry';
			return;
		}

		// For Pro plan - Integrate Razorpay
		if (planName === 'Pro') {
			console.log('💎 Processing Pro plan selection');
			
			if (!user) {
				console.log('❌ User not logged in, redirecting to auth');
				navigate('/auth');
				onClose();
				return;
			}

			console.log('✅ User logged in, proceeding with payment');
			setIsProcessing(true);
			setSelectedPlan(planName);

			try {
				console.log('🚀 Calling initiatePayment...');
				
				// Close the pricing modal before opening Razorpay to avoid z-index conflicts
				onClose();
				
				await initiatePayment({
					planName: 'Pro',
					amount: 49900, // ₹499 in paise
					currency: 'INR',
					userId: user.id,
					userName: user.email?.split('@')[0] || 'User',
					userEmail: user.email || '',
				});
				console.log('✅ Payment initiated successfully');
			} catch (error) {
				console.error('❌ Payment error:', error);
				alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
			} finally {
				setIsProcessing(false);
				setSelectedPlan(null);
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
				<DialogHeader>
					<DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
						Choose Your Serenity Plan
					</DialogTitle>
					<p className="text-center text-muted-foreground mt-2">
						Unlock your full mental wellness journey
					</p>
				</DialogHeader>

				{/* Subtle dotted grid background */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 opacity-30 -z-10"
					style={{
						backgroundImage:
							'radial-gradient(rgba(147,51,234,0.15) 0.8px, transparent 0.8px)',
						backgroundSize: '14px 14px',
					}}
				/>

				<section className="grid gap-6 p-6 md:grid-cols-3 relative">
					{plans.map((plan) => (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
							whileHover={{ scale: 1.02 }}
						>
							<PricingCard.Card className={cn(
								"md:min-w-[260px] h-full",
								plan.name === 'Pro' && "border-purple-500 border-2 shadow-2xl shadow-purple-500/20"
							)}>
								<PricingCard.Header>
									<PricingCard.Plan>
										<PricingCard.PlanName>
											{plan.icon}
											<span className="text-muted-foreground">{plan.name}</span>
										</PricingCard.PlanName>
										{plan.badge && (
											<PricingCard.Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
												{plan.badge}
											</PricingCard.Badge>
										)}
									</PricingCard.Plan>
									<PricingCard.Price>
										<PricingCard.MainPrice className={cn(
											plan.name === 'Pro' && "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
										)}>
											{plan.price}
										</PricingCard.MainPrice>
										<PricingCard.Period>{plan.period}</PricingCard.Period>
										{plan.original && (
											<PricingCard.OriginalPrice className="ml-auto">
												{plan.original}
											</PricingCard.OriginalPrice>
										)}
									</PricingCard.Price>
									<Button
										variant={plan.variant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"}
										className={cn(
											'w-full font-semibold',
											plan.name === 'Pro' && 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
											plan.disabled && 'opacity-50 cursor-not-allowed'
										)}
										onClick={() => handlePlanSelect(plan.name)}
										disabled={plan.disabled || isProcessing}
									>
										{isProcessing && selectedPlan === plan.name ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin mr-2" />
												Processing...
											</>
										) : (
											plan.buttonText
										)}
									</Button>
								</PricingCard.Header>

								<PricingCard.Body>
									<PricingCard.Description>
										{plan.description}
									</PricingCard.Description>
									<PricingCard.List>
										{plan.features.map((feature) => (
											<PricingCard.ListItem key={feature.text}>
												{feature.icon || (
													<CheckCircle2
														className={cn(
															"h-4 w-4",
															feature.available ? "text-green-500" : "text-gray-300"
														)}
														aria-hidden="true"
													/>
												)}
												<span className={cn(
													!feature.available && "text-gray-400"
												)}>
													{feature.text}
												</span>
											</PricingCard.ListItem>
										))}
									</PricingCard.List>
								</PricingCard.Body>
							</PricingCard.Card>
						</motion.div>
					))}
				</section>

				<div className="text-center pb-4">
					<p className="text-sm text-muted-foreground">
						All plans include secure payment via Razorpay 🔒
					</p>
					<p className="text-xs text-muted-foreground mt-1">
						Cancel anytime. No hidden fees.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}

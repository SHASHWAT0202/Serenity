interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentDetails {
  planName: string;
  amount: number;
  currency: string;
  userId: string;
  userName?: string;
  userEmail?: string;
}

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initialize Razorpay payment
 */
export const initiatePayment = async (paymentDetails: PaymentDetails): Promise<void> => {
  const { planName, amount, currency, userId, userName, userEmail } = paymentDetails;

  console.log('🚀 Starting payment process...', paymentDetails);

  // Load Razorpay script
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    console.error('❌ Failed to load Razorpay SDK');
    throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
  }

  console.log('✅ Razorpay SDK loaded successfully');

  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  console.log('🔑 Razorpay Key ID:', razorpayKeyId ? 'Found' : 'NOT FOUND');
  
  if (!razorpayKeyId) {
    console.error('❌ Razorpay key not configured');
    throw new Error('Razorpay key not configured. Please contact support.');
  }

  // Log payment initiation (in real app, create backend record)
  console.log('💳 Initiating payment:', {
    plan: planName,
    amount: amount / 100,
    currency: currency,
    user: userId
  });

  const options: RazorpayOptions = {
    key: razorpayKeyId,
    amount: amount, // Amount in paise (smallest currency unit)
    currency: currency,
    name: 'Serenity - Mental Wellness',
    description: `${planName} Plan Subscription`,
    image: '/images/logo.png', // Add your logo
    handler: async (response: RazorpayResponse) => {
      try {
        // Log payment details (in real app, send to backend)
        console.log('Payment successful:', {
          payment_id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          signature: response.razorpay_signature,
          plan: planName,
          amount: amount,
          user: userId
        });

        // Show success message
        alert(
          `🎉 Payment Successful!\n\nYour ${planName} plan payment has been received.\n\nPayment ID: ${response.razorpay_payment_id}\n\nThank you for choosing Serenity!`
        );
        
        // Close modal or redirect
        window.location.reload();
      } catch (error) {
        console.error('Error processing payment success:', error);
        alert('Payment received! Thank you for your purchase.');
      }
    },
    prefill: {
      name: userName || '',
      email: userEmail || '',
      contact: '9999999999', // Placeholder contact number (users can change it)
    },
    notes: {
      plan_name: planName,
      user_id: userId,
    },
    theme: {
      color: '#9333EA', // Purple-600
    },
    modal: {
      ondismiss: () => {console.log('Payment cancelled by user');
      },
    },
  };

  console.log('🎨 Opening Razorpay checkout with options:', {
    key: razorpayKeyId,
    amount,
    currency,
    name: options.name
  });

  const razorpay = new window.Razorpay(options);
  razorpay.open();
  
  console.log('✅ Razorpay checkout opened');
};

/**
 * Get user's current subscription details (simplified - no database)
 */
export const getUserSubscription = async (userId: string) => {
  // This is a placeholder for future database integration
  console.log('getUserSubscription called for:', userId);
  return null;
};

/**
 * Get user's payment history (simplified - no database)
 */
export const getPaymentHistory = async (userId: string) => {
  // This is a placeholder for future database integration
  console.log('getPaymentHistory called for:', userId);
  return [];
};
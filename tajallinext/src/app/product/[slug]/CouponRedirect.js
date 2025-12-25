'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CouponRedirect = ({ coupon, autoApply }) => {
    const router = useRouter();

    useEffect(() => {
        // Store coupon details in localStorage
        localStorage.setItem('tempCouponDetails', JSON.stringify({
            coupon,
            autoApply
        }));
        
        // Redirect to order confirmation
        router.push('/OrderConfirmation');
    }, [coupon, autoApply, router]);

    return null; // This component doesn't render anything
};

export default CouponRedirect; 
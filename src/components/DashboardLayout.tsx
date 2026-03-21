import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Add this inside your DashboardLayout component
const mainContentRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (mainContentRef.current) {
    gsap.fromTo(mainContentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }
}, []);

// Wrap your main content with:
<div ref={mainContentRef} className="flex-1 overflow-auto p-6">
  {children}
</div>

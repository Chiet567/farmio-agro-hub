import gsap from 'gsap';

// Fade in animation for page content
export const fadeIn = (element: HTMLElement) => {
  gsap.fromTo(element, 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
  );
};

// Stagger animation for cards
export const staggerCards = (elements: HTMLElement[]) => {
  gsap.fromTo(elements,
    { opacity: 0, y: 30 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      stagger: 0.1,
      ease: "back.out(0.4)"
    }
  );
};

// Hover animation for cards
export const addHoverAnimation = (element: HTMLElement) => {
  element.addEventListener('mouseenter', () => {
    gsap.to(element, { scale: 1.02, duration: 0.2, ease: "power2.out" });
  });
  element.addEventListener('mouseleave', () => {
    gsap.to(element, { scale: 1, duration: 0.2, ease: "power2.out" });
  });
};

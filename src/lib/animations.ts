// Fade in animation for page content
export const fadeIn = (element: HTMLElement) => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
  requestAnimationFrame(() => {
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  });
};

// Stagger animation for cards
export const staggerCards = (elements: HTMLElement[]) => {
  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, i * 100);
  });
};

// Hover animation for cards
export const addHoverAnimation = (element: HTMLElement) => {
  element.style.transition = 'transform 0.2s ease-out';
  element.addEventListener('mouseenter', () => {
    element.style.transform = 'scale(1.02)';
  });
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'scale(1)';
  });
};

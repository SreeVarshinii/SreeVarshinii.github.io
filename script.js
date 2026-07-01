// script.js
// Simplified academic navigation and footer automation

document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------------------------
     1. Dynamic Footer Year
  ------------------------------------------- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------
     2. Smooth Scroll for Anchor Links
  ------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Offset for fixed header navigation
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Push hash state silently
        history.pushState(null, '', targetId);
      }
    });
  });

  /* -------------------------------------------
     3. Collapsible Scholar Cards Accordions
  ------------------------------------------- */
  const cards = document.querySelectorAll('.scholar-card:not(.no-collapse)');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Do not collapse/expand if clicking an anchor link inside card details
      if (e.target.closest('a')) return;

      const isExpanded = card.classList.contains('expanded');
      
      // Optional: Collapse other cards in the same list to keep interface compact
      // const parentList = card.parentElement;
      // parentList.querySelectorAll('.scholar-card.expanded').forEach(expandedCard => {
      //   if (expandedCard !== card) expandedCard.classList.remove('expanded');
      // });

      card.classList.toggle('expanded');
    });

    // Support keyboard activation (Enter or Space) for accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        // Prevent default page scroll on Spacebar
        e.preventDefault();
        card.click();
      }
    });
  });
});

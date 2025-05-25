// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Set site last updated date in footer
const siteLastUpdatedElement = document.getElementById('siteLastUpdated');
if (siteLastUpdatedElement) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    siteLastUpdatedElement.textContent = today.toLocaleDateString(undefined, options);
}

// Custom Smooth Scroll
function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

function customSmoothScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distanceY = targetY - startY;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const nextY = easeInOutQuad(timeElapsed, startY, distanceY, duration);

        window.scrollTo(0, nextY);

        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = document.querySelector('.sticky.top-0.z-50')?.offsetHeight || 0;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            customSmoothScrollTo(offsetPosition, 800); // 800ms duration for a smoother feel
        }
    });
});

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('themeToggleCheckbox');
const htmlElement = document.documentElement;
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function applyTheme(theme) {
    htmlElement.classList.remove('light', 'dark');
    htmlElement.classList.add(theme);

    if (theme === 'dark') {
        if(moonIcon) moonIcon.classList.remove('hidden');
        if(sunIcon) sunIcon.classList.add('hidden');
        if(themeToggle) themeToggle.checked = true;
    } else { // Light mode
        if(sunIcon) sunIcon.classList.remove('hidden');
        if(moonIcon) moonIcon.classList.add('hidden');
        if(themeToggle) themeToggle.checked = false;
    }
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    applyTheme(savedTheme);
} else if (prefersDark) {
    applyTheme('dark');
} else {
    applyTheme('dark'); // Default to dark
}

if (themeToggle) {
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) { // Only if no user override
        applyTheme(e.matches ? 'dark' : 'light');
    }
});
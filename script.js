document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const questionView = document.getElementById('question-view');
    const successView = document.getElementById('success-view');
    const rainContainer = document.getElementById('rain-container');
    const card = document.querySelector('.card');

    // --- Rain Engine ---
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('rain-heart');
        heart.innerText = '❤'; // Using emoji for crisp hearts

        // Random horizontal position (0 to 100vw)
        heart.style.left = Math.random() * 100 + 'vw';

        // Random falling speed
        const duration = Math.random() * 3 + 4; // Between 4s and 7s
        heart.style.animationDuration = duration + 's';

        // Random size
        const size = Math.random() * 1.5 + 1; // 1rem to 2.5rem
        heart.style.fontSize = size + 'rem';

        rainContainer.appendChild(heart);

        // Cleanup after animation finishes
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Start rain loop
    setInterval(createHeart, 300); // New heart every 300ms

    // --- Interaction Logic ---

    // "Yes" Click
    yesBtn.addEventListener('click', () => {
        // Switch Views
        questionView.classList.remove('active');
        questionView.classList.add('hidden');

        // Timeout to allow fade out if we added transitions (optional polish)
        setTimeout(() => {
            questionView.style.display = 'none';
            successView.classList.remove('hidden');
            successView.classList.add('active');
        }, 100);

        // Intensify Rain for Celebration
        for (let i = 0; i < 30; i++) {
            setTimeout(createHeart, i * 100);
        }
    });

    // "No" Run Away Logic
    let currentScale = 1.0;

    const moveNoButton = () => {
        // Decrease scale
        currentScale = Math.max(0.2, currentScale - 0.1);
        noBtn.style.transform = `scale(${currentScale})`;

        // Ensure absolute position is set
        if (noBtn.style.position !== 'absolute') {
            noBtn.style.position = 'absolute';
        }

        // Use offset dimensions (relative to .card since wrapper is static)
        // Card padding is included in the coordinate space of 'absolute' children
        // (0,0) is the top-left of padding box

        const cardWidth = card.clientWidth;  // Width inside borders (includes padding)
        const cardHeight = card.clientHeight; // Height inside borders

        const btnW = noBtn.offsetWidth;
        const btnH = noBtn.offsetHeight;

        // Safety margin
        const margin = 20;

        // Bounding boxes for obstacles (relative to card padding box)

        // Yes Button
        const yesBox = {
            left: yesBtn.offsetLeft,
            top: yesBtn.offsetTop,
            right: yesBtn.offsetLeft + yesBtn.offsetWidth,
            bottom: yesBtn.offsetTop + yesBtn.offsetHeight
        };

        // Main Text (title)
        const title = document.querySelector('.main-text');
        const titleBox = {
            left: title.offsetLeft,
            top: title.offsetTop,
            right: title.offsetLeft + title.offsetWidth,
            bottom: title.offsetTop + title.offsetHeight
        };

        const isOverlapping = (rect1, rect2) => {
            const buffer = 30; // Extra buffer around text/buttons
            return !(rect1.right + buffer < rect2.left ||
                rect1.left - buffer > rect2.right ||
                rect1.bottom + buffer < rect2.top ||
                rect1.top - buffer > rect2.bottom);
        };

        let isValid = false;
        let attempts = 0;
        let newX, newY;

        while (!isValid && attempts < 100) {
            attempts++;

            // Generate random position within FULL card content area
            // We restrain it to stay fully inside
            const maxX = cardWidth - btnW - margin;
            const maxY = cardHeight - btnH - margin;

            newX = Math.random() * maxX;
            // Ensure strictly positive (avoid clipping left/top)
            if (newX < margin) newX = margin;

            newY = Math.random() * maxY;
            if (newY < margin) newY = margin;

            const proposedBox = {
                left: newX,
                top: newY,
                right: newX + btnW,
                bottom: newY + btnH
            };

            if (!isOverlapping(proposedBox, yesBox) && !isOverlapping(proposedBox, titleBox)) {
                isValid = true;
            }
        }

        // Fallback: if stuck, just verify boundary
        if (isValid) {
            noBtn.style.left = `${newX}px`;
            noBtn.style.top = `${newY}px`;
        }
    }

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
    });
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });
});

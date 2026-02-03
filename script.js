document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const questionCard = document.getElementById('questionCard');
    const successCard = document.getElementById('successCard');
    const mainText = document.getElementById('mainText');

    // Initial size scale for No button
    let currentScale = 1.0;

    // Yes Button Click - Switch Cards
    yesBtn.addEventListener('click', () => {
        questionCard.classList.add('hidden');
        successCard.classList.remove('hidden');
    });

    // No Button Interaction
    noBtn.addEventListener('mouseover', moveButton);
    // For touch devices
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });

    function moveButton() {
        // Decrease size
        currentScale -= 0.1;
        if (currentScale < 0.2) currentScale = 0.2; // Minimum size cap
        noBtn.style.transform = `scale(${currentScale})`;

        // Get bounds
        const cardRect = questionCard.getBoundingClientRect();
        const yesRect = yesBtn.getBoundingClientRect();
        const textRect = mainText.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect(); // Current size

        // We calculate positions relative to the CARD, not viewport
        // The card has padding: 2rem = 32px approx
        const padding = 32;

        // Safe area dimensions within the card
        // Note: Card is flex column. We need absolute coords relative to card top-left.
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;

        // Element dimensions relative to viewport need to be converted to relative to card
        const relativeYes = {
            top: yesRect.top - cardRect.top,
            left: yesRect.left - cardRect.left,
            bottom: yesRect.bottom - cardRect.top,
            right: yesRect.right - cardRect.left
        };

        const relativeText = {
            top: textRect.top - cardRect.top,
            left: textRect.left - cardRect.left,
            bottom: textRect.bottom - cardRect.top,
            right: textRect.right - cardRect.left
        };

        let foundSafeSpot = false;
        let newTop, newLeft;
        let attempts = 0;
        const maxAttempts = 50;

        while (!foundSafeSpot && attempts < maxAttempts) {
            attempts++;

            // Random position inside card (accounting for padding and button size)
            // Button size is dynamic due to scale, use approx original size * scale or just a safe margin
            const btnWidth = 80 * currentScale;
            const btnHeight = 40 * currentScale;

            newLeft = padding + Math.random() * (cardWidth - 2 * padding - btnWidth);
            newTop = padding + Math.random() * (cardHeight - 2 * padding - btnHeight);

            // Check Collision
            const proposedRect = {
                top: newTop,
                left: newLeft,
                bottom: newTop + btnHeight,
                right: newLeft + btnWidth
            };

            if (!isOverlapping(proposedRect, relativeYes) && !isOverlapping(proposedRect, relativeText)) {
                foundSafeSpot = true;
            }
        }

        // Check if we switched to absolute yet?
        // To move freely, we must set position absolute.
        // Initially it's in a flexbox. When we move it, we switch to absolute.
        if (noBtn.style.position !== 'absolute') {
            noBtn.style.position = 'absolute';
        }

        noBtn.style.left = `${newLeft}px`;
        noBtn.style.top = `${newTop}px`;
    }

    function isOverlapping(rect1, rect2) {
        // Add a small buffer to collision detection
        const buffer = 10;
        return !(rect1.right + buffer < rect2.left ||
            rect1.left - buffer > rect2.right ||
            rect1.bottom + buffer < rect2.top ||
            rect1.top - buffer > rect2.bottom);
    }
});

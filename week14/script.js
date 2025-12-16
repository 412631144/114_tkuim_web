document.addEventListener('DOMContentLoaded', () => {
    // Basic interaction setup
    console.log('Versus Clone Initialized');

    // Attach click events to all cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const content = card.getAttribute('data-content');
            if (title && content) {
                openModal(title, content);
            }
        });
    });

    // Attach click event to user icon for login
    const userIcon = document.querySelector('.user-icon');
    if (userIcon) {
        userIcon.addEventListener('click', () => {
            openLoginModal();
        });
    }

    // Close buttons logic
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card click if nested (though it shouldn't be)
            const modal = btn.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });
});

function openModal(title, content) {
    const modal = document.getElementById('modal-overlay');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');

    titleEl.textContent = title;
    bodyEl.textContent = content;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function openLoginModal() {
    const modal = document.getElementById('login-modal-overlay');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalElement) {
    if (!modalElement) {
        // if no element passed, close all
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    } else {
        modalElement.classList.remove('active');
    }
    document.body.style.overflow = '';
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal-overlay');
    closeModal(modal);
}

// Function to switch views
function showView(viewId) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
    });

    // Special logic for 'landing' or 'grid' -> they map to 'home-view'
    let targetId = viewId + '-view';
    if (viewId === 'landing' || viewId === 'grid') {
        targetId = 'home-view';
    }

    const targetView = document.getElementById(targetId);
    if (targetView) {
        targetView.classList.add('active');
        // If switching to home, ensure we start at top unless specfied
        if (viewId === 'landing') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

function scrollToSection(sectionId) {
    // Ensure we are on home view first
    showView('landing'); // Activates home view

    setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

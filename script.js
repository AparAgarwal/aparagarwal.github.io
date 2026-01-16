/* ============================================
   CONFIGURATION CONSTANTS
   ============================================ */
const CONFIG = {
    typing: {
        texts: ["Software Developer", "Web Developer", "Tech Enthusiast"],
        typeSpeed: 150,
        deleteSpeed: 100,
        pauseDuration: 1000
    },
    carousel: {
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Git', 'GitHub', 'REST APIs', 'Docker', 'Postman'],
        baseSpeed: 0.5,
        velocityEffect: 0.5
    },
    cursor: {
        smoothness: 0.2
    },
    cards: {
        dragThreshold: 100,
        swapDuration: 500,
        scaleFactor: 0.05,
        offsetY: 20
    },
    lenis: {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    }
};

const PROJECTS_DATA = [
    {
        title: "News Website",
        description: "Clean and mobile-friendly news website showcasing up-to-date articles with a focus on readability and responsiveness.",
        tech: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/AparAgarwal/News-Website"
    },
    {
        title: "Kernel Canvas",
        description: "A drag-and-drop interface for Docker container management with real-time monitoring and visual orchestration.",
        tech: ["React", "Node.js", "Docker", "Material-UI", "Socket.io"],
        github: "https://github.com/AparAgarwal/KernelCanvas"
    },
    {
        title: "Campus Navigator",
        description: "A Flutter-based mobile application designed to help users navigate around campus with interactive maps, real-time location tracking, and route planning.",
        tech: ["Flutter", "Dart", "Google Maps API", "OpenRouteService"],
        github: "https://github.com/AparAgarwal/campus-navigator"
    },
    {
        title: "URL Shortener",
        description: "A modern, secure URL shortening service with user authentication, click analytics, input validation, and a clean web interface with RESTful API.",
        tech: ["Node.js", "Express", "MongoDB", "JWT", "EJS"],
        github: "https://github.com/AparAgarwal/url-shortener"
    },
    {
        title: "Library Management System",
        description: "A full-stack library management platform with robust backend architecture, role-based access control, and Docker-optimized deployment.",
        tech: ["React", "Node.js", "Express", "PostgreSQL", "Redis", "Docker"],
        github: "https://github.com/AparAgarwal/library-management-v2"
    },
];

/* ============================================
   TYPING EFFECT
   ============================================ */
/**
 * Implements a typing and erasing text animation effect
 * @class TypingEffect
 */
class TypingEffect {
    constructor(element, texts, config) {
        this.element = element;
        this.texts = texts;
        this.config = config;
        this.currentIndex = 0;
        this.charIndex = 0;
    }

    /**
     * Types out the current text character by character
     */
    type() {
        if (this.charIndex < this.texts[this.currentIndex].length) {
            this.element.textContent += this.texts[this.currentIndex].charAt(this.charIndex++);
            setTimeout(() => this.type(), this.config.typeSpeed);
        } else {
            setTimeout(() => this.erase(), this.config.pauseDuration);
        }
    }

    /**
     * Erases the current text character by character
     */
    erase() {
        if (this.charIndex > 0) {
            this.element.textContent = this.texts[this.currentIndex].substring(0, this.charIndex - 1);
            this.charIndex--;
            setTimeout(() => this.erase(), this.config.deleteSpeed);
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            setTimeout(() => this.type(), this.config.typeSpeed);
        }
    }

    /**
     * Starts the typing effect animation
     */
    start() {
        this.type();
    }
}

/* ============================================
   SMOOTH SCROLL & LENIS
   ============================================ */
/**
 * Initializes Lenis smooth scrolling
 * @returns {Lenis} Lenis instance
 */
const initializeSmoothScroll = () => {
    const lenis = new Lenis(CONFIG.lenis);

    const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return lenis;
};

/**
 * Sets up smooth scroll for anchor links
 * @param {Lenis} lenis - Lenis instance
 */
const setupAnchorLinks = (lenis) => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement);
            }
        });
    });
};

/* ============================================
   SKILLS CAROUSEL
   ============================================ */
/**
 * Populates a carousel track with skill items
 * @param {HTMLElement} track - The carousel track element
 * @param {Array} skills - Array of skill names
 */
const populateCarouselTrack = (track, skills) => {
    if (!track) return;

    track.innerHTML = '';

    // Create one set of skills
    skills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.textContent = skill;
        track.appendChild(item);
    });

    // Clone 4 times for seamless infinite scroll
    const originalItems = Array.from(track.children);
    for (let i = 0; i < 4; i++) {
        originalItems.forEach(item => track.appendChild(item.cloneNode(true)));
    }
};

/**
 * Animates the carousel tracks
 * @param {HTMLElement} trackForward - Forward moving track
 * @param {HTMLElement} trackReverse - Reverse moving track
 * @param {Lenis} lenis - Lenis instance for velocity
 */
const animateCarousel = (trackForward, trackReverse, lenis) => {
    if (!trackForward || !trackReverse) return;

    let posForward = 0;
    let posReverse = 0;
    let setWidth = 0;

    const calculateWidth = () => {
        if (trackForward) {
            setWidth = trackForward.scrollWidth / 5; // 1 original + 4 clones
        }
    };

    window.addEventListener('resize', calculateWidth);
    setTimeout(calculateWidth, 100);

    const animate = () => {
        if (setWidth > 0) {
            const velocity = lenis.velocity || 0;
            const baseSpeed = CONFIG.carousel.baseSpeed;
            const velocityEffect = CONFIG.carousel.velocityEffect;

            // Forward track: moves left (0 -> -setWidth)
            const moveF = -baseSpeed - (velocity * velocityEffect);
            posForward += moveF;

            // Reverse track: moves right (-setWidth -> 0)
            const moveR = baseSpeed + (velocity * velocityEffect);
            posReverse += moveR;

            // Wrap logic
            if (posForward <= -setWidth) posForward += setWidth;
            if (posForward > 0) posForward -= setWidth;

            if (posReverse >= 0) posReverse -= setWidth;
            if (posReverse < -setWidth) posReverse += setWidth;

            trackForward.style.transform = `translateX(${posForward}px)`;
            trackReverse.style.transform = `translateX(${posReverse}px)`;
        }
        requestAnimationFrame(animate);
    };

    animate();
};

/* ============================================
   MOBILE MENU
   ============================================ */
/**
 * Initializes hamburger menu functionality
 */
const initializeMobileMenu = () => {
    const hamburger = document.querySelector(".hamburger-menu");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links a");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("nav-active");
            hamburger.classList.toggle("toggle");

            // Update ARIA attribute
            const isExpanded = navLinks.classList.contains("nav-active");
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("nav-active");
                hamburger.classList.remove("toggle");
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }
};

/* ============================================
   CUSTOM CURSOR
   ============================================ */
/**
 * Initializes custom cursor with smooth following effect
 */
const initializeCustomCursor = () => {
    const cursorDot = document.querySelector("[data-cursor-dot]");
    if (!cursorDot) return;

    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    // Track mouse position
    window.addEventListener("mousemove", (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    // Smooth animation loop with LERP (Linear Interpolation)
    const animateCursor = () => {
        const speed = CONFIG.cursor.smoothness;

        dotX += (cursorX - dotX) * speed;
        dotY += (cursorY - dotY) * speed;

        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;

        requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Hide cursor on interactive elements
    const interactiveElements = document.querySelectorAll("a, button, input, textarea, .hamburger-menu");

    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => cursorDot.classList.add("hidden"));
        el.addEventListener("mouseleave", () => cursorDot.classList.remove("hidden"));
    });

    // Event delegation for dynamically rendered elements
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest('.window-dots') || e.target.closest('.github-btn')) {
            cursorDot.classList.add("hidden");
        }
    });

    document.addEventListener("mouseout", (e) => {
        if (e.target.closest('.window-dots') || e.target.closest('.github-btn')) {
            cursorDot.classList.remove("hidden");
        }
    });
};

/* ============================================
   STACKED CARDS (PROJECTS)
   ============================================ */
/**
 * Renders project cards into the stack container
 * @param {HTMLElement} container - Stack container element
 * @param {Array} projects - Array of project objects
 */
const renderProjectCards = (container, projects) => {
    if (!container) return;

    container.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'stack-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="window-dots">
                    <span class="dot-red"></span>
                    <span class="dot-yellow"></span>
                    <span class="dot-green"></span>
                </div>
            </div>
            <div class="card-content">
                <h3>${project.title}</h3>
                <div class="tech-tags">
                    ${project.tech.map(t => `<span>${t}</span>`).join('')}
                </div>
                <p>${project.description}</p>
                <a href="${project.github}" target="_blank" class="github-btn"><i class="fab fa-github"></i> GitHub</a>
            </div>
        `;
        container.appendChild(card);
    });
};

/**
 * Initializes card stack drag and swap functionality
 * @param {HTMLElement} stackContainer - The stack container element
 */
const initializeCardStack = (stackContainer) => {
    if (!stackContainer) return;

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let activeCard = null;

    const threshold = CONFIG.cards.dragThreshold;
    const swapDuration = CONFIG.cards.swapDuration;

    /**
     * Performs card swap animation
     * @param {HTMLElement} card - Card to swap
     * @param {number} direction - Direction multiplier (1 or -1)
     */
    const swapTopCard = (card, direction = 1) => {
        if (!card) return;

        // Fly out animation
        card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        card.style.transform = `translateX(${direction * 1000}px) rotate(${direction * 45}deg)`;
        card.style.opacity = '0';

        // Reorder stack
        setTimeout(() => {
            stackContainer.prepend(card);

            card.style.transition = 'none';
            card.style.transform = 'scale(0.8) translateY(-60px)';
            card.style.opacity = '0';
            card.style.cursor = 'grab';

            void card.offsetWidth; // Force reflow

            updateStack();
        }, 300);
    };

    /**
     * Updates stack positioning and event listeners
     */
    const updateStack = () => {
        const currentCards = Array.from(document.querySelectorAll('.stack-card'));

        // Remove all listeners first
        currentCards.forEach(card => {
            card.style.cursor = 'default';
            card.removeEventListener('mousedown', handleDragStart);
            card.removeEventListener('touchstart', handleDragStart);

            const dots = card.querySelector('.window-dots');
            if (dots) dots.onclick = null;
        });

        // Update positioning
        currentCards.forEach((card, index) => {
            const scaleFactor = CONFIG.cards.scaleFactor;
            const offsetY = CONFIG.cards.offsetY;
            const position = currentCards.length - 1 - index;

            card.style.zIndex = index;
            card.style.transform = `scale(${1 - position * scaleFactor}) translateY(-${position * offsetY}px)`;
            card.style.opacity = index < currentCards.length - 3 ? 0 : 1;
            card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease';
        });

        // Add listeners to top card
        const topCard = currentCards[currentCards.length - 1];
        if (topCard) {
            topCard.style.cursor = 'grab';
            topCard.addEventListener('mousedown', handleDragStart);
            topCard.addEventListener('touchstart', handleDragStart);

            const dots = topCard.querySelector('.window-dots');
            if (dots) {
                dots.onclick = (e) => {
                    e.stopPropagation();
                    swapTopCard(topCard, 1);
                };
            }
        }
    };

    /**
     * Handles drag start event
     * @param {Event} e - Mouse or touch event
     */
    const handleDragStart = function (e) {
        if (e.target.closest('.github-btn') || e.target.closest('.window-dots')) return;

        isDragging = true;
        activeCard = this;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        currentX = startX;
        activeCard.style.cursor = 'grabbing';
        activeCard.style.transition = 'none';

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('touchmove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
    };

    /**
     * Handles drag move event
     * @param {Event} e - Mouse or touch event
     */
    const handleDragMove = (e) => {
        if (!isDragging || !activeCard) return;

        currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diffX = currentX - startX;
        const rotate = diffX * 0.05;

        activeCard.style.transform = `translateX(${diffX}px) rotate(${rotate}deg)`;
    };

    /**
     * Handles drag end event
     */
    const handleDragEnd = () => {
        if (!isDragging || !activeCard) return;

        isDragging = false;

        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchend', handleDragEnd);

        const diffX = currentX - startX;

        if (Math.abs(diffX) > threshold) {
            const direction = diffX > 0 ? 1 : -1;
            swapTopCard(activeCard, direction);
        } else {
            activeCard.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            activeCard.style.transform = 'scale(1) translateY(0)';
        }

        activeCard = null;
        currentX = 0;
        startX = 0;
    };

    updateStack();
};

/* ============================================
   MAIN INITIALIZATION
   ============================================ */
/**
 * Main initialization function called on DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
    // Initialize typing effect
    const typingElement = document.querySelector(".typing-effect");
    if (typingElement) {
        const typingEffect = new TypingEffect(
            typingElement,
            CONFIG.typing.texts,
            CONFIG.typing
        );
        typingEffect.start();
    }

    // Initialize smooth scroll
    const lenis = initializeSmoothScroll();
    setupAnchorLinks(lenis);

    // Initialize skills carousel
    const trackForward = document.querySelector('.track-forward');
    const trackReverse = document.querySelector('.track-reverse');

    if (trackForward && trackReverse) {
        populateCarouselTrack(trackForward, CONFIG.carousel.skills);
        populateCarouselTrack(trackReverse, CONFIG.carousel.skills);
        animateCarousel(trackForward, trackReverse, lenis);
    }

    // Initialize mobile menu
    initializeMobileMenu();

    // Initialize custom cursor
    initializeCustomCursor();

    // Initialize project cards
    const stackContainer = document.querySelector('.card-stack');
    if (stackContainer) {
        renderProjectCards(stackContainer, PROJECTS_DATA);
        initializeCardStack(stackContainer);
    }

    // Initialize resume viewer
    initializeResumeViewer();
});

/* ============================================
   RESUME VIEWER - MAC WINDOW STYLE
   ============================================ */
/**
 * Initializes resume viewer modal functionality
 */
const initializeResumeViewer = () => {
    const overlay = document.getElementById('resumeViewerOverlay');
    const openBtn = document.getElementById('openResumeViewer');
    const closeBtn = document.getElementById('closeResumeViewer');

    // Open modal
    if (openBtn && overlay) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal
    const closeModal = () => {
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
            closeModal();
        }
    });
};


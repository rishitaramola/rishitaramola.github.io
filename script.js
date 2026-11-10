// ============================================
// RISHITA RAMOLA — PORTFOLIO INTERACTIONS
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    initParticles();
    initCursorGlow();
    initNavigation();
    initTypewriter();
    initScrollAnimations();
    initCountUp();
});


// ============================================
// PARTICLE BACKGROUND
// ============================================

function initParticles() {
    const canvas = document.getElementById("particleCanvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    let particles = [];
    let animationFrame;
    let width = 0;
    let height = 0;
    let time = 0;

    const particleCount = Math.min(
        65,
        Math.max(25, Math.floor(window.innerWidth / 22))
    );

    function resize() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * ratio;
        canvas.height = height * ratio;

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;

            this.size = Math.random() * 1.5 + 0.3;

            this.speedX = (Math.random() - 0.5) * 0.35;
            this.speedY = (Math.random() - 0.5) * 0.35;

            this.opacity = Math.random() * 0.4 + 0.1;

            this.pulseSpeed = Math.random() * 0.018 + 0.005;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            this.currentOpacity =
                this.opacity *
                (
                    0.5 +
                    0.5 *
                    Math.sin(
                        time * this.pulseSpeed + this.pulseOffset
                    )
                );

            if (
                this.x < -10 ||
                this.x > width + 10 ||
                this.y < -10 ||
                this.y > height + 10
            ) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(162, 155, 254, ${this.currentOpacity})`;

            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {

                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 115) {

                    const opacity =
                        0.065 * (1 - distance / 115);

                    ctx.beginPath();

                    ctx.moveTo(
                        particles[i].x,
                        particles[i].y
                    );

                    ctx.lineTo(
                        particles[j].x,
                        particles[j].y
                    );

                    ctx.strokeStyle =
                        `rgba(108, 92, 231, ${opacity})`;

                    ctx.lineWidth = 0.5;

                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (document.hidden) {
            animationFrame = null;
            return;
        }

        ctx.clearRect(0, 0, width, height);

        time++;

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();

        animationFrame = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (!animationFrame) {
            animate();
        }
    }

    function stopAnimation() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }

    resize();
    createParticles();
    startAnimation();

    window.addEventListener("resize", () => {
        resize();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
}


// ============================================
// CURSOR GLOW
// ============================================

function initCursorGlow() {
    const glow = document.getElementById("cursorGlow");

    if (!glow) return;

    const isDesktop = window.matchMedia(
        "(min-width: 768px) and (hover: hover)"
    );

    if (!isDesktop.matches) {
        glow.style.display = "none";
        return;
    }

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    document.addEventListener("mousemove", event => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        glow.style.opacity = "1";
    });

    document.addEventListener("mouseleave", () => {
        glow.style.opacity = "0";
    });

    function updateGlow() {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;

        glow.style.left = currentX + "px";
        glow.style.top = currentY + "px";

        requestAnimationFrame(updateGlow);
    }

    updateGlow();
}


// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");

    if (!nav) return;

    // Navbar background on scroll

    function updateNavbar() {
        if (window.scrollY > 45) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });

    updateNavbar();


    // Mobile navigation

    function closeMenu() {
        if (!toggle || !links) return;

        toggle.classList.remove("active");
        links.classList.remove("active");

        toggle.setAttribute("aria-expanded", "false");

        document.body.classList.remove("menu-open");
    }

    if (toggle && links) {

        toggle.addEventListener("click", () => {

            const isOpen = links.classList.toggle("active");

            toggle.classList.toggle("active", isOpen);

            toggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );
        });

        links.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }


    // Active navigation link

    const sections = document.querySelectorAll(
        "section[id]"
    );

    const navLinks = document.querySelectorAll(
        ".nav-link"
    );

    if ("IntersectionObserver" in window) {

        const navObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    navLinks.forEach(link => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") ===
                            "#" + currentId
                        );
                    });
                });

            },
            {
                rootMargin: "-30% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }
}


// ============================================
// TYPEWRITER
// ============================================

function initTypewriter() {
    const element = document.getElementById("typewriter");

    if (!element) return;

    const phrases = [
        "AI/ML Developer",
        "Full-Stack Developer",
        "NLP & Agentic Systems Builder",
        "Computer Vision Enthusiast",
        "Orator & Debater",
        "Creative Problem Solver"
    ];

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
        element.textContent = phrases[0];
        return;
    }

    let phraseIndex = 0;
    let charIndex = 0;

    let deleting = false;

    function type() {
        const phrase = phrases[phraseIndex];

        if (deleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        element.textContent = phrase.substring(
            0,
            charIndex
        );

        let delay = deleting ? 35 : 75;

        if (!deleting && charIndex === phrase.length) {
            deleting = true;
            delay = 1900;
        }

        else if (deleting && charIndex === 0) {
            deleting = false;

            phraseIndex =
                (phraseIndex + 1) % phrases.length;

            delay = 400;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 700);
}


// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

function initScrollAnimations() {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const heroElements = document.querySelectorAll(
        ".hero .animate-in"
    );

    // Hero animation

    heroElements.forEach((element, index) => {

        if (reducedMotion) {
            element.classList.add("visible");
            return;
        }

        setTimeout(() => {
            element.classList.add("visible");
        }, 250 + index * 110);
    });


    if (!("IntersectionObserver" in window)) {

        document.querySelectorAll(".glass-card, .section-header")
            .forEach(element => {
                element.classList.add("visible");
            });

        return;
    }


    // Reveal cards and section headers

    const revealElements = document.querySelectorAll(
        ".glass-card, .section-header"
    );

    if (reducedMotion) {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });

        return;
    }


    const observer = new IntersectionObserver(
        (entries, observerInstance) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observerInstance.unobserve(entry.target);
                }
            });

        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -35px 0px"
        }
    );


    revealElements.forEach((element, index) => {

        element.classList.add("animate-in");

        if (element.classList.contains("project-card")) {
            element.style.transitionDelay =
                `${(index % 2) * 0.08}s`;
        }

        observer.observe(element);
    });


    // Header animation

    document.querySelectorAll(".section-header").forEach(
        header => {
            observer.observe(header);
        }
    );
}


// ============================================
// NUMBER COUNT-UP
// ============================================

function initCountUp() {

    const counters = document.querySelectorAll(
        ".stat-number[data-target]"
    );

    if (!counters.length) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function setFinalValues() {
        counters.forEach(counter => {

            const target = Number(
                counter.getAttribute("data-target")
            );

            counter.textContent = target;
        });
    }

    if (reducedMotion || !("IntersectionObserver" in window)) {
        setFinalValues();
        return;
    }


    let started = false;

    const statsSection = document.querySelector(
        ".hero-stats"
    );

    if (!statsSection) return;


    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting && !started) {

                    started = true;

                    counters.forEach(counter => {

                        const target = Number(
                            counter.getAttribute("data-target")
                        );

                        const duration = 1500;
                        const startTime = performance.now();

                        function update(currentTime) {

                            const elapsed =
                                currentTime - startTime;

                            const progress = Math.min(
                                elapsed / duration,
                                1
                            );

                            const eased =
                                1 - Math.pow(1 - progress, 3);

                            counter.textContent = Math.round(
                                target * eased
                            );

                            if (progress < 1) {
                                requestAnimationFrame(update);
                            }
                        }

                        requestAnimationFrame(update);
                    });

                    observer.disconnect();
                }
            });

        },
        {
            threshold: 0.5
        }
    );

    observer.observe(statsSection);
}


// ============================================
// SMOOTH ANCHOR SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", event => {

        const href = anchor.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",

            block: "start"
        });
    });
});


// ============================================
// END OF PORTFOLIO SCRIPT
// ============================================
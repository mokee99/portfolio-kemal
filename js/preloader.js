document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.querySelector(".preloader");
    const logo = document.querySelector(".preloader-logo");
    const counter = document.querySelector(".preloader-counter");
    const transition = document.querySelector(".preloader-transition");

    const root = document.documentElement;

    const shouldShowPreloader = root.classList.contains("show-preloader");

    const hasAnchor = window.location.hash.length > 1;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    // Remember that the homepage has been visited.
    try {
        sessionStorage.setItem("preloaderSeen", "true");
    } catch (error) {}


    // Remove Preloader when GSAP is unavailable.
    if (typeof gsap === "undefined") {
        console.error("GSAP is not loaded.");
        preloader?.remove();
        root.classList.remove("show-preloader");
        return;
    }


    // Hero elements.
    const heroWords = document.querySelectorAll(".hero-word");
    const heroParagraph = document.querySelector(".hero-paragraph");
    const heroScroll = document.querySelector(".scroll-down-wrapper");


    // Skip animations for reduced motion or direct anchor navigation.
    if (prefersReducedMotion || hasAnchor) {
        preloader?.remove();
        root.classList.remove("show-preloader");
        return;
    }


    // Prepare Hero elements.

    // Subtle blur reveal for heading.
    gsap.set(heroWords, {
        y: 12,
        autoAlpha: 0.25,
        filter: "blur(4px)"
    });

    // Paragraph initial state.
    gsap.set(heroParagraph, {
        y: 20,
        autoAlpha: 0
    });

    // Scroll indicator initial state.
    gsap.set(heroScroll, {
        y: 15,
        autoAlpha: 0
    });


    // Start Hero animation independently of the Preloader.
    function playHeroAnimation() {
        if (typeof initHeroAnimation === "function") {
            const heroTimeline = initHeroAnimation();

            if (heroTimeline) {
                heroTimeline.play();
                return;
            }
        }

        // Fallback: make Hero visible.
        gsap.set(
            [heroWords, heroParagraph, heroScroll],
            { clearProps: "all" }
        );
    }


    // Skip Preloader on subsequent visits.
    if (
        !shouldShowPreloader ||
        !preloader ||
        !logo ||
        !counter ||
        !transition
    ) {
        preloader?.remove();
        root.classList.remove("show-preloader");

        playHeroAnimation();

        return;
    }


    // Lock scrolling while the Preloader is active.
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";


    const progress = { value: 0 };


    // Calculate the scale needed to fill the viewport.
    function getZoomScale() {
        const rect = logo.getBoundingClientRect();

        const diagonal = Math.hypot(
            window.innerWidth,
            window.innerHeight
        );

        return (diagonal / Math.min(rect.width, rect.height)) * 3;
    }


    const timeline = gsap.timeline({
        onComplete: () => {
            preloader.remove();

            root.classList.remove("show-preloader");
            root.style.overflow = previousOverflow;

            // Start Hero animation after the Preloader finishes.
            playHeroAnimation();
        }
    });


    // Rotate the logo twice.
    timeline.to(logo, {
        rotation: 720,
        duration: 4.5,
        ease: "none"
    }, 0);


    // Count from 000 to 100.
    timeline.to(progress, {
        value: 100,
        duration: 4.5,
        ease: "power1.inOut",
        onUpdate: () => {
            counter.textContent = String(
                Math.round(progress.value)
            ).padStart(3, "0");
        }
    }, 0);


    // Brief pause at 100.
    timeline.to({}, {
        duration: 0.25
    });


    // Hide the counter before zooming.
    timeline.to(counter, {
        autoAlpha: 0,
        duration: 0.2
    });


    // Zoom into the black logo.
    timeline.to(logo, {
        scale: getZoomScale,
        duration: 0.9,
        ease: "power3.inOut"
    });


    // Cover the remaining orange gaps with black.
    timeline.set(transition, {
        zIndex: 4
    });

    timeline.to(transition, {
        opacity: 1,
        duration: 0.2,
        ease: "none"
    }, "<");


    // Reveal the Hero.
    timeline.to(preloader, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.out"
    });
});


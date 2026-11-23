
function initHeroAnimation() {
    const hero = document.querySelector(".hero");

    if (!hero || typeof gsap === "undefined") return;

    const words = hero.querySelectorAll(".hero-word");
    const paragraph = hero.querySelector(".hero-paragraph");
    const scrollDown = hero.querySelector(".scroll-down-wrapper");

    const timeline = gsap.timeline({
        paused: true,
        defaults: {
            ease: "power2.out"
        }
    });

    // Subtle heading reveal
    timeline.to(words, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: 0.045
    });

    // Paragraph reveal
    timeline.to(paragraph, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8
    }, "-=0.65");

    // Scroll indicator reveal
    timeline.to(scrollDown, {
        y: 0,
        autoAlpha: 1,
        duration: 0.7
    }, "-=0.5");

    return timeline;
}




function initIntroAnimation() {
    const intro = document.querySelector(".intro");

    if (
        !intro ||
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) return;

    gsap.registerPlugin(ScrollTrigger);

    const words = intro.querySelectorAll(".intro-word");
    const headingWrapper = intro.querySelector(".intro-heading-wrapper");
    const paragraph = intro.querySelector(".intro-paragraph");
    const brain = intro.querySelector(".intro-brain");
    const labels = intro.querySelectorAll(".intro-label");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const mm = gsap.matchMedia();

    // DESKTOP
    mm.add("(min-width: 1041px)", () => {
        let completed = false;
        let pinTrigger = null;
        let parallax = null;
        let labelsStarted = false;

        // Initial states
        gsap.set(words, {
            y: 12,
            autoAlpha: 0.25,
            filter: "blur(4px)"
        });

        gsap.set(paragraph, {
            y: 15,
            autoAlpha: 0,
            filter: "blur(4px)"
        });

        gsap.set(brain, {
            scale: 0.94,
            autoAlpha: 0,
            filter: "blur(4px)"
        });

        gsap.set(labels, {
            y: 12,
            autoAlpha: 0,
            filter: "blur(3px)"
        });

        // 1. Heading: reveal early
        const headingReveal = gsap.to(words, {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.015,
            ease: "power2.out",
            scrollTrigger: {
                trigger: intro,
                start: "top 80%",
                once: true
            }
        });

        // 2. Paragraph and brain
        const contentTimeline = gsap.timeline({
            paused: true
        });

        contentTimeline.to(paragraph, {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power2.out"
        }, 0);

        // Brain begins 1 second after paragraph starts
        contentTimeline.to(brain, {
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out"
        }, 1);

        // 80% of the natural section height
        const paragraphTrigger = ScrollTrigger.create({
            trigger: intro,
            start: () => {
                const sectionHeight = intro.offsetHeight;
                const paragraphPoint = sectionHeight * 0.8;

                return `top+=${paragraphPoint} bottom`;
            },
            once: true,
            onEnter: () => {
                contentTimeline.play();
            }
        });

        // 3. Labels: controlled by additional scrolling
        const labelsTimeline = gsap.timeline({
            paused: true
        });

        labelsTimeline.to(labels, {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.3,
            ease: "power2.out"
        });

        // 4. Pin only near the bottom of Intro
        pinTrigger = ScrollTrigger.create({
            trigger: intro,
            start: "bottom bottom",
            end: "+=900",
            pin: true,
            invalidateOnRefresh: true,

            onUpdate: (self) => {
                if (completed) return;

                // Wait until paragraph and brain finish
                if (!contentTimeline.isActive() &&
                    contentTimeline.progress() === 1) {
                    labelsStarted = true;
                }

                if (labelsStarted) {
                    gsap.to(labelsTimeline, {
                        progress: self.progress,
                        duration: 1,
                        ease: "power2.out",
                        overwrite: true
                    });
                }

                if (self.progress >= 1) {
                    completed = true;
                    labelsTimeline.progress(1);

                    const oldScroll = window.scrollY;
                    const pinDistance = self.end - self.start;

                    // Remove the pin
                    self.kill(true, false);

                    // Refresh positions
                    ScrollTrigger.refresh();

                    // Preserve scroll position
                    window.scrollTo({
                        top: Math.max(0, oldScroll - pinDistance),
                        behavior: "instant"
                    });

                    // Subtle reversible heading parallax
                    parallax = gsap.to(headingWrapper, {
                        y: -30,
                        ease: "none",
                        scrollTrigger: {
                            trigger: intro,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1
                        }
                    });
                }
            }
        });

        return () => {
            if (pinTrigger) pinTrigger.kill();
            paragraphTrigger.kill();
            headingReveal.kill();
            contentTimeline.kill();
            labelsTimeline.kill();
            if (parallax) parallax.kill();
        };
    });

    // TABLET & MOBILE
    mm.add("(max-width: 1040px)", () => {
        // Heading and paragraph
        const textTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: intro,
                start: "top 80%",
                once: true
            }
        });

        textTimeline.from(words, {
            y: 12,
            autoAlpha: 0.25,
            filter: "blur(4px)",
            duration: 1.1,
            stagger: 0.045,
            ease: "power2.out"
        });

        textTimeline.from(paragraph, {
            y: 15,
            autoAlpha: 0,
            filter: "blur(4px)",
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6");

        // Brain
        gsap.from(brain, {
            scale: 0.94,
            autoAlpha: 0,
            filter: "blur(4px)",
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: brain,
                start: "top 85%",
                once: true
            }
        });

        // Labels
        gsap.from(labels, {
            y: 12,
            autoAlpha: 0,
            filter: "blur(3px)",
            duration: 0.7,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: brain,
                start: "top 70%",
                once: true
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", initIntroAnimation);



function initSolutionsHeadingAnimation() {
    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) return;

    gsap.registerPlugin(ScrollTrigger);

    const heading = document.querySelector(".solutions-heading");
    const headingWrapper = document.querySelector(
        ".solutions-heading-wrapper"
    );

    if (!heading || !headingWrapper) return;

    const lines = heading.querySelectorAll("span");

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {

        // Initial heading state
        gsap.set(lines, {
            y: 12,
            autoAlpha: 0.25,
            filter: "blur(4px)"
        });

        // Subtle heading reveal
        gsap.to(lines, {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.045,
            ease: "power2.out",
            scrollTrigger: {
                trigger: heading,
                start: "top 80%",
                once: true
            }
        });

        // Subtle reversible heading parallax
        gsap.to(headingWrapper, {
            y: -30,
            ease: "none",
            scrollTrigger: {
                trigger: heading,
                start: "top 80%",
                end: "bottom top",
                scrub: 1
            }
        });
    });
}

document.addEventListener(
    "DOMContentLoaded",
    initSolutionsHeadingAnimation
);




function initStackCards() {
    if (typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".solutions");
    const cards = gsap.utils.toArray(".solution-card");

    if (!section || cards.length < 2) return;

    const mm = gsap.matchMedia();

    // DESKTOP & TABLET
    mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
            cards.forEach((card, index) => {
                gsap.set(card, {
                    zIndex: index + 1
                });

                const isLastCard = index === cards.length - 1;

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: isLastCard
                            ? card
                            : cards[index + 1],

                        start: isLastCard
                            ? "top 12%"
                            : "top 75%",

                        end: isLastCard
                            ? "+=300"
                            : "top 12%",

                        scrub: 1.5,
                        invalidateOnRefresh: true
                    }
                });

                // Move upward and reduce width
                timeline.to(card, {
                    y: () => -card.offsetHeight * 0.5,
                    scaleX: 0.88,
                    ease: "none",
                    duration: 1
                }, 0);

                // Blur begins at 35% of the animation
                timeline.to(card, {
                    filter: "blur(2px)",
                    ease: "none",
                    duration: 0.65
                }, 0.35);
            });
        }
    );

    // MOBILE
    mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
            cards.forEach((card) => {
                gsap.from(card, {
                    y: 35,
                    autoAlpha: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            });
        }
    );
}

document.addEventListener("DOMContentLoaded", initStackCards);



function initCaseStudiesAnimation() {
    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".case-studies");
    if (!section) return;

    const cards = section.querySelectorAll(".case-study-card");
    if (!cards.length) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card) => {
            gsap.from(card, {
                y: 40,
                autoAlpha: 0,
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    once: true
                }
            });
        });
    });
}

document.addEventListener(
    "DOMContentLoaded",
    initCaseStudiesAnimation
);



function initCaseStudiesAnimation() {
    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".case-study");
    if (!section) return;

    const panels = gsap.utils.toArray(
        ".case-study-panel",
        section
    );

    if (panels.length < 2) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {

       

        panels.forEach((panel, index) => {
            gsap.set(panel, {
                zIndex: index + 1
            });

            if (index === panels.length - 1) return;

            ScrollTrigger.create({
                trigger: panel,
                start: "bottom bottom",
                pin: true,
                pinSpacing: false,
                invalidateOnRefresh: true
            });
        });



        // Subtle content reveal
        panels.forEach((panel) => {
            const content = panel.querySelector(
                ".case-study-main"
            );

            if (!content) return;

            gsap.from(content, {
                y: 30,
                autoAlpha: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: panel,
                    start: "top 85%",
                    once: true
                }
            });
        });

        ScrollTrigger.refresh();
    });
}

document.addEventListener(
    "DOMContentLoaded",
    initCaseStudiesAnimation
);



function initAboutAnimation() {
    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) return;

    gsap.registerPlugin(ScrollTrigger);

    const about = document.querySelector(".about");

    if (!about) return;

    const heading = about.querySelector(".about-heading");
    const lines = heading.querySelectorAll("span");
    const paragraph = about.querySelector(".about-paragraph");

    const imageWrapper = about.querySelector(".about-absolute-wrapper");
    const image = about.querySelector(".about-image");
    const blackBox = about.querySelector(".black-box");
    const orangeBox = about.querySelector(".orange-box");

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {

        // Heading and paragraph reveal
        const textTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: heading,
                start: "top 80%",
                once: true
            }
        });

        // Heading blur reveal
        textTimeline.from(lines, {
            y: 12,
            autoAlpha: 0.25,
            filter: "blur(4px)",
            duration: 1.2,
            stagger: 0.045,
            ease: "power2.out"
        });

        // Paragraph reveal
        textTimeline.from(paragraph, {
            y: 15,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.6");

        // Image composition reveal
        const imageTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: imageWrapper,
                start: "top 85%",
                once: true
            }
        });

        // Orange background
        imageTimeline.from(orangeBox, {
            x: 15,
            y: -15,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power2.out"
        });

        // Black background
        imageTimeline.from(blackBox, {
            y: 15,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power2.out"
        }, "-=0.65");

        // Portrait reveal
        imageTimeline.from(image, {
            y: 12,
            scale: 0.96,
            autoAlpha: 0,
            filter: "blur(4px)",
            duration: 1.2,
            ease: "power2.out"
        }, "-=0.6");

        // Reversible heading parallax
        gsap.to(heading, {
            y: -30,
            ease: "none",
            scrollTrigger: {
                trigger: paragraph.parentElement,
                start: "top 80%",
                end: "bottom top",
                scrub: 1
            }
        });

        // Reversible image parallax
        gsap.to(imageWrapper, {
            y: -20,
            ease: "none",
            scrollTrigger: {
                trigger: about,
                start: "top 80%",
                end: "bottom top",
                scrub: 1
            }
        });
    });
}

document.addEventListener(
    "DOMContentLoaded",
    initAboutAnimation
);



function initCtaAnimation() {
    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) return;

    gsap.registerPlugin(ScrollTrigger);

    const cta = document.querySelector(".cta");

    if (!cta) return;

    const heading = cta.querySelector(".cta-heading");
    const headingWrapper = cta.querySelector(".top-wrapper");
    const lines = heading.querySelectorAll("span");
    const bottomWrapper = cta.querySelector(".bottom-wrapper");

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {

        // Heading blur reveal
        gsap.from(lines, {
            y: 12,
            autoAlpha: 0.25,
            filter: "blur(4px)",
            duration: 1.2,
            stagger: 0.045,
            ease: "power2.out",
            scrollTrigger: {
                trigger: heading,
                start: "top 80%",
                once: true
            }
        });

        // Subtle reversible heading parallax
        gsap.to(heading, {
            y: -30,
            ease: "none",
            scrollTrigger: {
                trigger: headingWrapper,
                start: "top 80%",
                end: "bottom top",
                scrub: 1
            }
        });

        // Bottom content reveal
        gsap.from(bottomWrapper, {
            y: 15,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: bottomWrapper,
                start: "top 95%",
                once: true
            }
        });
    });
}

document.addEventListener(
    "DOMContentLoaded",
    initCtaAnimation
);





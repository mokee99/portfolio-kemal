
function initCaseStudyAnimation() {
    if (
        typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined"
    ) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector(".cs-section");

    if (!section) return;

    const heading = section.querySelector(".cs-heading-one");
    const linkWrapper = section.querySelector(".cs-link-wrapper");

    const content = section.querySelectorAll(
        ".cs-heading-two, .cs-paragraph"
    );

    const images = section.querySelectorAll(
        ".cs-image-big, .cs-image-small"
    );

    const nextProject = section.querySelector(".cs-next-project");

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {

        // Main heading and project link
        const headingTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: heading,
                start: "top 90%",
                once: true
            }
        });

        headingTimeline.from(heading, {
            y: 12,
            autoAlpha: 0.25,
            filter: "blur(4px)",
            duration: 1.2,
            ease: "power2.out"
        });

        headingTimeline.from(linkWrapper, {
            y: 12,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.7");

        // Project overview and key features
        content.forEach((element) => {
            gsap.from(element, {
                y: 12,
                autoAlpha: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 95%",
                    once: true
                }
            });
        });

        // Gallery images
        images.forEach((image) => {
            gsap.from(image, {
                y: 12,
                autoAlpha: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: image,
                    start: "top 95%",
                    once: true
                }
            });
        });

        // Next project reveal
        gsap.from(nextProject, {
            y: 12,
            autoAlpha: 0.25,
            filter: "blur(4px)",
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: nextProject,
                start: "top 95%",
                once: true
            }
        });
    });
}

document.addEventListener(
    "DOMContentLoaded",
    initCaseStudyAnimation
);

// Recalculate positions after images and fonts load
window.addEventListener("load", () => {
    if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    // NAVBAR
    const navbarContainer = document.querySelector("#navbar-container");

    if (navbarContainer) {
        try {
            const response = await fetch("./components/navbar.html");

            if (!response.ok) {
                throw new Error("Navbar component could not be loaded.");
            }

            navbarContainer.innerHTML = await response.text();

            initNavbar();
        } catch (error) {
            console.error("Navbar error:", error);
        }
    }

    // FOOTER
    const footerContainer = document.querySelector("#footer-container");

    if (footerContainer) {
        try {
            const response = await fetch("./components/footer.html");

            if (!response.ok) {
                throw new Error("Footer component could not be loaded.");
            }

            footerContainer.innerHTML = await response.text();
        } catch (error) {
            console.error("Footer error:", error);
        }
    }
});

function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const toggle = document.querySelector(".navbar-toggle");
    const links = document.querySelectorAll(".navbar-links a");
    const hero = document.querySelector(".hero");

    if (!navbar || !toggle) return;

    const tabletBreakpoint = window.matchMedia("(max-width: 1100px)");

    function closeMenu() {
        navbar.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
    }

    function updateNavbar() {
        const isTablet = tabletBreakpoint.matches;

        const isPastHero = hero
            ? hero.getBoundingClientRect().bottom <= 0
            : true;

        const shouldBeCompact = isTablet || isPastHero;

        navbar.classList.toggle("is-compact", shouldBeCompact);

        if (!shouldBeCompact) {
            closeMenu();
        }
    }

    toggle.addEventListener("click", () => {
        const isOpen = navbar.classList.toggle("is-open");

        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );
    });

    links.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("scroll", updateNavbar, { passive: true });
    window.addEventListener("resize", updateNavbar);

    updateNavbar();
}



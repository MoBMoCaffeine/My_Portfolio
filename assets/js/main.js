/*=============== GSAP & SCROLLTRIGGER SETUP ===============*/
gsap.registerPlugin(ScrollTrigger);

// Force scroll to top on refresh and disable browser scroll restoration
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// Add active preloader class to body to prevent scrollbar interaction
document.body.classList.add("preloader-active");

let lenis = null;

// Helper to split text into spans
function splitTextIntoSpans(selector) {
    const element = document.querySelector(selector);
    if (!element) return [];
    const text = element.textContent.trim();
    element.innerHTML = "";
    return text.split("").map(char => {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.transform = "translateY(100%)";
        span.textContent = char === " " ? "\u00A0" : char;
        element.appendChild(span);
        return span;
    });
}

// -------------------------------------------------------------
// INTRO PRELOADER SCROLL-DRIVEN TIMELINE
// -------------------------------------------------------------
const introLoader = document.getElementById("intro-loader");
const words = gsap.utils.toArray(".intro-loader__word");

// Fade in scroll prompt and progress indicator initially
gsap.to(".intro-loader__scroll", { opacity: 1, duration: 1, delay: 0.5 });
gsap.to(".intro-loader__progress-num", { opacity: 0.8, duration: 0.5, delay: 0.5 });

// Animate preloader marquee rows infinitely in alternating directions
const marqueeTracks = gsap.utils.toArray(".intro-loader__marquee-track");
marqueeTracks.forEach((track, index) => {
    const toLeft = index % 2 === 0;
    if (toLeft) {
        gsap.to(track, {
            xPercent: -50,
            repeat: -1,
            duration: 22 + index * 3,
            ease: "none"
        });
    } else {
        gsap.fromTo(track,
            { xPercent: -50 },
            {
                xPercent: 0,
                repeat: -1,
                duration: 22 + index * 3,
                ease: "none"
            }
        );
    }
});

// Standard timeline for preloader words sequence (scrubbed manually)
const introTl = gsap.timeline({ paused: true });

if (words.length >= 4) {
    introTl
        // Word 1: BUILD
        .to(words[0], { opacity: 1, scale: 1.05, duration: 1, ease: "power1.out" })
        .to(words[0], { opacity: 0, scale: 1.2, duration: 1, ease: "power1.in" }, "+=0.3")

        // Word 2: TRY
        .to(words[1], { opacity: 1, scale: 1.05, duration: 1, ease: "power1.out" })
        .to(words[1], { opacity: 0, scale: 1.2, duration: 1, ease: "power1.in" }, "+=0.3")

        // Word 3: LAUNCH
        .to(words[2], { opacity: 1, scale: 1.05, duration: 1, ease: "power1.out" })
        .to(words[2], { opacity: 0, scale: 1.2, duration: 1, ease: "power1.in" }, "+=0.3")

        // Word 4: MOHAMED BAKR
        .to(words[3], { opacity: 1, scale: 1.05, duration: 1, ease: "power1.out" })

        // Hide scroll prompt
        .to(".intro-loader__scroll", { opacity: 0, duration: 0.5 }, 0.2);
}

let virtualProgress = 0;
let introComplete = false;

// Run profession loop after Hero entrance completes
const runProfessionLoop = () => {
    const chars1 = splitTextIntoSpans(".home__profession-1");
    const chars2 = splitTextIntoSpans(".home__profession-2");

    if (chars1.length && chars2.length) {
        gsap.set(".home__profession-2", { opacity: 0 });
        gsap.set(".home__profession-1", { opacity: 1 });

        const profTl = gsap.timeline({ repeat: -1 });

        profTl
            .to(chars1, { translateY: "0%", stagger: 0.05, duration: 0.5, ease: "power2.out" })
            .to(chars1, { translateY: "-100%", stagger: 0.03, duration: 0.4, ease: "power2.in", delay: 2 })
            .set(".home__profession-2", { opacity: 1 })
            .set(".home__profession-1", { opacity: 0 })
            .to(chars2, { translateY: "0%", stagger: 0.05, duration: 0.5, ease: "power2.out" })
            .to(chars2, { translateY: "-100%", stagger: 0.03, duration: 0.4, ease: "power2.in", delay: 2 })
            .set(".home__profession-1", { opacity: 1 })
            .set(".home__profession-2", { opacity: 0 });
    }
};

// Function to trigger once preloader sequence completes
const finishIntro = () => {
    introComplete = true;

    // Remove virtual scroll event listeners
    window.removeEventListener("wheel", onVirtualScroll);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);

    // Remove the scroll lock class
    document.body.classList.remove("preloader-active");

    // Exit transition of the preloader
    const exitTl = gsap.timeline({
        onComplete: () => {
            // Initialize Lenis Smooth Scroll
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                smoothTouch: false,
            });

            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);

            // Hide loader completely and initialize reveals
            gsap.set("#intro-loader", { display: "none" });
            runProfessionLoop();
            initScrollReveals();
        }
    });

    exitTl
        .to(".intro-loader__bg", { yPercent: -100, duration: 1.2, ease: "power3.inOut" })
        .to(words[3], { yPercent: -100, opacity: 0, duration: 1, ease: "power3.in" }, "<")
        .to(".intro-loader__marquee-container", { yPercent: -100, opacity: 0, duration: 1.2, ease: "power3.inOut" }, "<")
        .to("#intro-loader", { yPercent: -100, duration: 1.2, ease: "power3.inOut" }, "<")

        // Hero Entrance Animations
        .from(".nav__logo, .nav__link", { y: -30, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power2.out" }, "-=0.4")
        .from(".home__greeting", { x: -50, opacity: 0, duration: 0.8, ease: "power2.out" }, "<")
        .from(".home__name", { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5")
        .from(".home__perfil", { scale: 0.85, opacity: 0, duration: 1.2, ease: "power2.out" }, "-=0.8")
        .from(".home__profession-1, .home__profession-2", { opacity: 0, y: 20, stagger: 0.15, duration: 0.8 }, "-=0.6")
        .from(".home__social-link", { scale: 0, opacity: 0, stagger: 0.08, duration: 0.6, ease: "back.out(1.7)" }, "-=0.6")
        .from(".home__cv", { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");
};

// Handle virtual scroll
const onVirtualScroll = (e) => {
    if (introComplete) return;

    const direction = e.deltaY > 0 ? 1 : -1;

    if (direction === 1) {
        virtualProgress = Math.min(virtualProgress + 0.12, 1);
    } else {
        virtualProgress = Math.max(virtualProgress - 0.12, 0);
    }

    gsap.to(introTl, {
        progress: virtualProgress,
        duration: 0.4,
        ease: "power1.out",
        onUpdate: () => {
            const currentPercent = Math.round(introTl.progress() * 100);
            gsap.to(".intro-loader__progress-bar", { width: `${currentPercent}%`, duration: 0.1 });
            document.querySelector(".intro-loader__progress-num").textContent = `${currentPercent}%`;
        },
        onComplete: () => {
            if (virtualProgress >= 1 && !introComplete) {
                finishIntro();
            }
        }
    });
};

let touchStartY = 0;
const onTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
};

const onTouchMove = (e) => {
    if (introComplete) return;
    const touchEndY = e.touches[0].clientY;
    const diff = touchStartY - touchEndY; // positive = swipe up / scroll down

    if (Math.abs(diff) > 8) {
        const direction = diff > 0 ? 1 : -1;
        virtualProgress = Math.min(Math.max(virtualProgress + direction * 0.08, 0), 1);

        gsap.to(introTl, {
            progress: virtualProgress,
            duration: 0.4,
            ease: "power1.out",
            onUpdate: () => {
                const currentPercent = Math.round(introTl.progress() * 100);
                gsap.to(".intro-loader__progress-bar", { width: `${currentPercent}%`, duration: 0.1 });
                document.querySelector(".intro-loader__progress-num").textContent = `${currentPercent}%`;
            },
            onComplete: () => {
                if (virtualProgress >= 1 && !introComplete) {
                    finishIntro();
                }
            }
        });
        touchStartY = touchEndY;
    }
};

window.addEventListener("wheel", onVirtualScroll);
window.addEventListener("touchstart", onTouchStart, { passive: true });
window.addEventListener("touchmove", onTouchMove, { passive: true });

/*=============== PROJECTS CARDS ===============*/
const projectsContent = document.getElementById("projects-content");

fetch("assets/data/projects.json")
    .then((response) => response.json())
    .then((data) => {
        renderProjects(data);
        initSwiper();
        if (ScrollTrigger) ScrollTrigger.refresh(); // Refresh ScrollTrigger after dynamic content load
    })
    .catch((error) => console.error("Error loading projects:", error));

function renderProjects(projects) {
    projectsContent.innerHTML = projects
        .map(
            (project) => `
        <article class="projects__card swiper-slide">
        <div class="blob"></div>
        
        <div class="projects__number">
        <h1>${project.id}</h1>
        <h3>${project.category}</h3>
        </div>
        
        <div class="projects__data">
        <h1 class="projects__title">${project.title}</h1>
        <p class="projects__subtitle">${project.subtitle}</p>
        <p class="projects__description">${project.description}</p>
        </div>
        
        <div class="projects__image">
        <img src="${project.image}" alt="${project.title}" class="projects__img">
        <a href="${project.link}" target="_blank" class="projects__button">
        <i class="ri-arrow-right-up-long-line"></i>
        </a>
        </div>
        </article>
        `,
        )
        .join("");
}

function initSwiper() {
    let swiperProjects = new Swiper(".projects__swiper", {
        loop: true,
        spaceBetween: 24,
        slidesPerView: "auto",
        grabCursor: true,
        speed: 600,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });
}

/*=============== WORK TABS ===============*/
const experienceContainer = document.getElementById("experience"),
    educationContainer = document.getElementById("education");

fetch("assets/data/work.json")
    .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then((data) => {
        renderWorkItems(data.experience, experienceContainer);
        renderWorkItems(data.education, educationContainer);
        initWorkTabs();
        if (ScrollTrigger) ScrollTrigger.refresh(); // Refresh ScrollTrigger after dynamic content load
    })
    .catch((error) => console.error("Error loading work data:", error));

function renderWorkItems(items, container) {
    if (!container) return;
    container.innerHTML = items
        .map(
            (item) => `
        <div class="work__card">
            <div class="work__data">
                <div>
                    <h1 class="work__title">${item.title.replace(" ", "<br>")}</h1>
                    <h3 class="work__subtitle">${item.subtitle}</h3>
                </div>
                <h2 class="work__year">${item.year}</h2>
            </div>
            <p class="work__description">${item.description}</p>
        </div>
    `,
        )
        .join("");
}

function initWorkTabs() {
    const tabs = document.querySelectorAll("[data-target]"),
        tabContents = document.querySelectorAll("[data-content]"),
        blob = document.querySelector(".work__blob");

    if (!blob) return;

    const updateBlob = (tab) => {
        blob.style.left = `${tab.offsetLeft}px`;
        blob.style.width = `${tab.offsetWidth}px`;
    };

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const target = document.querySelector(tab.dataset.target);

            tabContents.forEach((tc) => tc.classList.remove("work-active"));
            target.classList.add("work-active");

            tabs.forEach((t) => t.classList.remove("work-active"));
            tab.classList.add("work-active");

            updateBlob(tab);
            if (ScrollTrigger) ScrollTrigger.refresh(); // Refresh ScrollTrigger in case tab height changes
        });
    });

    const initialTab = document.querySelector(".work__button.work-active");
    if (initialTab) {
        setTimeout(() => updateBlob(initialTab), 100);
    }
}

/*=============== SERVICES DYNAMIC RENDER ===============*/
const servicesContent = document.getElementById("services-content");

fetch("assets/data/services.json")
    .then((response) => response.json())
    .then((data) => {
        renderServices(data);
        initServicesAccordion();
        if (ScrollTrigger) ScrollTrigger.refresh(); // Refresh ScrollTrigger after dynamic content load
    })
    .catch((error) => console.error("Error loading services:", error));

function renderServices(services) {
    servicesContent.innerHTML = services
        .map(
            (service, index) => `
    <article class="services__card ${index === 0 ? "services-open" : "services-close"}">
       <div class="blob"></div>

       <div class="services__data">
          <i class="${service.icon} services__icon"></i> 
          <h2 class="services__title">${service.title}</h2>
          <p class="services__description">${service.description}</p>
       </div>

       <div class="services__info" style="height: ${index === 0 ? "auto" : "0"}">
          <h3 class="services__subtitle">${service.subtitle}</h3>
          <ul class="services__skills">
             ${service.skills.map((skill) => `<li class="services__skill">${skill}</li>`).join("")}
          </ul>
       </div>

       <button class="services__button">
          <i class="ri-arrow-down-s-line"></i>
       </button>
    </article>
  `,
        )
        .join("");
}

function initServicesAccordion() {
    const servicesCards = document.querySelectorAll(".services__card");

    servicesCards.forEach((card) => {
        const button = card.querySelector(".services__button");
        const info = card.querySelector(".services__info");

        if (card.classList.contains("services-open")) {
            info.style.height = info.scrollHeight + "px";
        }

        button.addEventListener("click", () => {
            const isOpen = card.classList.contains("services-open");

            servicesCards.forEach((otherCard) => {
                otherCard.classList.replace("services-open", "services-close");
                otherCard.querySelector(".services__info").style.height = "0";
            });

            if (!isOpen) {
                card.classList.replace("services-close", "services-open");
                info.style.height = info.scrollHeight + "px";
            }
            if (ScrollTrigger) {
                setTimeout(() => ScrollTrigger.refresh(), 300); // Refresh ScrollTrigger after transition finishes
            }
        });
    });
}

/*=============== COPY CONTACT EMAIL ===============*/
const copyBtn = document.getElementById("contact-btn");
if (copyBtn) {
    copyBtn.addEventListener("click", () => {
        const copyEmail = document.getElementById("contact-email").textContent;
        navigator.clipboard.writeText(copyEmail).then(() => {
            // Temporarily change copy icon class or style
            const copyIcon = copyBtn.querySelector(".contact__copy-icon");
            if (copyIcon) {
                copyIcon.className = "ri-check-line contact__copy-icon";
                setTimeout(() => {
                    copyIcon.className = "ri-file-copy-line contact__copy-icon";
                }, 2000);
            }
        });
    });
}

/*=============== CONTACT FORM SUBMIT (FORMSUBMIT.CO AJAX) ===============*/
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("contact-name-input").value;
        const email = document.getElementById("contact-email-input").value;
        const message = document.getElementById("contact-message-input").value;
        const submitBtn = contactForm.querySelector(".contact__form-button");
        
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `Sending... <i class="ri-loader-4-line animate-spin"></i>`;
        submitBtn.disabled = true;

        fetch("https://formsubmit.co/ajax/bakrm1921@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message,
                _captcha: "false"
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === "true" || data.success === true) {
                submitBtn.innerHTML = `Sent Successfully! <i class="ri-check-line"></i>`;
                submitBtn.style.backgroundColor = "hsl(140, 60%, 40%)";
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.style.backgroundColor = "";
                    submitBtn.disabled = false;
                }, 4000);
            } else {
                throw new Error("Submission failed");
            }
        })
        .catch(error => {
            console.error("FormSubmit Error:", error);
            submitBtn.innerHTML = `Failed to Send <i class="ri-error-warning-line"></i>`;
            submitBtn.style.backgroundColor = "hsl(0, 60%, 40%)";
            
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.style.backgroundColor = "";
                submitBtn.disabled = false;
            }, 4000);
        });
    });
}

/*=============== CURRENT YEAR OF THE FOOTER ===============*/
const textYear = document.getElementById("footer-year");
if (textYear) {
    textYear.textContent = new Date().getFullYear();
}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
        const id = section.id,
            top = section.offsetTop - 150,
            height = section.offsetHeight,
            link = document.querySelector(".nav__menu a[href*=" + id + "]");
        if (!link) return;

        link.classList.toggle(
            "active-link",
            scrollY > top && scrollY <= top + height,
        );
    });
};
window.addEventListener("scroll", scrollActive);

/*=============== CUSTOM CURSOR ===============*/
const cursor = document.querySelector(".cursor");
if (cursor) {
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });
    
    const xt1 = gsap.quickTo(".cursor-trail-1", "x", { duration: 0.35, ease: "power2" });
    const yt1 = gsap.quickTo(".cursor-trail-1", "y", { duration: 0.35, ease: "power2" });
    const xt2 = gsap.quickTo(".cursor-trail-2", "x", { duration: 0.5, ease: "power2" });
    const yt2 = gsap.quickTo(".cursor-trail-2", "y", { duration: 0.5, ease: "power2" });

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    window.addEventListener("mousemove", (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
        xt1(e.clientX);
        yt1(e.clientY);
        xt2(e.clientX);
        yt2(e.clientY);
    });

    // Dynamic Event Delegation for Cursor hover animations
    document.addEventListener("mouseover", (e) => {
        const target = e.target.closest("a, button, .swiper-pagination-bullet, .work__button, .services__button, .contact__email-wrapper");
        if (target) {
            gsap.to(cursor, {
                scale: 2.2,
                backgroundColor: "transparent",
                border: "1.5px solid var(--first-color)",
                mixBlendMode: "normal",
                duration: 0.3
            });
            gsap.to(".cursor-trail", { opacity: 0, duration: 0.2 });
        }
    });

    document.addEventListener("mouseout", (e) => {
        const target = e.target.closest("a, button, .swiper-pagination-bullet, .work__button, .services__button, .contact__email-wrapper");
        if (target) {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: "var(--first-color)",
                border: "0px solid transparent",
                mixBlendMode: "difference",
                duration: 0.3
            });
            gsap.to(".cursor-trail-1", { opacity: 0.15, duration: 0.2 });
            gsap.to(".cursor-trail-2", { opacity: 0.1, duration: 0.2 });
        }
    });
}

/*=============== TECH SCROLL (JSON) ===============*/
const techLeft = document.getElementById("tech-left");
const techRight = document.getElementById("tech-right");

fetch("assets/data/techScroll.json")
    .then((res) => res.json())
    .then((data) => {
        renderTech(data);
        if (ScrollTrigger) ScrollTrigger.refresh(); // Refresh ScrollTrigger after dynamic content load
    })
    .catch((err) => console.error("Error loading tech:", err));

function renderTech(techs) {
    if (!techLeft || !techRight) return;

    const half = Math.ceil(techs.length / 2);
    const firstRow = techs.slice(0, half);
    const secondRow = techs.slice(half);
    const generateTrack = (items) => {
        const content = items
            .map(
                (item) => `
      <img src="${item.image}" alt="${item.name}">
    `,
            )
            .join("");

        return content + content;
    };

    techLeft.innerHTML = generateTrack(firstRow);
    techRight.innerHTML = generateTrack(secondRow);
}

/*=============== CONTINUOUS FLOATING PROFILE LOOP ===============*/
const runProfileFloat = () => {
    const profile = document.querySelector(".home__perfil");
    if (!profile) return;
    gsap.to(profile, {
        y: -12,
        rotation: 1,
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });
};

/*=============== MAGNETIC HOVER EFFECT ===============*/
const initMagnetic = () => {
    const targets = document.querySelectorAll(".home__social-link, .home__cv, #contact-btn, .nav__toggle, .contact__form-button, .scrollup");
    targets.forEach((elem) => {
        elem.addEventListener("mousemove", (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(elem, {
                x: x * 0.45,
                y: y * 0.45,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        elem.addEventListener("mouseleave", () => {
            gsap.to(elem, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
};

/*=============== 3D TILT EFFECT ===============*/
const init3DTilt = () => {
    const cards = document.querySelectorAll(".skills__card, .services__card");
    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = x / rect.width - 0.5;
            const yc = y / rect.height - 0.5;
            
            const maxRot = 10;
            
            gsap.to(card, {
                rotateX: -yc * maxRot,
                rotateY: xc * maxRot,
                scale: 1.025,
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.35)",
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        card.addEventListener("mouseleave", () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                boxShadow: "none",
                duration: 0.6,
                ease: "power2.out"
            });
        });
    });
};

/*=============== INTERACTIVE PARTICLES CANVAS ===============*/
const initParticleCanvas = () => {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 10;
            this.color = `rgba(50, 205, 50, ${Math.random() * 0.12 + 0.04})`; // Glowing transparent green
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        
        update() {
            this.baseY -= 0.2;
            if (this.baseY < 0) {
                this.baseY = canvas.height;
                this.x = Math.random() * canvas.width;
                this.baseX = this.x;
            }
            
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;
                    
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 15;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 15;
                    }
                }
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 15;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 15;
                }
            }
        }
    }
    
    const init = () => {
        particles = [];
        const numParticles = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 80);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    };
    
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    };
    
    init();
    animate();
    window.addEventListener("resize", init);
};

/*=============== DIGITAL SCRAMBLE TEXT EFFECT ===============*/
const scrambleTextNode = (node) => {
    const originalText = node.nodeValue;
    if (!originalText || !originalText.trim()) return;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$%#@*&?-+=^![]{}/~0123456789";
    let iterations = 0;
    
    const interval = setInterval(() => {
        node.nodeValue = originalText
            .split("")
            .map((char, index) => {
                if (char === " " || char === "\n") return char;
                if (index < iterations) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
        
        if (iterations >= originalText.length) {
            clearInterval(interval);
            node.nodeValue = originalText;
        }
        iterations += 1/2; // Speed
    }, 25);
};

const scrambleText = (element) => {
    const textNodes = [];
    const getTextNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            for (let child of node.childNodes) {
                getTextNodes(child);
            }
        }
    };
    getTextNodes(element);
    textNodes.forEach(scrambleTextNode);
};

/*=============== GSAP SCROLLTRIGGER REVEAL ANIMATIONS ===============*/
function initScrollReveals() {
    // Run continuous animations & interactions
    initParticleCanvas();
    runProfileFloat();
    initMagnetic();
    init3DTilt();

    // Section Titles Reveal with scramble
    gsap.utils.toArray(".section__title").forEach((title) => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none none",
                onEnter: () => scrambleText(title)
            },
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power3.out"
        });
    });

    // About Section Reveal
    if (document.querySelector(".about__container")) {
        gsap.from(".about__data", {
            scrollTrigger: {
                trigger: ".about__container",
                start: "top 80%"
            },
            opacity: 0,
            x: -80,
            duration: 1.2,
            ease: "power3.out"
        });
        gsap.from(".about__image", {
            scrollTrigger: {
                trigger: ".about__container",
                start: "top 80%"
            },
            opacity: 0,
            x: 80,
            duration: 1.2,
            ease: "power3.out"
        });
    }

    // Skills Cards Stagger Reveal
    if (document.querySelector(".skills__container")) {
        gsap.from(".skills__card", {
            scrollTrigger: {
                trigger: ".skills__container",
                start: "top 80%"
            },
            opacity: 0,
            y: 50,
            stagger: 0.15,
            duration: 1,
            ease: "power2.out"
        });
    }

    // Services Cards Stagger Reveal
    if (document.querySelector(".services__container")) {
        gsap.from(".services__card", {
            scrollTrigger: {
                trigger: ".services__container",
                start: "top 80%"
            },
            opacity: 0,
            y: 50,
            stagger: 0.15,
            duration: 1,
            ease: "power2.out"
        });
    }

    // Reveal Projects swiper
    if (document.querySelector(".projects__container")) {
        gsap.from(".projects__container", {
            scrollTrigger: {
                trigger: ".projects__container",
                start: "top 80%"
            },
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: "power3.out"
        });
    }

    // Experience (Work) Section Reveal - Growing line & staggered cards
    if (document.querySelector(".work__container")) {
        const workTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".work__container",
                start: "top 80%"
            }
        });

        workTl.from(".work__line", {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 1.2,
            ease: "power3.inOut"
        })
        .from(".work__card", {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.8");
    }

    // Contact Section Reveal
    if (document.querySelector(".contact__container")) {
        gsap.from(".contact__data", {
            scrollTrigger: {
                trigger: ".contact__container",
                start: "top 85%"
            },
            opacity: 0,
            x: -50,
            duration: 1,
            ease: "power3.out"
        });
        gsap.from(".contact__content", {
            scrollTrigger: {
                trigger: ".contact__container",
                start: "top 85%"
            },
            opacity: 0,
            x: 50,
            duration: 1,
            ease: "power3.out"
        });
    }

    // Blob Animate parallax movement
    gsap.utils.toArray(".blob-animate").forEach((blob) => {
        gsap.to(blob, {
            scrollTrigger: {
                trigger: blob,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: -50,
            ease: "none"
        });
    });
}

/*=============== CHANGE BACKGROUND HEADER ===============*/
const scrollHeader = () => {
    const header = document.getElementById("header");
    if (!header) return;
    if (window.scrollY >= 50) {
        header.classList.add("scroll-header");
    } else {
        header.classList.remove("scroll-header");
    }
};
window.addEventListener("scroll", scrollHeader);

/*=============== SHOW SCROLL UP & SMOOTH TOP SCROLL ===============*/
const scrollUp = () => {
    const scrollUpButton = document.getElementById("scroll-up");
    if (!scrollUpButton) return;
    if (window.scrollY >= 350) {
        scrollUpButton.classList.add("show-scroll");
    } else {
        scrollUpButton.classList.remove("show-scroll");
    }
};
window.addEventListener("scroll", scrollUp);

document.addEventListener("DOMContentLoaded", () => {
    /*=============== SHOW MENU ===============*/
    const navMenu = document.getElementById('nav-menu'),
          navToggle = document.getElementById('nav-toggle'),
          navClose = document.getElementById('nav-close')

    /* Menu show */
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu')
        })
    }

    /* Menu hidden */
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu')
        })
    }

    /*=============== REMOVE MENU ON LINK CLICK ===============*/
    const navLinks = document.querySelectorAll('.nav__link')
    navLinks.forEach(n => n.addEventListener('click', () => {
        if (navMenu) {
            navMenu.classList.remove('show-menu')
        }
    }))

    const scrollUpBtn = document.getElementById("scroll-up");
    if (scrollUpBtn) {
        scrollUpBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo("#home");
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});

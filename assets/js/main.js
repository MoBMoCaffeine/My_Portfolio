/*=============== HOME SPLIT TEXT ===============*/
const { animate, splitText, stagger } = anime;
const { chars: chars1 } = splitText(".home__profession-1", {
  chars: true,
});
const { chars: chars2 } = splitText(".home__profession-2", {
  chars: true,
});

animate(chars1, {
  y: [{ to: ["100%", "0%"] }, { to: "-100%", delay: 4000, ease: "in(3)" }],
  duration: 900,
  ease: "out(3)",
  delay: stagger(80),
  loop: true,
});

animate(chars2, {
  y: [{ to: ["100%", "0%"] }, { to: "-100%", delay: 4000, ease: "in(3)" }],
  duration: 900,
  ease: "out(3)",
  delay: stagger(80),
  loop: true,
});

/*=============== PROJECTS CARDS ===============*/
const projectsContent = document.getElementById("projects-content");

// get data from JSON
fetch("assets/data/projects.json")
  .then((response) => response.json())
  .then((data) => {
    renderProjects(data);
    initSwiper();
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
  /*=============== SWIPER PROJECTS ===============*/
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
// Glassmorphism tabs

/*=============== FETCH AND RENDER WORK DATA ===============*/
const experienceContainer = document.getElementById('experience'),
      educationContainer = document.getElementById('education');

fetch('assets/data/work.json')
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then(data => {
        renderWorkItems(data.experience, experienceContainer);
        renderWorkItems(data.education, educationContainer);
        initWorkTabs();
    })
    .catch(error => console.error('Error loading work data:', error));

function renderWorkItems(items, container) {
    if(!container) return;
    container.innerHTML = items.map(item => `
        <div class="work__card">
            <div class="work__data">
                <div>
                    <h1 class="work__title">${item.title.replace(' ', '<br>')}</h1>
                    <h3 class="work__subtitle">${item.subtitle}</h3>
                </div>
                <h2 class="work__year">${item.year}</h2>
            </div>
            <p class="work__description">${item.description}</p>
        </div>
    `).join("");
}

/*=============== WORK TABS LOGIC (ELASTIC BLOB) ===============*/
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

            tabContents.forEach(tc => tc.classList.remove("work-active"));
            target.classList.add("work-active");

            tabs.forEach(t => t.classList.remove("work-active"));
            tab.classList.add("work-active");

            updateBlob(tab);
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
  })
  .catch((error) => console.error("Error loading services:", error));

function renderServices(services) {
  servicesContent.innerHTML = services.map((service, index) => `
    <article class="services__card ${index === 0 ? 'services-open' : 'services-close'}">
       <div class="blob"></div>

       <div class="services__data">
          <i class="${service.icon} services__icon"></i> 
          <h2 class="services__title">${service.title}</h2>
          <p class="services__description">${service.description}</p>
       </div>

       <div class="services__info" style="height: ${index === 0 ? 'auto' : '0'}">
          <h3 class="services__subtitle">${service.subtitle}</h3>
          <ul class="services__skills">
             ${service.skills.map(skill => `<li class="services__skill">${skill}</li>`).join("")}
          </ul>
       </div>

       <button class="services__button">
         <i class="ri-arrow-down-s-line"></i>
       </button>
    </article>
  `).join("");
}

/*=============== SERVICES ACCORDION FUNCTION ===============*/
function initServicesAccordion() {
    const servicesCards = document.querySelectorAll('.services__card');

    servicesCards.forEach((card) => {
        const button = card.querySelector('.services__button');
        const info = card.querySelector('.services__info');

        if(card.classList.contains('services-open')) {
            info.style.height = info.scrollHeight + 'px';
        }

        button.addEventListener('click', () => {
            const isOpen = card.classList.contains('services-open');

            servicesCards.forEach((otherCard) => {
                otherCard.classList.replace('services-open', 'services-close');
                otherCard.querySelector('.services__info').style.height = '0';
            });

            if (!isOpen) {
                card.classList.replace('services-close', 'services-open');
                info.style.height = info.scrollHeight + 'px';
            }
        });
    });
}
/*=============== TESTIMONIALS OF DUPLICATE CARDS ===============*/

/*=============== COPY CONTACT ===============*/
const copyBtn = document.getElementById('contact-btn'),
      copyEmail = document.getElementById('contact-email').textContent;
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(copyEmail).then(() => {
        copyBtn.innerHTML = 'Email Copied <i class="ri-check-line"></i>';

        setTimeout(() => {
            copyBtn.innerHTML = 'Copy Email <i class="ri-file-copy-line">'
        }, 2000);
    });
});
/*=============== CURRENT YEAR OF THE FOOTER ===============*/
const textYear = document.getElementById('footer-year'),
      currentYear = new Date().getFullYear();
textYear.textContent = currentYear;
/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const id = section.id,
              top = section.offsetTop - 50,
              height = section.offsetHeight,
              link = document.querySelector('.nav__menu a[href*=' + id + ']');
        if(!link) return;

        link.classList.toggle('active-link', scrollY > top && scrollY <= top + height);
    });
};
window.addEventListener('scroll', scrollActive);
/*=============== CUSTOM CURSOR ===============*/
const cursor = document.querySelector('.cursor');
let mouseX = 0, mouseY = 0;

const cursorMove = () => {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    cursor.style.transform = `translate(-50%, -50%)`;

    requestAnimationFrame(cursorMove);
};

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

cursorMove();
/* Hide custom cursor on links */
const a = document.querySelectorAll('a');

a.forEach(item => {
    item.addEventListener('mouseover', () => {
        cursor.classList.add('hide-cursor');
    });
    item.addEventListener('mouseleave', () => {
        cursor.classList.remove('hide-cursor');
    });
});
/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 300,
    // reset: true,
});

sr.reveal(`.home__image, .projects__container, .work__container, .testimonials__container, .contact__container`);
sr.reveal(`.home__data`, {delay: 900, origin: 'bottom'});
sr.reveal(`.home__info`, {delay: 1200, origin: 'bottom'});
sr.reveal(`.home__social, .home__cv`, {delay: 1500});

sr.reveal(`.about__data`, {origin: 'left'});
sr.reveal(`.about__image`, {origin: 'right'});

sr.reveal(`.services__card`, {interval: 100});

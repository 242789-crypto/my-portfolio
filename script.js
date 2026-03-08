// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once animated
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Function to add observer to elements
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();

    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navList.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }

    // CMS Data Loading Logic
    const skillIcons = {
        wordpress: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M15.5 10.5 12 16l-3.5-5.5"></path><path d="M8.5 14.5 12 8l3.5 6.5"></path></svg>`,
        layout: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>`,
        code: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M11 17a2 2 0 0 1-2 2H7"></path><path d="M15.5 19a2 2 0 1 0 0-4h-1.5"></path></svg>`,
        atom: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="10" ry="4"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"></ellipse></svg>`,
        server: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>`,
        database: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 5.58 2 10s4.48 8 10 8 10-3.58 10-8-4.48-8-10-8z"></path><path d="M12 4c-3.31 0-6 2.01-6 4.5S8.69 13 12 13s6-2.01 6-4.5S15.31 4 12 4z"></path></svg>`,
        box: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon><line x1="12" y1="22" x2="12" y2="15.5"></line><polyline points="22 8.5 12 15.5 2 8.5"></polyline><polyline points="2 15.5 12 8.5 22 15.5"></polyline><line x1="12" y1="2" x2="12" y2="8.5"></line></svg>`,
        github: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`
    };

    async function loadCMSData() {
        if (window.location.protocol === 'file:') {
            console.error('Portfolio is running in "file" mode. The Admin CMS data cannot be loaded unless you use the local server URL.');
            console.info('Please visit: http://localhost:3000/index.html');
            return;
        }

        try {
            const response = await fetch('/api/content');
            if (!response.ok) throw new Error('Failed to fetch content');
            const data = await response.json();

            console.log('Portfolio data loaded from CMS:', data);

            // Populate Hero
            try {
                if (data.hero) {
                    const hName = document.getElementById('hero-name');
                    const hTitle = document.getElementById('hero-title');
                    const hDesc = document.getElementById('hero-desc');
                    if (hName) hName.textContent = data.hero.name || 'Waleed Abdullah';
                    if (hTitle) hTitle.textContent = data.hero.title || 'Web Developer';
                    if (hDesc) hDesc.textContent = data.hero.description || '';
                }
            } catch (e) { console.error('Error loading Hero:', e); }

            // Populate About
            try {
                if (data.about) {
                    const aStmt = document.getElementById('about-statement');
                    if (aStmt) aStmt.innerHTML = (data.about.statement || '').replace(/(elegant)/g, '<span class="accent">$1</span>');

                    const detailsContainer = document.getElementById('about-details-container');
                    if (detailsContainer && data.about.details) {
                        detailsContainer.innerHTML = data.about.details.map(detail => `
                            <div class="detail-item">
                                <span class="detail-icon">${detail.icon}</span>
                                <p><strong>${detail.label}:</strong> ${detail.content}</p>
                            </div>
                        `).join('');
                    }
                }
            } catch (e) { console.error('Error loading About:', e); }

            // Populate Skills
            try {
                if (data.skills) {
                    const skillsContainer = document.getElementById('skills-container');
                    if (skillsContainer) {
                        skillsContainer.innerHTML = data.skills.map((skill, index) => `
                            <div class="skill-item animate-on-scroll ${index % 2 === 0 ? 'slide-left' : 'slide-right'}" style="transition-delay: ${index * 0.1}s;">
                                <div class="skill-diamond">
                                    <div class="skill-icon-diamond">${skillIcons[skill.icon] || ''}</div>
                                </div>
                                <h4 class="skill-name">${skill.name}</h4>
                            </div>
                        `).join('');
                    }
                }
            } catch (e) { console.error('Error loading Skills:', e); }

            // Populate Resume
            try {
                if (data.resume) {
                    const resumeContainer = document.getElementById('resume-container');
                    if (resumeContainer) {
                        const centerLine = `<div class="timeline-center-line"><div class="timeline-fill-line" id="timeline-fill-line"></div></div>`;
                        resumeContainer.innerHTML = centerLine + data.resume.map((item, index) => `
                            <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'} animate-on-scroll ${index % 2 === 0 ? 'timeline-slide-left' : 'timeline-slide-right'}">
                                <div class="timeline-dot-center"></div>
                                <div class="timeline-card">
                                    <div class="timeline-pointer"></div>
                                    <div class="timeline-badge" style="${item.type === 'education' ? 'background-color: rgba(31, 41, 55, 0.8); color: #9CA3AF; border-color: #374151;' : ''}">${item.type.toUpperCase()}</div>
                                    <h3 class="timeline-card-title">${item.title}</h3>
                                    <p class="timeline-card-date">${item.date} | ${item.company}</p>
                                    <p class="timeline-card-desc">${item.description}</p>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            } catch (e) { console.error('Error loading Resume:', e); }

            // Populate Stats
            try {
                if (data.stats) {
                    const statsContainer = document.getElementById('stats-container');
                    if (statsContainer) {
                        statsContainer.innerHTML = data.stats.map((stat, index) => `
                            <div class="stat-wrapper animate-on-scroll" style="transition-delay: ${index * 0.2}s;">
                                <div class="stat-diamond">
                                    <div class="stat-content">
                                        <h3 class="stat-number">${stat.number}</h3>
                                        <p class="stat-label">${stat.label.replace(' ', '<br>')}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            } catch (e) { console.error('Error loading Stats:', e); }

            // Populate Portfolio
            try {
                if (data.portfolio) {
                    const portfolioContainer = document.getElementById('portfolio-container');
                    if (portfolioContainer) {
                        portfolioContainer.innerHTML = data.portfolio.map(project => `
                            <div class="portfolio-card">
                                <div class="portfolio-img-container">
                                    <img src="${project.image}" alt="${project.title}">
                                </div>
                                <div class="portfolio-content">
                                    <h4>${project.title}</h4>
                                    <p class="portfolio-type">${project.type}</p>
                                    <ul class="project-details">
                                        <li><strong>Client:</strong> ${project.client}</li>
                                        <li><strong>Duration:</strong> ${project.duration}</li>
                                        <li><strong>Tech Stack:</strong> ${project.tech}</li>
                                    </ul>
                                    <a href="${project.link}" class="btn-primary" target="_blank" rel="noopener noreferrer">Preview</a>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            } catch (e) { console.error('Error loading Portfolio:', e); }

            // Populate Testimonials
            try {
                if (data.testimonials) {
                    const testimonialsContainer = document.getElementById('testimonials-container');
                    if (testimonialsContainer) {
                        testimonialsContainer.innerHTML = data.testimonials.map(t => `
                            <div class="testimonial-card">
                                <p class="quote">"${t.quote}"</p>
                                <div class="client-info">
                                    <div class="client-avatar">
                                        <img src="${t.avatar}" alt="${t.name}">
                                    </div>
                                    <div>
                                        <h4 class="client-name">${t.name}</h4>
                                        <span class="client-role">${t.role}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            } catch (e) { console.error('Error loading Testimonials:', e); }

            // Populate Contact
            try {
                if (data.contact) {
                    const cLoc = document.getElementById('contact-location');
                    const cPhone = document.getElementById('contact-phone');
                    const cEmail = document.getElementById('contact-email');

                    if (cLoc) cLoc.textContent = data.contact.location || 'Islamabad, Pakistan';
                    if (cPhone) cPhone.textContent = data.contact.phone || '0314 9763195';
                    if (cEmail) {
                        cEmail.textContent = data.contact.email || 'waleed03149763195@gmail.com';
                        cEmail.href = `mailto:${data.contact.email}`;
                    }

                    // Update Social Links
                    if (data.contact.social) {
                        const sGithub = document.getElementById('social-github');
                        const sLinkedin = document.getElementById('social-linkedin');
                        const sFacebook = document.getElementById('social-facebook');
                        const sInstagram = document.getElementById('social-instagram');

                        if (sGithub) sGithub.href = data.contact.social.github || '#';
                        if (sLinkedin) sLinkedin.href = data.contact.social.linkedin || '#';
                        if (sFacebook) sFacebook.href = data.contact.social.facebook || '#';
                        if (sInstagram) sInstagram.href = data.contact.social.instagram || '#';
                    }
                }
            } catch (e) { console.error('Error loading Contact info:', e); }

            // Re-initialize animations for new elements
            initScrollAnimations();

        } catch (error) {
            console.error('Error loading portfolio data:', error);
        }
    }

    loadCMSData();

    // Timeline Fill Logic (re-attached to dynamic element)
    window.addEventListener('scroll', () => {
        const timelineSection = document.getElementById('resume');
        const timelineFill = document.getElementById('timeline-fill-line');
        if (timelineSection && timelineFill) {
            const rect = timelineSection.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;
            const startScroll = windowHeight / 2;
            let currentScroll = startScroll - sectionTop;
            if (currentScroll < 0) currentScroll = 0;
            if (currentScroll > sectionHeight) currentScroll = sectionHeight;
            const scrollPercentage = (currentScroll / sectionHeight) * 100;
            timelineFill.style.height = `${scrollPercentage}%`;
        }
    });

    // Active Section Tracker & Floating Indicator
    const sections = document.querySelectorAll('section[id]');
    const navIndicator = document.getElementById('nav-indicator');
    const navItems = document.querySelectorAll('.nav-list a');

    function moveIndicator(element) {
        if (!element || window.innerWidth <= 768) {
            if (navIndicator) navIndicator.style.opacity = '0';
            return;
        }
        const rect = element.getBoundingClientRect();
        const containerRect = document.querySelector('.nav-container').getBoundingClientRect();
        const left = rect.left - containerRect.left;
        const top = rect.top - containerRect.top;
        const width = rect.width;
        const height = rect.height;
        navIndicator.style.width = width + 'px';
        navIndicator.style.height = height + 'px';
        navIndicator.style.transform = `translate(${left}px, ${top}px)`;
        navIndicator.style.opacity = '1';
    }

    const sectionObserverOptions = {
        threshold: 0,
        rootMargin: "-45% 0px -54% 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        setTimeout(() => moveIndicator(link), 0);
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => sectionObserver.observe(section));

    navItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => moveIndicator(e.target));
    });

    const navBar = document.querySelector('.navbar');
    if (navBar) {
        navBar.addEventListener('mouseleave', () => {
            const activeLink = document.querySelector('.nav-list a.active');
            if (activeLink) moveIndicator(activeLink);
        });
    }

    window.addEventListener('load', () => {
        const hash = window.location.hash || '#hero';
        const activeLink = document.querySelector(`.nav-list a[href="${hash}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            setTimeout(() => moveIndicator(activeLink), 100);
        }
    });

    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-list a.active');
        if (activeLink) moveIndicator(activeLink);
    });

    // Ninja Mouse Parallax Effect
    const aboutSection = document.querySelector('.about-ninja-section');
    const ninjaWrapper = document.querySelector('.ninja-image-wrapper');
    const ninjaImg = document.querySelector('.ninja-image');

    if (aboutSection && ninjaWrapper && ninjaImg) {
        aboutSection.addEventListener('mousemove', (e) => {
            const rect = aboutSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const moveX = (x - rect.width / 2) / 40;
            const moveY = (y - rect.height / 2) / 40;
            const rotateX = (y - rect.height / 2) / 50;
            const rotateY = (rect.width / 2 - x) / 50;
            ninjaWrapper.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            const dist = Math.sqrt(Math.pow(moveX, 2) + Math.pow(moveY, 2));
            ninjaImg.style.filter = `brightness(${0.95 + dist / 100}) contrast(1.1)`;
        });

        aboutSection.addEventListener('mouseleave', () => {
            ninjaWrapper.style.transform = `translate(0, 0) rotateX(0deg) rotateY(0deg)`;
            ninjaImg.style.filter = `brightness(0.95) contrast(1.1)`;
        });
    }

    const ninjaObserverOptions = {
        threshold: 0.2,
        rootMargin: "0px"
    };

    const ninjaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const wrapper = entry.target.querySelector('.ninja-image-wrapper');
            if (entry.isIntersecting && wrapper) {
                wrapper.classList.add('rolling-active');
            } else if (wrapper) {
                wrapper.classList.remove('rolling-active');
            }
        });
    }, ninjaObserverOptions);

    if (aboutSection) ninjaObserver.observe(aboutSection);
});

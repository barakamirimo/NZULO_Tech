/**
 * DIEUME MIRIMO - PORTFOLIO & FORMATION EN LANGUES
 * Script principal moderne, réactif et optimisé.
 */

(function () {
    'use strict';

    window.googleTranslateElementInit = function () {
        if (!window.google || !google.translate || !google.translate.TranslateElement) return;
        new google.translate.TranslateElement({
            pageLanguage: 'fr',
            includedLanguages: 'fr,en,es,sw',
            autoDisplay: false
        }, 'google_translate_element');
    };

    function setSiteLanguage(languageCode, languageLabel) {
        document.documentElement.setAttribute('lang', languageCode);
        try {
            localStorage.setItem('nzulo_language', languageCode);
        } catch (e) {}

        document.querySelectorAll('.language-current').forEach(function (label) {
            label.textContent = languageLabel;
        });
        document.querySelectorAll('.language-current-mobile').forEach(function (label) {
            label.textContent = languageLabel;
        });
        document.querySelectorAll('.language-option').forEach(function (option) {
            option.classList.toggle('active', option.getAttribute('data-language') === languageCode);
        });

        if (languageCode !== 'fr') {
            document.cookie = 'googtrans=/fr/' + languageCode + '; path=/';
            location.reload();
        } else {
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
            location.reload();
        }
    }

    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(function (option) {
        option.addEventListener('click', function () {
            setSiteLanguage(option.getAttribute('data-language'), option.getAttribute('data-label'));
        });
    });

    let savedLanguage = 'fr';
    try {
        savedLanguage = localStorage.getItem('nzulo_language') || 'fr';
    } catch (e) {}

    const languageLabels = { fr: 'Français', en: 'English', es: 'Español', sw: 'Swahili' };
    document.documentElement.setAttribute('lang', savedLanguage);
    document.querySelectorAll('.language-current').forEach(function (label) {
        label.textContent = languageLabels[savedLanguage] || 'Français';
    });
    document.querySelectorAll('.language-current-mobile').forEach(function (label) {
        label.textContent = languageLabels[savedLanguage] || 'Français';
    });

    // -------------------- 1. GESTION DU THÈME CLAIR / SOMBRE (MODE CLAIR PRINCIPAL) --------------------
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Nettoyage des anciens flags automatiques pour garantir le Mode Clair principal
    try {
        if (localStorage.getItem('dieume_theme')) {
            localStorage.removeItem('dieume_theme');
        }
    } catch (e) {
        // Ignorer si le stockage local est restreint en navigation privée
    }

    function getInitialTheme() {
        try {
            const savedTheme = localStorage.getItem('nzulo_theme');
            if (savedTheme === 'dark' || savedTheme === 'light') {
                return savedTheme;
            }
        } catch (e) {}
        // Le Mode Clair (Light Mode) est le mode principal obligatoire à l'accès au site
        return 'light';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('nzulo_theme', theme);
        } catch (e) {}
    }

    // Application immédiate du thème clair principal
    applyTheme(getInitialTheme());

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }

    // -------------------- 2. HEADER SCROLL & MOBILE MENU --------------------
    const header = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const desktopNavLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');

    // Header sticky shadow & Back to Top visibility optimisés via requestAnimationFrame
    let scrollTicking = false;

    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            window.requestAnimationFrame(function () {
                const scrollY = window.scrollY;

                if (header) {
                    if (scrollY > 30) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }

                if (backToTopBtn) {
                    if (scrollY > 450) {
                        backToTopBtn.classList.add('visible');
                    } else {
                        backToTopBtn.classList.remove('visible');
                    }
                }

                updateScrollspy();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Toggle menu mobile
    function toggleMobileMenu() {
        if (!mobileMenu || !mobileToggle) return;
        const isOpen = mobileMenu.classList.contains('open');

        if (isOpen) {
            mobileMenu.classList.remove('open');
            mobileToggle.classList.remove('open');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        } else {
            mobileMenu.classList.add('open');
            mobileToggle.classList.add('open');
            mobileToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    // Toggle sous-menu mobile pour À propos (Équipe & Contacts)
    const mobileSubnavToggle = document.querySelector('.mobile-subnav-toggle');
    const mobileSubnavList = document.querySelector('.mobile-subnav-list');
    if (mobileSubnavToggle && mobileSubnavList) {
        mobileSubnavToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = mobileSubnavToggle.classList.contains('open');
            if (isOpen) {
                mobileSubnavToggle.classList.remove('open');
                mobileSubnavToggle.setAttribute('aria-expanded', 'false');
                mobileSubnavList.style.display = 'none';
            } else {
                mobileSubnavToggle.classList.add('open');
                mobileSubnavToggle.setAttribute('aria-expanded', 'true');
                mobileSubnavList.style.display = 'flex';
            }
        });
    }

    const mobileLanguageToggle = document.querySelector('.mobile-language-toggle');
    const mobileLanguageMenu = document.querySelector('.mobile-language-menu');
    if (mobileLanguageToggle && mobileLanguageMenu) {
        mobileLanguageToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = mobileLanguageToggle.classList.contains('open');
            mobileLanguageToggle.classList.toggle('open', !isOpen);
            mobileLanguageToggle.setAttribute('aria-expanded', String(!isOpen));
            mobileLanguageMenu.style.display = isOpen ? 'none' : 'flex';
        });
    }

    const allMobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-subnav-link');
    allMobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Fermer le dropdown desktop au clic d'un sous-lien
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            const dropdown = link.closest('.nav-dropdown');
            if (dropdown) {
                dropdown.classList.remove('open');
            }
        });
    });

    // -------------------- 3. SCROLLSPY NAVIGATION & ONGLET ACCUEIL DYNAMIQUE --------------------
    const sections = document.querySelectorAll('section[id], header[id]');
    const navItemHome = document.getElementById('nav-item-home');
    const mobileNavItemHome = document.getElementById('mobile-nav-item-home');

    function setHomeTabVisible(visible) {
        if (visible) {
            if (navItemHome) navItemHome.classList.remove('hidden-home');
            if (mobileNavItemHome) mobileNavItemHome.classList.remove('hidden-home');
        } else {
            if (navItemHome) navItemHome.classList.add('hidden-home');
            if (mobileNavItemHome) mobileNavItemHome.classList.add('hidden-home');
        }
    }

    // Au clic sur n'importe quel onglet : afficher immédiatement Accueil (ou le masquer si clic vers Accueil)
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const targetHref = anchor.getAttribute('href');

        if (targetHref === '#hero') {
            setHomeTabVisible(false);
        } else if (targetHref && targetHref.length > 1) {
            setHomeTabVisible(true);
        }
    });

    // Initialiser l'état selon la position initiale au chargement
    if (window.scrollY > 120) {
        setHomeTabVisible(true);
    } else {
        setHomeTabVisible(false);
    }

    function updateScrollspy() {
        const scrollPosition = window.scrollY + 140;
        let activeSectionId = null;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSectionId = section.getAttribute('id');
                break;
            }
        }

        if (activeSectionId) {
            // Dans Accueil : masquer l'onglet Accueil. Hors d'Accueil : l'afficher directement
            if (activeSectionId === 'hero' || window.scrollY < 120) {
                setHomeTabVisible(false);
            } else {
                setHomeTabVisible(true);
            }

            const activeHref = '#' + activeSectionId;

            desktopNavLinks.forEach(function (link) {
                if (link.getAttribute('href') === activeHref) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            mobileNavLinks.forEach(function (link) {
                if (link.getAttribute('href') === activeHref) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            const aboutBtn = document.getElementById('about-dropdown-btn');
            if (aboutBtn) {
                if (activeSectionId === 'about' || activeSectionId === 'team' || activeSectionId === 'contact') {
                    aboutBtn.classList.add('active');
                } else {
                    aboutBtn.classList.remove('active');
                }
            }
        }
    }

    // -------------------- 4. TYPEWRITER DYNAMIQUE HERO --------------------
    const typedOutput = document.getElementById('typed-output');
    const phrases = [
        "Infrastructures Réseaux & Télécoms",
        "NZULO Language Academy (EN • FR • ES)",
        "Cybersécurité & Audits Avancés",
        "Solutions Web & Systèmes Cloud",
        "CONNECT • INNOVATE • EMPOWER",
        "Direction Générale : Dieume MIRIMO (CEO)"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 75;

    function typeWriter() {
        if (!typedOutput) return;

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedOutput.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 35;
        } else {
            typedOutput.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 70;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause à la fin de la phrase
            isDeleting = true;
            typingSpeed = 1800;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(typeWriter, typingSpeed);
    }

    setTimeout(typeWriter, 500);

    // -------------------- 5. COMPTEURS ANIMÉS DES STATISTIQUES --------------------
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateCounters() {
        statNumbers.forEach(function (counter) {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 1600;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Fonction easeOutQuad
                const easeOutProgress = 1 - (1 - progress) * (1 - progress);
                const currentVal = Math.floor(easeOutProgress * target);

                counter.textContent = currentVal;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
        const statsSection = document.querySelector('.hero-stats-container');
        if (statsSection) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !statsAnimated) {
                        statsAnimated = true;
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(statsSection);
        }
    } else {
        animateCounters();
    }

    // -------------------- 6. SHOWCASE CAROUSEL --------------------
    const carousel = document.getElementById('home-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.dot');
        const prevBtn = carousel.querySelector('.carousel-arrow.prev');
        const nextBtn = carousel.querySelector('.carousel-arrow.next');
        const progressFill = carousel.querySelector('.progress-fill');

        let currentIndex = 0;
        const totalSlides = slides.length;
        let slideInterval = null;
        const intervalDuration = 4500;
        let progressInterval = null;
        let progressStart = 0;

        function updateCarousel(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            if (track) {
                track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
            }

            slides.forEach(function (slide, idx) {
                slide.classList.toggle('active', idx === currentIndex);
            });

            dots.forEach(function (dot, idx) {
                dot.classList.toggle('active', idx === currentIndex);
            });

            resetProgress();
        }

        function resetProgress() {
            if (!progressFill) return;
            progressFill.style.transition = 'none';
            progressFill.style.width = '0%';
            void progressFill.offsetWidth;
            progressFill.style.transition = 'width ' + intervalDuration + 'ms linear';
            progressFill.style.width = '100%';
        }

        function startAutoPlay() {
            stopAutoPlay();
            resetProgress();
            slideInterval = setInterval(function () {
                updateCarousel(currentIndex + 1);
            }, intervalDuration);
        }

        function stopAutoPlay() {
            if (slideInterval) clearInterval(slideInterval);
            if (progressFill) {
                progressFill.style.transition = 'none';
                progressFill.style.width = '0%';
            }
            slideInterval = null;
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                stopAutoPlay();
                updateCarousel(currentIndex - 1);
                startAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                stopAutoPlay();
                updateCarousel(currentIndex + 1);
                startAutoPlay();
            });
        }

        dots.forEach(function (dot, idx) {
            dot.addEventListener('click', function () {
                stopAutoPlay();
                updateCarousel(idx);
                startAutoPlay();
            });
        });

        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Touch Swipe pour mobile
        let startX = 0;
        let deltaX = 0;

        track.addEventListener('touchstart', function (e) {
            if (e.touches && e.touches.length > 0) {
                startX = e.touches[0].clientX;
                deltaX = 0;
                stopAutoPlay();
            }
        }, { passive: true });

        track.addEventListener('touchmove', function (e) {
            if (e.touches && e.touches.length > 0) {
                deltaX = e.touches[0].clientX - startX;
            }
        }, { passive: true });

        track.addEventListener('touchend', function () {
            if (Math.abs(deltaX) > 45) {
                if (deltaX < 0) {
                    updateCarousel(currentIndex + 1);
                } else {
                    updateCarousel(currentIndex - 1);
                }
            }
            startAutoPlay();
        });

        // Démarrer le carrousel
        startAutoPlay();
    }

    // -------------------- 7. SIMULATEUR DE FORMATION EN LANGUES --------------------
    const simLangBtns = document.querySelectorAll('#sim-lang-options .sim-opt-btn');
    const simLevelBtns = document.querySelectorAll('#sim-level-options .sim-opt-btn');
    const simGoalBtns = document.querySelectorAll('#sim-goal-options .sim-opt-btn');
    const simPaceBtns = document.querySelectorAll('#sim-pace-options .sim-opt-btn');

    const simResultTitle = document.getElementById('sim-result-title');
    const simResultDuration = document.getElementById('sim-result-duration');
    const simResultHours = document.getElementById('sim-result-hours');
    const simResultFormat = document.getElementById('sim-result-format');
    const simResultModules = document.getElementById('sim-result-modules');
    const simWhatsappBtn = document.getElementById('sim-whatsapp-btn');
    const btnApplySim = document.querySelector('.btn-apply-sim');

    let currentSim = {
        lang: 'Anglais',
        level: 'Débutant (A1-A2)',
        goal: 'Carrière IT & Entretiens',
        pace: 'Régulier (2h à 3h / semaine)'
    };

    function setupOptionGroup(buttons, key) {
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentSim[key] = btn.getAttribute('data-value');
                calculateSimResult();
            });
        });
    }

    setupOptionGroup(simLangBtns, 'lang');
    setupOptionGroup(simLevelBtns, 'level');
    setupOptionGroup(simGoalBtns, 'goal');
    setupOptionGroup(simPaceBtns, 'pace');

    // Modules prédéfinis selon la langue et l'objectif
    const modulesDB = {
        'Anglais': {
            'Carrière IT & Entretiens': [
                "Vocabulaire technique réseau, cloud, dev et architecture logicielle",
                "Simulation d'entretiens d'embauche en visioconférence avec feedbacks",
                "Animation de daily meetings, sprint reviews et communication d'équipe",
                "Rédaction de documentation technique, emails pro et pull requests claires"
            ],
            'Conversation Fluide & Voyage': [
                "Ateliers d'expression orale sans blocage et réduction d'accent",
                "Conversations quotidiennes, situations d'aéroport, hôtel et voyage",
                "Compréhension auditive des accents variés (US, UK, International)",
                "Échange spontané, connecteurs logiques et expressions idiomatiques courantes"
            ],
            'Affaires & Négociation Pro': [
                "Pitch commercial percutant et techniques de négociation internationale",
                "Présentations percutantes avec slides et gestion des questions difficiles",
                "Rédaction de propositions commerciales et correspondances formelles",
                "Vocabulaire financier, contractuel et stratégie d'entreprise"
            ],
            'Certification & Concours': [
                "Entraînement spécifique aux épreuves du TOEFL, IELTS ou TOEIC",
                "Méthodologie de gestion du temps et pièges fréquents des examens",
                "Pratique intensive des sections écrites et de la compréhension orale",
                "Examens blancs corrigés avec notation détaillée"
            ]
        },
        'Français': {
            'Carrière IT & Entretiens': [
                "Rédaction technique soignée : cahiers des charges, synthèses et rapports",
                "Aisance oratoire lors des réunions de direction et comités de pilotage",
                "Maîtrise du vocabulaire formel d'entreprise et syntaxe irréprochable",
                "Communication assertive et négociation interne"
            ],
            'Conversation Fluide & Voyage': [
                "Pratique conversationnelle sur sujets de société et d'actualité",
                "Perfectionnement de la prononciation et enrichissement du lexique",
                "Aisance dans les échanges informels et culture francophone",
                "Élimination des hésitations et des fautes récurrentes"
            ],
            'Affaires & Négociation Pro': [
                "Éloquence et rhétorique professionnelle pour décideurs",
                "Rédaction d'audits, contrats et correspondances de haut niveau",
                "Gestion des conflits et conduite de réunions stratégiques",
                "Argumentation persuasive et art de la formule"
            ],
            'Certification & Concours': [
                "Préparation rigoureuse aux diplômes DELF / DALF (B2, C1, C2)",
                "Méthode de la synthèse de documents et de l'exposé oral structuré",
                "Orthographe, grammaire avancée et accords complexes",
                "Mises en situation sous format d'examen officiel"
            ]
        },
        'Espagnol': {
            'Carrière IT & Entretiens': [
                "Vocabulaire informatique, support technique et gestion de projets en espagnol",
                "Entretiens de recrutement avec des entreprises hispanophones",
                "Échanges professionnels avec équipes en Espagne et Amérique Latine",
                "Documentation et messagerie professionnelle en espagnol"
            ],
            'Conversation Fluide & Voyage': [
                "Bases de la conversation spontanée et dialogue sans hésitation",
                "Expressions du quotidien, voyages, déplacements et autonomie complète",
                "Compréhension auditive des dialectes espagnols et latino-américains",
                "Jeux de rôles vivants et immersifs à chaque séance"
            ],
            'Affaires & Négociation Pro': [
                "Español comercial : import-export, devis et négociation de tarifs",
                "Relations partenariales en Amérique Centrale, du Sud et Espagne",
                "Rédaction de courriers formels et communication commerciale",
                "Présentation de produits et services en espagnol"
            ],
            'Certification & Concours': [
                "Préparation ciblée aux examens officiels DELE / SIELE",
                "Entraînement aux 4 compétences (lecture, écoute, écriture, oral)",
                "Conjugaison complète et pièges grammaticaux espagnols",
                "Simulations d'examens chronométrées"
            ]
        },
        'Swahili': {
            'Carrière IT & Entretiens': [
                "Vocabulaire professionnel, technique et administratif en swahili",
                "Présentations professionnelles et simulations d'entretiens",
                "Communication fluide avec les équipes d'Afrique centrale et orientale",
                "Rédaction de supports et échanges professionnels en swahili"
            ],
            'Conversation Fluide & Voyage': [
                "Conversation quotidienne et autonomie dans les situations courantes",
                "Prononciation, écoute active et expressions idiomatiques",
                "Jeux de rôles pour les voyages, commerces et rencontres",
                "Culture et communication dans les communautés swahilophones"
            ],
            'Affaires & Négociation Pro': [
                "Vocabulaire commercial, de négociation et d'administration",
                "Animation de réunions et présentations professionnelles",
                "Correspondances formelles et suivi des partenaires",
                "Argumentation claire dans des contextes régionaux"
            ],
            'Certification & Concours': [
                "Préparation ciblée aux épreuves écrites et orales",
                "Entraînement à la grammaire, au vocabulaire et à la compréhension",
                "Corrections personnalisées et examens blancs",
                "Méthodes de gestion du temps et de prise de parole"
            ]
        },
        'Art parlé': {
            'Carrière IT & Entretiens': [
                "Structuration d'une présentation professionnelle convaincante",
                "Techniques de réponse aux questions difficiles en entretien",
                "Gestion du trac, du ton et du langage corporel",
                "Communication persuasive adaptée aux réunions et conférences"
            ],
            'Conversation Fluide & Voyage': [
                "Amélioration de la diction et de la fluidité orale",
                "Échanges spontanés dans les contextes personnels et professionnels",
                "Techniques de respiration, écoute active et improvisation",
                "Adaptation du registre de langage à l'auditoire"
            ],
            'Affaires & Négociation Pro': [
                "Art du pitch, de la négociation et de l'argumentation",
                "Présentations percutantes avec gestion des objections",
                "Maîtrise de la voix, du rythme et de la persuasion",
                "Discours adaptés aux partenaires commerciaux"
            ],
            'Certification & Concours': [
                "Préparation aux concours, examens oraux et débats",
                "Construction d'un discours clair, cohérent et mémorable",
                "Entraînement chronométré avec corrections personnalisées",
                "Maîtrise des transitions, conclusions et supports visuels"
            ]
        }
    };

    function calculateSimResult() {
        if (!simResultTitle) return;

        const lang = currentSim.lang;
        const level = currentSim.level;
        const goal = currentSim.goal;
        const pace = currentSim.pace;

        // Titre dynamique
        simResultTitle.textContent = 'Programme ' + lang + ' : ' + goal;

        // Durée et volume selon niveau et rythme
        let duration = '8 à 12 Semaines';
        let hours = '24 à 36 Heures de cours live';

        if (pace.includes('Intensif')) {
            duration = level.includes('Débutant') ? '6 à 8 Semaines' : '4 à 6 Semaines';
            hours = '30 à 45 Heures intensives';
        } else if (pace.includes('Flexible')) {
            duration = '12 à 16 Semaines';
            hours = '16 à 24 Heures étalées';
        } else {
            duration = level.includes('Débutant') ? '10 à 14 Semaines' : '8 à 10 Semaines';
            hours = '24 à 32 Heures régulières';
        }

        if (simResultDuration) simResultDuration.textContent = duration;
        if (simResultHours) simResultHours.textContent = hours;
        if (simResultFormat) simResultFormat.textContent = 'Coaching 1-to-1 Live + Supports & Exercices';

        // Modules
        if (simResultModules && modulesDB[lang] && modulesDB[lang][goal]) {
            simResultModules.innerHTML = '';
            modulesDB[lang][goal].forEach(function (mod) {
                const li = document.createElement('li');
                li.textContent = mod;
                simResultModules.appendChild(li);
            });
        }

        // WhatsApp message generator
        if (simWhatsappBtn) {
            const waText = encodeURIComponent(
                "Bonjour NZULO Tech,\n" +
                "J'ai configuré mon programme de formation sur votre plateforme officielle :\n" +
                "- Langue : " + lang + "\n" +
                "- Niveau actuel : " + level + "\n" +
                "- Objectif : " + goal + "\n" +
                "- Rythme souhaité : " + pace + "\n" +
                "Je souhaite planifier mon test de niveau gratuit avec la direction de la NZULO Language Academy !"
            );
            simWhatsappBtn.onclick = function () {
                window.open('https://wa.me/243847988507?text=' + waText, '_blank');
            };
        }
    }

    calculateSimResult();

    // Boutons de sélection rapide depuis les cartes langues
    const selectLangBtns = document.querySelectorAll('.btn-select-lang');
    selectLangBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const chosenLang = btn.getAttribute('data-lang');
            simLangBtns.forEach(function (b) {
                if (b.getAttribute('data-value') === chosenLang) {
                    b.click();
                }
            });
        });
    });

    // Appliquer au formulaire de contact
    if (btnApplySim) {
        btnApplySim.addEventListener('click', function () {
            const serviceSelect = document.getElementById('contact-service');
            const levelInput = document.getElementById('contact-level');
            const messageInput = document.getElementById('contact-message');

            if (serviceSelect) {
                serviceSelect.value = 'Formation en ' + currentSim.lang;
            }
            if (levelInput) {
                levelInput.value = currentSim.level + ' - Objectif: ' + currentSim.goal;
            }
            if (messageInput) {
                messageInput.value = "Bonjour Dieume, je suis intéressé par la formation en " + currentSim.lang + 
                    " (" + currentSim.level + "). Mon objectif prioritaire est : " + currentSim.goal + 
                    " avec un rythme " + currentSim.pace + ". Merci de me contacter pour planifier le test initial.";
            }
        });
    }

    // -------------------- 8. FILTRES SERVICES IT --------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            serviceCards.forEach(function (card) {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------- 9. FILTRES PROJETS --------------------
    const projFilterBtns = document.querySelectorAll('.proj-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    projFilterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            projFilterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const pfilter = btn.getAttribute('data-pfilter');

            projectCards.forEach(function (card) {
                const pcat = card.getAttribute('data-pcat');
                if (pfilter === 'all' || pcat === pfilter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------- 10. MODAL DÉTAILS PROJETS --------------------
    const projectDetailsDB = {
        '1': {
            title: "Interconnexion Sécurisée Multi-Sites d'Entreprise",
            client: "Entreprise Commerciale & Logistique (Goma - Butembo - Bukavu)",
            category: "Architecture Réseau & VPN",
            challenge: "Connecter de manière permanente et chiffrée trois succursales séparées géographiquement, tout en garantissant un basculement automatique sur liaison 4G de secours en cas de rupture de fibre.",
            solution: "Déploiement de routeurs Mikrotik CCR et commutateurs Cisco. Configuration de tunnels VPN IPsec chiffrés en AES-256 avec routage dynamique BGP, failover automatique en moins de 3 secondes et priorisation de flux voix (VoIP).",
            results: "Disponibilité du réseau mesurée à 99.95% sur 12 mois, zéro interruption des transactions d'entreprise et sécurisation totale des données financières.",
            technologies: ["Cisco IOS", "Mikrotik RouterOS", "VPN IPsec", "BGP", "QoS VoIP", "VLANs"]
        },
        '2': {
            title: "Bootcamp 'English for Tech' pour 30 Développeurs",
            client: "Hub Technologique & Développeurs Indépendants",
            category: "Formation Professionnelle en Anglais",
            challenge: "Permettre à des développeurs francophones talentueux de décrocher des contrats à l'international en brisant le blocage linguistique lors des entretiens techniques et réunions Scrum.",
            solution: "Cursus intensif de 10 semaines comprenant 30 heures de direct : vocabulaire d'architecture logicielle, simulations d'entretiens techniques chronométrées, revues de code en anglais et entraînements à la prononciation.",
            results: "100% des participants ont validé leur évaluation finale. 14 développeurs ont décroché un contrat ou une mission freelance internationale dans les 3 mois suivant le bootcamp.",
            technologies: ["Anglais Technique", "Live Coaching", "Tech Mock Interviews", "Agile English", "Attestations délivrées"]
        },
        '3': {
            title: "Audit & Durcissement Sécurité d'une Infrastructure PME",
            client: "Établissement Financier & Éducatif",
            category: "Cybersécurité & Pare-feu",
            challenge: "Identifier les vulnérabilités réseau après des tentatives d'intrusion et sécuriser les serveurs internes contenant des données clients critiques.",
            solution: "Audit complet avec scans Nmap et Nessus. Remplacement des anciens routeurs par un cluster pare-feu pfSense avec filtrage applicatif, système de détection d'intrusions (Suricata), blocage IP par géolocalisation et mise en place d'un VPN Wireguard pour les télétravailleurs.",
            results: "Blocage de plus de 4 500 tentatives de scans malveillants par mois, élimination totale des failles critiques et formation de 45 collaborateurs aux réflexes anti-phishing.",
            technologies: ["pfSense", "Suricata IDS/IPS", "Wireguard", "Audit Nmap", "Hardening Linux"]
        },
        '4': {
            title: "Plateforme Web Responsive & Optimisation SEO",
            client: "Agence de Conseil & Services",
            category: "Développement Web Moderne",
            challenge: "Créer un site vitrine ultra-performant, élégant et mobile-first, capable de convertir les visiteurs en prospects qualifiés.",
            solution: "Développement sur-mesure en HTML5 sémantique, CSS3 moderne avec CSS Variables (mode sombre/clair automatique), JavaScript optimisé sans dépendance superflue et intégration d'un formulaire intelligent relié à WhatsApp.",
            results: "Temps de chargement inférieur à 0.8 seconde, score Lighthouse de 99/100 et augmentation de 65% des demandes de contact dès le premier mois.",
            technologies: ["HTML5", "CSS3 / Modern Glassmorphism", "Vanilla JavaScript ES6+", "SEO Schema.org", "WhatsApp API"]
        },
        '5': {
            title: "Programme 'Español de los Negocios' pour Négociateurs",
            client: "Société d'Import-Export et Négoce International",
            category: "Formation Professionnelle en Espagnol",
            challenge: "Doter une équipe commerciale des compétences linguistiques requises pour négocier des contrats d'approvisionnement directement avec des fournisseurs hispanophones.",
            solution: "Programme sur-mesure de 8 semaines axé sur l'espagnol commercial : termes d'incoterms, négociation des remises, devis, correspondances formelles et simulations de négociation vidéo.",
            results: "Autonomie complète de l'équipe sans recours à des traducteurs externes, réduction des délais de négociation de 40% et signature de 2 nouveaux contrats majeurs en Espagne.",
            technologies: ["Español de los Negocios", "Négociation Commerciale", "Jeux de rôles immersifs", "Documents types fournis"]
        },
        '6': {
            title: "Sauvegarde Automatisée des Équipements Réseau",
            client: "Opérateur Télécom & Fournisseur d'Accès",
            category: "Automatisation Réseau & Python",
            challenge: "Automatiser l'extraction et l'archivage quotidien des configurations de 25 commutateurs et routeurs sans intervention humaine.",
            solution: "Développement d'un script Python utilisant les librairies Netmiko et Paramiko. Exécution programmée chaque nuit via Cron, chiffrement GPG des sauvegardes, archivage sur serveur distant et notification quotidienne sur canal Telegram sécurisé.",
            results: "Zéro perte de configuration en cas de panne matérielle, restauration d'un commutateur en moins de 10 minutes contre 2 heures auparavant.",
            technologies: ["Python 3", "Netmiko", "SSH / GPG Encryption", "Cron Jobs", "Telegram Bot API"]
        }
    };

    const projectModal = document.getElementById('project-modal');
    const projectModalBody = document.getElementById('project-modal-body');
    const projectModalBtns = document.querySelectorAll('.btn-project-modal');
    const closeProjectBtn = document.querySelector('.close-project');

    projectModalBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const projId = btn.getAttribute('data-proj');
            const data = projectDetailsDB[projId];

            if (data && projectModal && projectModalBody) {
                let tagsHtml = '';
                data.technologies.forEach(function (t) {
                    tagsHtml += '<span class="project-tag-pill">' + t + '</span>';
                });

                projectModalBody.innerHTML = `
                    <div class="modal-proj-header">
                        <span class="section-tag">${data.category}</span>
                        <h2>${data.title}</h2>
                        <p class="modal-proj-client"><strong>Client / Contexte :</strong> ${data.client}</p>
                    </div>
                    <div class="modal-proj-body">
                        <div class="modal-proj-section">
                            <h4>🎯 Défi & Objectif :</h4>
                            <p>${data.challenge}</p>
                        </div>
                        <div class="modal-proj-section">
                            <h4>⚙️ Solution Apportée :</h4>
                            <p>${data.solution}</p>
                        </div>
                        <div class="modal-proj-section">
                            <h4>📈 Résultats Mesurés :</h4>
                            <p>${data.results}</p>
                        </div>
                        <div class="modal-proj-section">
                            <h4>🛠️ Technologies & Compétences Mises en Œuvre :</h4>
                            <div class="modal-tags-list">${tagsHtml}</div>
                        </div>
                    </div>
                    <div class="modal-proj-footer">
                        <a href="#contact" class="btn btn-primary w-100 modal-cta-btn">Discuter d'un Projet Similaire</a>
                    </div>
                `;

                const modalCta = projectModalBody.querySelector('.modal-cta-btn');
                if (modalCta) {
                    modalCta.addEventListener('click', function () {
                        closeModal(projectModal);
                    });
                }

                openModal(projectModal);
            }
        });
    });

    if (closeProjectBtn && projectModal) {
        closeProjectBtn.addEventListener('click', function () {
            closeModal(projectModal);
        });
    }

    // -------------------- 11. MODAL PHOTO ZOOM --------------------
    const profilePhoto = document.getElementById('profile-photo');
    const teamCeoPhoto = document.getElementById('team-ceo-photo');
    const photoModal = document.getElementById('photo-modal');
    const closePhotoBtn = document.querySelector('.close-photo');

    if (profilePhoto && photoModal) {
        profilePhoto.addEventListener('click', function () {
            openModal(photoModal);
        });
    }

    if (teamCeoPhoto && photoModal) {
        teamCeoPhoto.addEventListener('click', function () {
            openModal(photoModal);
        });
    }

    if (closePhotoBtn && photoModal) {
        closePhotoBtn.addEventListener('click', function () {
            closeModal(photoModal);
        });
    }

    // Fonctions d'ouverture / fermeture génériques des modals
    function openModal(m) {
        if (!m) return;
        m.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(m) {
        if (!m) return;
        m.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Fermeture des modals au clic sur le fond ou avec Échap
    [photoModal, projectModal].forEach(function (m) {
        if (!m) return;
        m.addEventListener('click', function (e) {
            if (e.target === m) {
                closeModal(m);
            }
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (photoModal && photoModal.classList.contains('show')) closeModal(photoModal);
            if (projectModal && projectModal.classList.contains('show')) closeModal(projectModal);
            if (mobileMenu && mobileMenu.classList.contains('open')) toggleMobileMenu();
        }
    });

    // -------------------- 12. SÉLECTION DEPUIS LES TARIFS --------------------
    const selectTarifBtns = document.querySelectorAll('.btn-select-tarif');
    selectTarifBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const formula = btn.getAttribute('data-formula');
            const serviceSelect = document.getElementById('contact-service');
            const messageInput = document.getElementById('contact-message');

            if (serviceSelect) {
                if (formula.includes('Langue')) {
                    serviceSelect.value = 'Formation en Anglais';
                } else if (formula.includes('Audit')) {
                    serviceSelect.value = 'Cybersécurité & Audit de Système';
                } else if (formula.includes('Web')) {
                    serviceSelect.value = 'Création de Site Web Moderne';
                }
            }

            if (messageInput) {
                messageInput.value = "Bonjour Dieume, je souhaite souscrire ou obtenir un devis pour la formule : " + formula + ". Merci de me recontacter.";
            }
        });
    });

    // -------------------- 13. FAQ ACCORDION --------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', function () {
                const isActive = item.classList.contains('active');

                // Fermer les autres questions
                faqItems.forEach(function (other) {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherBtn = other.querySelector('.faq-question');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                if (isActive) {
                    item.classList.remove('active');
                    questionBtn.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // -------------------- 14. FORMULAIRE DE CONTACT & DISPATCH WHATSAPP --------------------
    const contactForm = document.getElementById('portfolio-contact-form');
    const formAlert = document.getElementById('form-alert');
    const btnDirectWhatsApp = document.getElementById('btn-direct-whatsapp-send');
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');

    function showToast(message) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(function () {
            toast.classList.remove('show');
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const service = document.getElementById('contact-service').value;
            const level = document.getElementById('contact-level').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !phone || !service || !message) {
                if (formAlert) {
                    formAlert.className = 'form-feedback error';
                    formAlert.textContent = 'Veuillez remplir tous les champs obligatoires (*).';
                    formAlert.style.display = 'block';
                }
                return;
            }

            // Validation email basique
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (formAlert) {
                    formAlert.className = 'form-feedback error';
                    formAlert.textContent = 'Veuillez saisir une adresse email valide.';
                    formAlert.style.display = 'block';
                }
                return;
            }

            // Bouton état d'envoi
            const submitBtn = document.getElementById('btn-submit-form');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Traitement en cours...</span>';
            }

            setTimeout(function () {
                if (formAlert) {
                    formAlert.className = 'form-feedback success';
                    formAlert.innerHTML = `
                        <strong>Merci ${name} !</strong> Votre demande pour <em>${service}</em> a bien été transmise à la direction de <strong>NZULO Tech</strong>. 
                        Le cabinet de <strong>Dieume MIRIMO (CEO)</strong> vous recontactera sous 24h par email (${email}) ou WhatsApp (${phone}).
                    `;
                    formAlert.style.display = 'block';
                }

                showToast('Votre message a été transmis avec succès à NZULO Tech !');

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Message Envoyé ✓</span>';
                    setTimeout(function () {
                        submitBtn.innerHTML = `<span>Envoyer au Cabinet NZULO Tech</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
                    }, 3500);
                }

                contactForm.reset();
            }, 800);
        });
    }

    // Bouton pour envoyer directement le contenu du formulaire sur WhatsApp
    if (btnDirectWhatsApp) {
        btnDirectWhatsApp.addEventListener('click', function () {
            const name = document.getElementById('contact-name').value.trim() || 'Partenaire NZULO Tech';
            const service = document.getElementById('contact-service').value || 'Formation ou Solution IT';
            const level = document.getElementById('contact-level').value.trim() || 'Non spécifié';
            const msg = document.getElementById('contact-message').value.trim() || 'Bonjour Dieume MIRIMO, je souhaite contacter la direction de NZULO Tech pour vos services.';

            const fullText = encodeURIComponent(
                "Bonjour Dieume MIRIMO (CEO - NZULO Tech),\n" +
                "Nom / Entreprise : " + name + "\n" +
                "Pôle ou Service souhaité : " + service + "\n" +
                "Niveau / Envergure : " + level + "\n" +
                "Message : " + msg
            );

            window.open('https://wa.me/243847988507?text=' + fullText, '_blank');
        });
    }

    // Gestion lien email intelligent (Gmail Web sur Desktop ou mailto)
    const emailLink = document.getElementById('link-email');
    if (emailLink) {
        emailLink.addEventListener('click', function (e) {
            e.preventDefault();
            const recipient = 'barakamirimo@gmail.com';
            const subject = encodeURIComponent('Contact officiel NZULO Tech - À l\'attention de Dieume MIRIMO (CEO)');
            const body = encodeURIComponent('Bonjour Monsieur Dieume MIRIMO,\n\nJe souhaite échanger avec vous et l\'équipe de NZULO Tech à propos de vos solutions IT et des formations de la NZULO Language Academy.\n\nCordialement,');

            const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
            if (isMobile) {
                window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
            } else {
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;
                window.open(gmailUrl, '_blank');
            }
        });
    }

    console.log("NZULO Tech (CONNECT • INNOVATE • EMPOWER) - Plateforme officielle initialisée. CEO : Dieume MIRIMO.");

})();

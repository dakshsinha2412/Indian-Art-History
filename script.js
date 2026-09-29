// Indian Art Through the Ages - Interactive Script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Timeline Progress Line Scroll Animation
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineSection = document.getElementById('timeline');

    function updateTimelineProgress() {
        if (!timelineSection || !timelineProgress) return;

        const rect = timelineSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate scroll percentage through the section
        const totalHeight = rect.height;
        const currentScroll = windowHeight / 2 - rect.top;

        let progressPercent = (currentScroll / totalHeight) * 100;
        progressPercent = Math.max(0, Math.min(100, progressPercent));

        timelineProgress.style.height = `${progressPercent}%`;
    }

    window.addEventListener('scroll', updateTimelineProgress);
    updateTimelineProgress();

    // 2. Active Nav Link Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // 3. Smooth scroll offset handling for quick nav chips
    const quickChips = document.querySelectorAll('.quick-chip');
    quickChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = chip.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Dynamic Interactive Map (Google Maps Style using Leaflet)
    const mapElement = document.getElementById('leafletMap');
    if (mapElement && typeof L !== 'undefined') {
        // Define strict Geographic Bounding Box for India [SouthWest, NorthEast]
        const indiaBounds = L.latLngBounds(
            L.latLng(6.0, 68.0),   // South-West coordinate (Kanyakumari / Arabian Sea)
            L.latLng(37.5, 97.5)   // North-East coordinate (Kashmir / Arunachal Pradesh)
        );

        // Initialize map centered over India restricted strictly to India bounds
        const map = L.map('leafletMap', {
            center: [22.0, 79.0],
            zoom: 5,
            minZoom: 4,
            maxZoom: 9,
            maxBounds: indiaBounds,
            maxBoundsViscosity: 1.0,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Standard OpenStreetMap Tile Layer (no API key required)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Historical Regions Coordinates & Metadata
        const leafletRegionData = {
            mauryan: {
                coords: [25.3, 83.0],
                badge: "c. 250 BCE",
                title: "Mauryan Realm",
                center: "Sarnath & Chunar (Uttar Pradesh / Bihar)",
                artform: "Polished Sandstone Sculptures & Monumental Pillars",
                desc: "Under Emperor Ashoka, royal stone carving reached grand heights at Sarnath and Chunar, creating polished pillars and the iconic Lion Capital with the Ashoka Chakra.",
                link: "#mauryan"
            },
            gupta: {
                coords: [27.5, 77.7],
                badge: "c. 5th Century CE",
                title: "Gupta Empire Center",
                center: "Mathura, Sarnath & Ujjain",
                artform: "Classical Sandstone Statuary & Idealized Human Proportions",
                desc: "Known as the Golden Age of Indian Art, masters in Sarnath and Mathura established serene Buddha statues with delicate drapery and spiritual grace.",
                link: "#gupta"
            },
            medieval: {
                coords: [10.78, 79.13],
                badge: "c. 10th–11th Century CE",
                title: "Chola Kingdom (South India)",
                center: "Thanjavur & Gangaikonda Cholapuram (Tamil Nadu)",
                artform: "South Indian Lost-Wax Bronzes & Temple Architecture",
                desc: "The Chola artisans reached unprecedented heights in dynamic bronze casting, creating cosmic icons like Shiva Nataraja encircled by halos of divine flames.",
                link: "#medieval"
            },
            mughal: {
                coords: [27.18, 78.0],
                badge: "c. 16th–17th Century CE",
                title: "Mughal Imperial Courts",
                center: "Agra, Delhi & Fatehpur Sikri",
                artform: "Court Miniature Painting, Jewel Colors & Calligraphy",
                desc: "Royal imperial ateliers blended Persian refinement with Indian vibrant colors, producing detailed manuscripts, royal portraits, and naturalistic flora & fauna paintings.",
                link: "#mughal"
            },
            colonial: {
                coords: [8.52, 76.93],
                badge: "c. 19th–20th Century CE",
                title: "Travancore & Colonial Art Hubs",
                center: "Travancore (Kerala) & Bombay/Calcutta",
                artform: "Oil Paintings on Canvas & Lithographic Oleographs",
                desc: "Raja Ravi Varma bridged Indian classical mythology and Western realism using oil paint techniques, distributing affordable lithographs across the nation.",
                link: "#colonial"
            },
            modern: {
                coords: [22.57, 88.36],
                badge: "c. 20th Century CE",
                title: "Bengal School & Modern Art Hubs",
                center: "Shantiniketan, Kolkata & Mumbai",
                artform: "Modern Expressionism, Cubism & Progressive Art",
                desc: "Modern masters like M. F. Husain and the Progressive Artists' Group broke away from traditional norms, creating energetic cubist strokes and vibrant modern imagery.",
                link: "#modern"
            }
        };

        const badgeElem = document.getElementById('mapRegionBadge');
        const titleElem = document.getElementById('mapRegionTitle');
        const centerElem = document.getElementById('mapRegionCenter');
        const artformElem = document.getElementById('mapRegionArtform');
        const descElem = document.getElementById('mapRegionDesc');
        const jumpBtnElem = document.getElementById('mapJumpBtn');

        function updateCard(data) {
            if (!data) return;
            if (badgeElem) badgeElem.textContent = data.badge;
            if (titleElem) titleElem.textContent = data.title;
            if (centerElem) centerElem.textContent = data.center;
            if (artformElem) artformElem.textContent = data.artform;
            if (descElem) descElem.textContent = data.desc;
            if (jumpBtnElem) jumpBtnElem.setAttribute('href', data.link);
        }

        // Custom Leaflet Circle Markers for Art Centers
        Object.keys(leafletRegionData).forEach(key => {
            const data = leafletRegionData[key];
            const marker = L.circleMarker(data.coords, {
                radius: 10,
                fillColor: '#D85A17',
                color: '#FFFFFF',
                weight: 3,
                opacity: 1,
                fillOpacity: 0.9
            }).addTo(map);

            // Bind Popup
            marker.bindPopup(`<b>${data.title}</b><br><small>${data.center}</small>`);

            marker.on('click', () => {
                updateCard(data);
                map.flyTo(data.coords, 6, { duration: 1.2 });
            });

            marker.on('mouseover', function () {
                this.openPopup();
                updateCard(data);
            });
        });

        if (jumpBtnElem) {
            jumpBtnElem.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = jumpBtnElem.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 90;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }
});

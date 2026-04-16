// AIDRO Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Remove Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 2000);

    // GSAP Animations
    gsap.from('.hero-content > *', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 2
    });

    gsap.from('.hero-visual', {
        opacity: 0,
        x: 50,
        rotateY: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 2.2
    });

    // Chart.js Initialization
    const ctx = document.getElementById('priorityChart').getContext('2d');
    const priorityChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Urgency', 'Population', 'Severity', 'Infrastructure', 'Risk Level'],
            datasets: [{
                label: 'Global Impact Analysis',
                data: [85, 92, 78, 65, 88],
                backgroundColor: 'rgba(0, 210, 255, 0.2)',
                borderColor: 'rgba(0, 210, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(0, 210, 255, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: '#94a3b8' },
                    ticks: { display: false }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Simulated Incident Feed
    const incidentData = [
        { area: 'Region Alpha', type: 'Flood', severity: 'High', score: 92, time: '2m ago' },
        { area: 'Sector 7G', type: 'Earthquake', severity: 'Medium', score: 74, time: '5m ago' },
        { area: 'Coastline B', type: 'Tornado', severity: 'Critical', score: 98, time: '30s ago' },
        { area: 'City Center', type: 'Fire', severity: 'Medium', score: 68, time: '12m ago' },
        { area: 'Industrial Zone', type: 'Gas Leak', severity: 'Low', score: 45, time: '1h ago' }
    ];

    const incidentFeed = document.getElementById('incident-feed');

    function renderIncidents() {
        incidentFeed.innerHTML = incidentData.map(inc => `
            <div class="incident-item ${inc.severity.toLowerCase()}">
                <div class="item-meta">
                    <span>${inc.type} - ${inc.area}</span>
                    <span>${inc.time}</span>
                </div>
                <div class="item-body" style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>Alert: ${inc.severity} Severity</strong>
                    <span class="item-score">AI Score: ${inc.score}</span>
                </div>
            </div>
        `).join('');
    }

    renderIncidents();

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update Active Nav Link on Scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 120) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // Dynamic AI Scoring Loop (Visual effect)
    setInterval(() => {
        const idx = Math.floor(Math.random() * incidentData.length);
        const change = (Math.random() - 0.5) * 2;
        incidentData[idx].score = Math.min(100, Math.max(0, Math.round(incidentData[idx].score + change)));
        renderIncidents();
        
        // Update radar chart randomly
        priorityChart.data.datasets[0].data = priorityChart.data.datasets[0].data.map(val => 
            Math.min(100, Math.max(50, val + (Math.random() - 0.5) * 5))
        );
        priorityChart.update('none');
    }, 3000);
});

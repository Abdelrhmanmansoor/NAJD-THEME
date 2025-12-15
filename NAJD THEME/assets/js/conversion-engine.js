/**
 * Najd Conversion Control Engine
 * Handles high-value interactions: CTAs, Scarcity, Exit Intent.
 */

export class ConversionEngine {
    constructor() {
        this.initCTAEngine();
        this.initExitIntent();
        this.initScarcityLogic();
    }

    /**
     * ADAPTIVE CTA SYSTEM
     * Manages CTA states (idle, hover, pressed, loading) and animations.
     */
    initCTAEngine() {
        const ctas = document.querySelectorAll('.cta-button');
        ctas.forEach(cta => {
            cta.addEventListener('mouseenter', () => this.setCTAState(cta, 'aroused'));
            cta.addEventListener('mouseleave', () => this.setCTAState(cta, 'idle'));
            cta.addEventListener('click', (e) => this.handleCTAClick(e, cta));
        });
    }

    setCTAState(element, state) {
        element.setAttribute('data-state', state);
        // Add specific classes or animation triggers here
    }

    handleCTAClick(e, cta) {
        // e.preventDefault(); // If we want to intercept for AJAX
        this.setCTAState(cta, 'loading');

        // Simulating feedback loop
        setTimeout(() => {
            this.setCTAState(cta, 'success');
        }, 500);
    }

    /**
     * EXIT INTENT HANDLING
     * Detects mouse leaving viewport or mobile back-button velocity.
     */
    initExitIntent() {
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0 && !sessionStorage.getItem('exit_intent_shown')) {
                this.triggerExitIntentModal();
            }
        });
    }

    triggerExitIntentModal() {
        console.log('Exit Intent Detected!');
        sessionStorage.setItem('exit_intent_shown', 'true');
        // Logic to show modal would go here
        const modal = document.getElementById('exit-intent-modal');
        if (modal) {
            modal.style.display = 'block';
            modal.classList.add('animate-pop-in');
        }
    }

    /**
     * SCARCITY VISUALIZATION
     * Manages countdowns and stock counters.
     */
    initScarcityLogic() {
        const tickers = document.querySelectorAll('.scarcity-ticker');
        tickers.forEach(ticker => {
            let stock = parseInt(ticker.dataset.stock || 10);
            const interval = setInterval(() => {
                if (stock > 2 && Math.random() > 0.7) {
                    stock--;
                    ticker.innerText = `${stock} items left`;
                    ticker.classList.add('pulse-red');
                    setTimeout(() => ticker.classList.remove('pulse-red'), 500);
                }
            }, 5000 + Math.random() * 5000); // Random decrement every 5-10s
        });

        this.initCountdowns();
        this.initProgressBars();
    }

    initCountdowns() {
        const timers = document.querySelectorAll('.countdown-component');
        timers.forEach(timer => {
            const endDate = new Date(timer.dataset.endDate).getTime();

            setInterval(() => {
                const now = new Date().getTime();
                const distance = endDate - now;

                if (distance < 0) {
                    timer.innerHTML = '<div class="expired">Exipred</div>';
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                timer.querySelector('[data-unit="days"]').innerText = String(days).padStart(2, '0');
                timer.querySelector('[data-unit="hours"]').innerText = String(hours).padStart(2, '0');
                timer.querySelector('[data-unit="minutes"]').innerText = String(minutes).padStart(2, '0');
                timer.querySelector('[data-unit="seconds"]').innerText = String(seconds).padStart(2, '0');
            }, 1000);
        });
    }

    initProgressBars() {
        const bars = document.querySelectorAll('.progress-indicator[data-scroll-spy="true"]');
        if (bars.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            bars.forEach(bar => {
                bar.querySelector('.progress-fill').style.width = scrollPercent + '%';
                const label = bar.querySelector('.percentage');
                if (label) label.innerText = Math.round(scrollPercent) + '%';
            });
        });
    }
}

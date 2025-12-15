/**
 * Najd Campaign Theme - Main Application
 * 
 * Entry point for the Campaign OS.
 */

import { ConversionEngine } from './conversion-engine.js';
import { PerformanceManager } from './performance.js';

class NajdCampaignOS {
    constructor() {
        this.config = window.NajdConfig || {};
        this.conversionEngine = new ConversionEngine();
        this.performanceManager = new PerformanceManager();
        this.init();
    }

    init() {
        console.log('Najd Campaign OS: Initializing...');
        this.detectTrafficSource();
        this.checkCampaignExpiry();
        this.applyCampaignLogic();
    }

    /**
     * CAMPAIGN INTELLIGENCE: Expiry Handling
     * Checks if the current campaign has expired and redirects/masks content.
     */
    checkCampaignExpiry() {
        const expiryDate = this.config.expiryDate; // Injected via window.NajdConfig
        if (expiryDate && new Date() > new Date(expiryDate)) {
            console.warn('Campaign Expired!');
            document.body.classList.add('campaign-expired');
            // Logic to redirect or show "Offer Expired" overlay
            this.showExpiryOverlay();
        }
    }

    showExpiryOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'expiry-overlay';
        overlay.innerHTML = '<div class="msg"><h1>Campaign Ended</h1><p>This offer is no longer available.</p><a href="/" class="btn">Return to Store</a></div>';
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
    }

    /**
     * CAMPAIGN INTELLIGENCE: Conversion Priority Sorting
     * (Optional) Reorders DOM elements based on conversion weight if enabled.
     */
    enforceConversionPriority() {
        const container = document.querySelector('.campaign-content');
        if (!container) return;

        const sections = Array.from(container.children);
        sections.sort((a, b) => {
            const weightA = parseInt(a.dataset.priority || 0);
            const weightB = parseInt(b.dataset.priority || 0);
            return weightB - weightA; // Descending order
        });

        sections.forEach(section => container.appendChild(section));
    }

    /**
     * CAMPAIGN INTELLIGENCE: Traffic Source Detection
     * Captures UTM params and Referrer to determine visitor intent.
     */
    detectTrafficSource() {
        const urlParams = new URLSearchParams(window.location.search);
        const source = {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
            referrer: document.referrer
        };

        if (source.utm_source || source.utm_campaign) {
            console.log('Campaign Traffic Detected:', source);
            sessionStorage.setItem('najd_campaign_source', JSON.stringify(source));
            document.body.classList.add('traffic-campaign');
        }
    }

    applyCampaignLogic() {
        // Apply sticky campaign state if previously detected
        if (sessionStorage.getItem('najd_campaign_source')) {
            document.body.classList.add('traffic-campaign');
        }

        // Behavioral: Scroll-aware UI changes
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        if (window.scrollY > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    }

    /**
     * CAMPAIGN INTELLIGENCE: Time-Based Messaging
     * Adapts UI messaging based on user's local time.
     */
    initTimeBasedMessaging() {
        const hour = new Date().getHours();
        let timeContext = 'day';
        if (hour < 12) timeContext = 'morning';
        else if (hour < 18) timeContext = 'afternoon';
        else timeContext = 'evening';

        document.body.setAttribute('data-time-context', timeContext);
        console.log(`Time Context: ${timeContext}`);
    }

    /**
     * CAMPAIGN INTELLIGENCE: Decision Moment Detection
     * Detects when user dwells on potential "Decision Zones" (Price, CTA).
     */
    initDecisionDetection() {
        const decisionZones = document.querySelectorAll('.decision-zone');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startDwellTimer(entry.target);
                } else {
                    this.clearDwellTimer(entry.target);
                }
            });
        }, { threshold: 0.8 });

        decisionZones.forEach(zone => observer.observe(zone));
    }

    startDwellTimer(target) {
        target.dwellTimer = setTimeout(() => {
            console.log('Decision Moment Detected!', target);
            this.triggerDecisionIntervention(target);
        }, 3000); // 3 seconds dwell time
    }

    clearDwellTimer(target) {
        if (target.dwellTimer) clearTimeout(target.dwellTimer);
    }

    triggerDecisionIntervention(target) {
        target.classList.add('highlight-decision');
        // Could trigger a popup or subtle animation here
    }

    registerComponents() {
        this.initTimeBasedMessaging();
        this.initDecisionDetection();
        // Will load dynamic components here
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.NajdOS = new NajdCampaignOS();
});

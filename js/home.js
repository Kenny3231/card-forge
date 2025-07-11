// Card Forge - Page d'accueil
document.addEventListener('DOMContentLoaded', function() {
    initializeHomePage();
});

function initializeHomePage() {
    console.log('🔧 Card Forge - Page d\'accueil initialisée');
    
    // Animation des cartes au scroll
    setupScrollAnimations();
    
    // Gestion des clics sur les cartes désactivées
    setupDisabledCards();
    
    // Ajout d'effets visuels
    setupVisualEffects();
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer toutes les cartes
    document.querySelectorAll('.generator-card, .info-card').forEach(card => {
        observer.observe(card);
    });
}

function setupDisabledCards() {
    document.querySelectorAll('.generator-card.coming-soon').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Effet de secousse
            card.style.animation = 'shake 0.5s ease-in-out';
            
            // Notification
            showNotification('Cette fonctionnalité arrive bientôt ! 🚧', 'info');
            
            // Reset animation
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        });
    });
}

function setupVisualEffects() {
    // Effet de particules sur le header
    createParticleEffect();
    
    // Effet de hover sur les cartes disponibles
    document.querySelectorAll('.generator-card.available').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 25px 50px rgba(37, 99, 235, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

function createParticleEffect() {
    const header = document.querySelector('.header');
    
    // Créer des particules flottantes
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticle(header);
        }, i * 200);
    }
    
    // Répéter l'effet toutes les 10 secondes
    setInterval(() => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createParticle(header);
            }, i * 400);
        }
    }, 10000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: linear-gradient(45deg, #2563eb, #f59e0b);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.7;
        left: ${Math.random() * 100}%;
        top: 100%;
        z-index: -1;
    `;
    
    container.appendChild(particle);
    
    // Animation de la particule
    const animation = particle.animate([
        {
            transform: 'translateY(0) scale(1)',
            opacity: 0.7
        },
        {
            transform: `translateY(-200px) translateX(${(Math.random() - 0.5) * 100}px) scale(0)`,
            opacity: 0
        }
    ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => {
        particle.remove();
    };
}

function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        background: colors[type] || colors.info,
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    });
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Gestion des statistiques (optionnel)
function trackGeneratorUsage(generatorName) {
    console.log(`📊 Générateur utilisé: ${generatorName}`);
    // Ici vous pourriez ajouter Google Analytics ou autre
}

// Animation de secousse pour les cartes désactivées
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Injecter le CSS de l'animation
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur dans Card Forge:', e.error);
});

console.log('🏠 Card Forge v1.0.0 - Prêt à forger des cartes !');

// Variables globales
let generatedCode = '';
let currentIconInput = null;

// Template YAML (à modifier selon vos besoins)
const yamlTemplate = `type: custom:bubble-card
card_type: button
entity: switch.stack_{{stackNumber}}_state
name: {{serviceName}}
icon: {{mainIcon}}
show_icon: {{showIcon}}
force_icon: {{forceIcon}}
show_state: {{showState}}
sub_button:
  - entity: button.stack_{{stackNumber}}_update
    show_background: {{showBackground}}
    state_background: {{stateBackground}}
    show_icon: true
    icon: {{updateIcon}}
    show_state: false
    visibility:
      - condition: state
        entity: sensor.stack_{{stackNumber}}_state_update
        state: outdated
    show_name: false
    show_attribute: false
    tap_action:
      action: perform-action
      perform_action: button.press
      target:
        entity_id:
          - button.stack_{{stackNumber}}_update
card_layout: large
grid_options:
  columns: {{gridColumns}}
  rows: {{gridRows}}
tap_action:
  action: toggle
button_action:
  tap_action:
    action: toggle`;

// Icônes populaires pour Portainer et services Docker
const popularIcons = [
    // Services populaires
    { name: 'docker', icon: '🐳', mdi: 'mdi:docker' },
    { name: 'portainer', icon: '📦', mdi: 'mdi:package-variant-closed' },
    { name: 'nginx', icon: '🌐', mdi: 'mdi:web' },
    { name: 'jellyfin', icon: '🎬', mdi: 'mdi:filmstrip' },
    { name: 'plex', icon: '📺', mdi: 'mdi:plex' },
    { name: 'homeassistant', icon: '🏠', mdi: 'mdi:home-assistant' },
    { name: 'nextcloud', icon: '☁️', mdi: 'mdi:cloud' },
    { name: 'gitea', icon: '🔧', mdi: 'mdi:git' },
    { name: 'grafana', icon: '📊', mdi: 'mdi:chart-line' },
    { name: 'influxdb', icon: '📈', mdi: 'mdi:database' },
    { name: 'postgres', icon: '🐘', mdi: 'mdi:database-outline' },
    { name: 'redis', icon: '🔴', mdi: 'mdi:database-marker' },
    { name: 'mongodb', icon: '🍃', mdi: 'mdi:leaf' },
    { name: 'traefik', icon: '🔀', mdi: 'mdi:router-network' },
    { name: 'gotify', icon: '🔔', mdi: 'mdi:bell-outline' },
    { name: 'uptime', icon: '⏰', mdi: 'mdi:clock-outline' },
    { name: 'bitwarden', icon: '🔐', mdi: 'mdi:shield-lock' },
    { name: 'pihole', icon: '🛡️', mdi: 'mdi:shield-outline' },
    { name: 'wireguard', icon: '🔒', mdi: 'mdi:vpn' },
    { name: 'openvpn', icon: '🔑', mdi: 'mdi:key-variant' },
    // Actions et états
    { name: 'update', icon: '🔄', mdi: 'mdi:update' },
    { name: 'restart', icon: '↻', mdi: 'mdi:restart' },
    { name: 'power', icon: '⚡', mdi: 'mdi:power' },
    { name: 'toggle', icon: '🔘', mdi: 'mdi:toggle-switch' },
    { name: 'play', icon: '▶️', mdi: 'mdi:play' },
    { name: 'stop', icon: '⏹️', mdi: 'mdi:stop' },
    { name: 'pause', icon: '⏸️', mdi: 'mdi:pause' },
    { name: 'refresh', icon: '🔃', mdi: 'mdi:refresh' },
    { name: 'settings', icon: '⚙️', mdi: 'mdi:cog' },
    { name: 'info', icon: 'ℹ️', mdi: 'mdi:information-outline' },
    { name: 'warning', icon: '⚠️', mdi: 'mdi:alert-outline' },
    { name: 'error', icon: '❌', mdi: 'mdi:close-circle-outline' },
    { name: 'success', icon: '✅', mdi: 'mdi:check-circle-outline' },
    // Réseaux et connexions
    { name: 'network', icon: '🌐', mdi: 'mdi:network' },
    { name: 'wifi', icon: '📶', mdi: 'mdi:wifi' },
    { name: 'ethernet', icon: '🔌', mdi: 'mdi:ethernet' },
    { name: 'server', icon: '🖥️', mdi: 'mdi:server' },
    { name: 'cloud', icon: '☁️', mdi: 'mdi:cloud-outline' },
    // Monitoring
    { name: 'cpu', icon: '🧠', mdi: 'mdi:chip' },
    { name: 'memory', icon: '💾', mdi: 'mdi:memory' },
    { name: 'storage', icon: '💿', mdi: 'mdi:harddisk' },
    { name: 'temperature', icon: '🌡️', mdi: 'mdi:thermometer' },
    { name: 'fan', icon: '🌀', mdi: 'mdi:fan' }
];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🔧 Card Forge initialisé - Générateur Bubble Card pour Portainer');
    
    // Initialiser la modal d'icônes
    initializeIconPicker();
    
    // Écouter les changements en temps réel
    setupEventListeners();
    
    // Génération initiale
    generateCard();
}

function setupEventListeners() {
    // Écouter les changements sur tous les inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', generateCard);
        input.addEventListener('change', generateCard);
    });
    
    // Boutons de sélection d'icônes
    const iconButtons = document.querySelectorAll('.icon-picker-btn');
    iconButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            openIconPicker(target);
        });
    });
    
    // Bouton de copie
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCode);
    }
    
    // Fermeture de la modal
    const closeBtn = document.getElementById('iconModalClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeIconPicker);
    }
    
    // Recherche d'icônes
    const searchInput = document.getElementById('iconSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterIcons);
    }
}

function initializeIconPicker() {
    const iconGrid = document.getElementById('iconGrid');
    if (!iconGrid) return;

    // Générer la grille d'icônes
    iconGrid.innerHTML = popularIcons.map(icon => `
        <div class="icon-item" data-icon="${icon.mdi}">
            <div class="icon-preview">${icon.icon}</div>
            <div class="icon-name">${icon.name}</div>
        </div>
    `).join('');
    
    // Ajouter les event listeners aux icônes
    const iconItems = iconGrid.querySelectorAll('.icon-item');
    iconItems.forEach(item => {
        item.addEventListener('click', function() {
            const iconValue = this.getAttribute('data-icon');
            selectIcon(iconValue);
        });
    });
}

function openIconPicker(inputId) {
    currentIconInput = inputId;
    const modal = document.getElementById('iconModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeIconPicker() {
    const modal = document.getElementById('iconModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    currentIconInput = null;
}

function selectIcon(iconValue) {
    if (currentIconInput) {
        const input = document.getElementById(currentIconInput);
        if (input) {
            input.value = iconValue;
            generateCard(); // Mettre à jour en temps réel
            showNotification(`Icône ${iconValue} sélectionnée`, 'success');
        }
    }
    closeIconPicker();
}

function filterIcons() {
    const searchTerm = document.getElementById('iconSearch').value.toLowerCase();
    const iconItems = document.querySelectorAll('.icon-item');
    
    iconItems.forEach(item => {
        const iconName = item.querySelector('.icon-name').textContent.toLowerCase();
        const iconMdi = item.getAttribute('data-icon').toLowerCase();
        
        if (iconName.includes(searchTerm) || iconMdi.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function generateCard() {
    const config = {
        serviceName: getInputValue('serviceName', 'Gotify'),
        stackNumber: getInputValue('stackNumber', '240'),
        mainIcon: getInputValue('mainIcon', 'mdi:toggle-switch'),
        updateIcon: getInputValue('updateIcon', 'mdi:update'),
        gridColumns: getInputValue('gridColumns', '9'),
        gridRows: getInputValue('gridRows', '1'),
        showIcon: getCheckboxValue('showIcon'),
        forceIcon: getCheckboxValue('forceIcon'),
        showState: getCheckboxValue('showState'),
        showBackground: getCheckboxValue('showBackground'),
        stateBackground: getCheckboxValue('stateBackground')
    };

    // Générer le code YAML
    const yamlCode = generateYAMLCode(config);
    generatedCode = yamlCode;
    updateCodeOutput(yamlCode);

    // Mettre à jour l'aperçu
    updatePreview(config);
}

function generateYAMLCode(config) {
    let yaml = yamlTemplate;
    
    // Remplacer toutes les variables dans le template
    Object.keys(config).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        yaml = yaml.replace(regex, config[key]);
    });
    
    return yaml;
}

function updatePreview(config) {
    const preview = document.getElementById('cardPreview');
    if (!preview) return;

    // Trouver l'emoji correspondant à l'icône
    const iconData = popularIcons.find(icon => icon.mdi === config.mainIcon);
    const iconEmoji = iconData ? iconData.icon : '🔘';
    
    const updateIconData = popularIcons.find(icon => icon.mdi === config.updateIcon);
    const updateEmoji = updateIconData ? updateIconData.icon : '🔄';
    
    const serviceName = config.serviceName || 'Service';
    const stackNumber = config.stackNumber || '240';

    // Simuler l'état de la carte (on/off)
    const isOn = Math.random() > 0.5; // État aléatoire pour la démo
    
    // Créer l'aperçu avec le vrai style Bubble Card
    preview.innerHTML = `
        <div class="bubble-card-container ${isOn ? 'on' : 'off'}">
            <div class="bubble-main-button">
                <div class="bubble-icon" style="display: ${config.showIcon ? 'flex' : 'none'}">
                    ${iconEmoji}
                </div>
                <div class="bubble-name">
                    ${serviceName}
                </div>
                <div class="bubble-state" style="display: ${config.showState ? 'block' : 'none'}">
                    ${isOn ? 'ON' : 'OFF'}
                </div>
            </div>
            <button class="bubble-sub-button" style="display: ${config.showBackground ? 'flex' : 'none'}">
                <div class="bubble-sub-button-icon">
                    ${updateEmoji}
                </div>
            </button>
        </div>
    `;
    
    // Appliquer les variables CSS Bubble Card
    const bubbleVars = {
        '--bubble-icon-background-color': isOn ? 'rgba(var(--rgb-accent-color), 0.2)' : 'rgba(255,255,255,0.1)',
        '--bubble-icon-color': isOn ? 'var(--accent-color, #03a9f4)' : 'var(--disabled-color, #6f6f6f)',
        '--bubble-name-color': 'var(--primary-text-color, #ffffff)',
        '--bubble-state-color': 'var(--secondary-text-color, #8e8e93)',
        '--bubble-sub-button-background-color': 'rgba(var(--rgb-warning-color), 0.2)',
        '--bubble-sub-button-icon-color': 'var(--warning-color, #ff9800)',
        '--bubble-button-background-color-on': 'rgba(var(--rgb-accent-color), 0.1)',
        '--bubble-button-background-color-off': 'transparent',
        '--bubble-card-border-color': 'rgba(255,255,255,0.05)'
    };
    
    // Appliquer les variables CSS
    Object.keys(bubbleVars).forEach(key => {
        preview.style.setProperty(key, bubbleVars[key]);
    });
}

function updateCodeOutput(code) {
    const codeOutput = document.getElementById('codeOutput');
    if (codeOutput) {
        codeOutput.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word; font-family: 'Courier New', monospace; line-height: 1.4; font-size: 13px;">${code}</pre>`;
    }
}

function getInputValue(id, defaultValue = '') {
    const element = document.getElementById(id);
    return element ? element.value || defaultValue : defaultValue;
}

function getCheckboxValue(id) {
    const element = document.getElementById(id);
    return element ? element.checked : false;
}

function copyCode() {
    if (!generatedCode) {
        showNotification('Aucun code à copier', 'error');
        return;
    }

    navigator.clipboard.writeText(generatedCode)
        .then(() => {
            const copyBtn = document.getElementById('copyBtn');
            if (copyBtn) {
                copyBtn.textContent = '✅ Copié !';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = '📋 Copier le code';
                    copyBtn.classList.remove('copied');
                }, 2000);
            }
            showNotification('Code copié dans le presse-papier !', 'success');
        })
        .catch(err => {
            console.error('Erreur lors de la copie:', err);
            showNotification('Erreur lors de la copie', 'error');
        });
}

function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Créer une notification simple
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles de la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10001',
        transition: 'all 0.3s ease',
        background: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transform: 'translateX(100%)'
    });
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Gestion des clics en dehors de la modal
document.addEventListener('click', function(event) {
    const modal = document.getElementById('iconModal');
    const modalContent = document.querySelector('.icon-modal-content');
    
    if (modal && modal.classList.contains('active') && !modalContent.contains(event.target)) {
        closeIconPicker();
    }
});

// Gestion de la touche Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('iconModal');
        if (modal && modal.classList.contains('active')) {
            closeIconPicker();
        }
    }
});

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur dans l\'application:', e.error);
    showNotification('Une erreur s\'est produite', 'error');
});

console.log('🐳 Card Forge pour Portainer - Prêt à générer des cartes bubble !');

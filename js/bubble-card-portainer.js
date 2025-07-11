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

// Icônes populaires pour Portainer et services Docker avec vraies icônes Home Assistant
const popularIcons = [
    // Services populaires Docker/Home Assistant
    { name: 'docker', icon: '🐳', mdi: 'mdi:docker' },
    { name: 'portainer', icon: '📦', mdi: 'mdi:package-variant-closed' },
    { name: 'nginx', icon: '🌐', mdi: 'mdi:web' },
    { name: 'home-assistant', icon: '🏠', mdi: 'mdi:home-assistant' },
    { name: 'node-red', icon: '🔴', mdi: 'mdi:resistor-nodes' },
    { name: 'grafana', icon: '📊', mdi: 'mdi:chart-line' },
    { name: 'jellyfin', icon: '🎬', mdi: 'mdi:multimedia' },
    { name: 'plex', icon: '📺', mdi: 'mdi:plex' },
    { name: 'nextcloud', icon: '☁️', mdi: 'mdi:cloud' },
    { name: 'gitea', icon: '📂', mdi: 'mdi:git' },
    { name: 'database', icon: '🗄️', mdi: 'mdi:database' },
    { name: 'traefik', icon: '🔀', mdi: 'mdi:router-network' },
    { name: 'prometheus', icon: '📈', mdi: 'mdi:chart-timeline-variant' },
    { name: 'influxdb', icon: '💾', mdi: 'mdi:database-outline' },
    { name: 'postgres', icon: '🐘', mdi: 'mdi:elephant' },
    { name: 'redis', icon: '🔴', mdi: 'mdi:database-marker' },
    { name: 'mongodb', icon: '🍃', mdi: 'mdi:leaf' },
    
    // Actions et contrôles
    { name: 'toggle-switch', icon: '🔘', mdi: 'mdi:toggle-switch' },
    { name: 'toggle-switch-off', icon: '⚫', mdi: 'mdi:toggle-switch-off' },
    { name: 'update', icon: '🔄', mdi: 'mdi:update' },
    { name: 'restart', icon: '🔄', mdi: 'mdi:restart' },
    { name: 'refresh', icon: '🔃', mdi: 'mdi:refresh' },
    { name: 'power', icon: '⚡', mdi: 'mdi:power' },
    { name: 'power-on', icon: '🟢', mdi: 'mdi:power-on' },
    { name: 'power-off', icon: '🔴', mdi: 'mdi:power-off' },
    { name: 'play', icon: '▶️', mdi: 'mdi:play' },
    { name: 'stop', icon: '⏹️', mdi: 'mdi:stop' },
    { name: 'pause', icon: '⏸️', mdi: 'mdi:pause' },
    
    // Lumières
    { name: 'lightbulb', icon: '💡', mdi: 'mdi:lightbulb' },
    { name: 'lightbulb-on', icon: '🟡', mdi: 'mdi:lightbulb-on' },
    { name: 'lightbulb-off', icon: '⚫', mdi: 'mdi:lightbulb-off' },
    { name: 'light-switch', icon: '🔆', mdi: 'mdi:light-switch' },
    { name: 'ceiling-light', icon: '💡', mdi: 'mdi:ceiling-light' },
    { name: 'floor-lamp', icon: '🕯️', mdi: 'mdi:floor-lamp' },
    { name: 'led-strip', icon: '🌈', mdi: 'mdi:led-strip-variant' },
    { name: 'spotlight', icon: '🔦', mdi: 'mdi:spotlight-beam' },
    
    // Portes et accès
    { name: 'door', icon: '🚪', mdi: 'mdi:door' },
    { name: 'door-open', icon: '🚪', mdi: 'mdi:door-open' },
    { name: 'door-closed', icon: '🚪', mdi: 'mdi:door-closed' },
    { name: 'gate', icon: '🚧', mdi: 'mdi:gate' },
    { name: 'lock', icon: '🔒', mdi: 'mdi:lock' },
    { name: 'lock-open', icon: '🔓', mdi: 'mdi:lock-open' },
    { name: 'key', icon: '🔑', mdi: 'mdi:key' },
    
    // Boutons et contrôles
    { name: 'button', icon: '🔘', mdi: 'mdi:button-pointer' },
    { name: 'gesture-tap', icon: '👆', mdi: 'mdi:gesture-tap' },
    { name: 'remote', icon: '📱', mdi: 'mdi:remote' },
    { name: 'switch', icon: '🎛️', mdi: 'mdi:dip-switch' },
    { name: 'fader', icon: '🎚️', mdi: 'mdi:tune-vertical' },
    
    // Capteurs et monitoring
    { name: 'thermometer', icon: '🌡️', mdi: 'mdi:thermometer' },
    { name: 'humidity', icon: '💧', mdi: 'mdi:water-percent' },
    { name: 'motion-sensor', icon: '🏃', mdi: 'mdi:motion-sensor' },
    { name: 'eye', icon: '👁️', mdi: 'mdi:eye' },
    { name: 'camera', icon: '📷', mdi: 'mdi:camera' },
    { name: 'bell', icon: '🔔', mdi: 'mdi:bell' },
    { name: 'alarm', icon: '🚨', mdi: 'mdi:alarm-light' },
    
    // Réseau et connectivité
    { name: 'wifi', icon: '📶', mdi: 'mdi:wifi' },
    { name: 'wifi-off', icon: '📵', mdi: 'mdi:wifi-off' },
    { name: 'ethernet', icon: '🔌', mdi: 'mdi:ethernet' },
    { name: 'router', icon: '📡', mdi: 'mdi:router-wireless' },
    { name: 'server', icon: '🖥️', mdi: 'mdi:server' },
    { name: 'cloud', icon: '☁️', mdi: 'mdi:cloud-outline' },
    
    // Système et configuration
    { name: 'settings', icon: '⚙️', mdi: 'mdi:cog' },
    { name: 'tools', icon: '🔧', mdi: 'mdi:tools' },
    { name: 'wrench', icon: '🔧', mdi: 'mdi:wrench' },
    { name: 'information', icon: 'ℹ️', mdi: 'mdi:information-outline' },
    { name: 'warning', icon: '⚠️', mdi: 'mdi:alert-outline' },
    { name: 'error', icon: '❌', mdi: 'mdi:close-circle-outline' },
    { name: 'success', icon: '✅', mdi: 'mdi:check-circle-outline' },
    { name: 'help', icon: '❓', mdi: 'mdi:help-circle-outline' },
    
    // Hardware et composants
    { name: 'cpu', icon: '🧠', mdi: 'mdi:chip' },
    { name: 'memory', icon: '💾', mdi: 'mdi:memory' },
    { name: 'harddisk', icon: '💿', mdi: 'mdi:harddisk' },
    { name: 'fan', icon: '🌀', mdi: 'mdi:fan' },
    { name: 'battery', icon: '🔋', mdi: 'mdi:battery' },
    { name: 'battery-charging', icon: '🔌', mdi: 'mdi:battery-charging' },
    
    // Médias et divertissement
    { name: 'volume-high', icon: '🔊', mdi: 'mdi:volume-high' },
    { name: 'volume-off', icon: '🔇', mdi: 'mdi:volume-off' },
    { name: 'speaker', icon: '🔊', mdi: 'mdi:speaker' },
    { name: 'television', icon: '📺', mdi: 'mdi:television' },
    { name: 'cast', icon: '📡', mdi: 'mdi:cast' },
    
    // Sécurité
    { name: 'shield', icon: '🛡️', mdi: 'mdi:shield-outline' },
    { name: 'shield-check', icon: '✅', mdi: 'mdi:shield-check' },
    { name: 'security', icon: '🔐', mdi: 'mdi:security' },
    { name: 'fingerprint', icon: '👆', mdi: 'mdi:fingerprint' }
];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🔧 Card Forge initialisé - Générateur Bubble Card pour Portainer');
    
    // Écouter les changements en temps réel
    setupEventListeners();
    
    // Génération initiale
    generateCard();
}

function setupEventListeners() {
    // Écouter les changements sur les deux inputs restants
    const inputs = document.querySelectorAll('#serviceName, #stackNumber');
    inputs.forEach(input => {
        input.addEventListener('input', generateCard);
        input.addEventListener('change', generateCard);
    });
    
    // Bouton de copie
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCode);
    }
    
    console.log('Event listeners configurés:', {
        inputs: inputs.length,
        copyBtn: !!copyBtn
    });
}

// Supprimer toutes les fonctions liées aux icônes
// Les fonctions suivantes ont été supprimées :
// - initializeIconPicker()
// - openIconPicker()
// - closeIconPicker()
// - selectIcon()
// - filterIcons()
// - popularIcons array

function generateCard() {
    const config = {
        serviceName: getInputValue('serviceName', 'Gotify'),
        stackNumber: getInputValue('stackNumber', '240'),
        // Valeurs par défaut fixes
        mainIcon: 'mdi:toggle-switch',
        updateIcon: 'mdi:update',
        gridColumns: '9',
        gridRows: '1',
        showIcon: true,
        forceIcon: false,
        showState: false,
        showBackground: true,
        stateBackground: true
    };

    // Générer le code YAML
    const yamlCode = generateYAMLCode(config);
    generatedCode = yamlCode;
    updateCodeOutput(yamlCode);
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

// Supprimer la fonction updatePreview car on utilise maintenant l'image template
// function updatePreview() supprimée

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

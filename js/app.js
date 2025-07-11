// Variables globales
let currentTheme = 'default';
let generatedCode = '';
let currentIconInput = null;

// Configuration des thèmes
const themes = {
    default: {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%)',
        primary: '#ff6b6b'
    },
    dark: {
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        primary: '#bb86fc'
    },
    light: {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        primary: '#007bff'
    },
    midnight: {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 100%)',
        primary: '#16213e'
    },
    ios: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        primary: '#007aff'
    },
    material: {
        background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
        primary: '#ff5722'
    }
};

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
    // Génération initiale
    generateCard();
    
    // Écouter les changements en temps réel
    document.addEventListener('input', generateCard);
    document.addEventListener('change', generateCard);
    
    // Initialiser le thème par défaut
    applyTheme('default');
    
    // Initialiser la modal d'icônes
    initializeIconPicker();
    
    console.log('🔧 Card Forge initialisé - Générateur Bubble Card pour Portainer');
}

function initializeIconPicker() {
    const iconGrid = document.getElementById('iconGrid');
    if (!iconGrid) return;

    // Générer la grille d'icônes
    iconGrid.innerHTML = popularIcons.map(icon => `
        <div class="icon-item" onclick="selectIcon('${icon.mdi}')">
            <div class="icon-preview">${icon.icon}</div>
            <div class="icon-name">${icon.name}</div>
        </div>
    `).join('');
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
        }
    }
    closeIconPicker();
}

function filterIcons() {
    const searchTerm = document.getElementById('iconSearch').value.toLowerCase();
    const iconItems = document.querySelectorAll('.icon-item');
    
    iconItems.forEach(item => {
        const iconName = item.querySelector('.icon-name').textContent.toLowerCase();
        if (iconName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function generateCard() {
    const serviceName = getInputValue('serviceName', 'Gotify');
    const stackNumber = getInputValue('stackNumber', '240');
    const mainIcon = getInputValue('mainIcon', 'mdi:toggle-switch');
    const updateIcon = getInputValue('updateIcon', 'mdi:update');
    const gridColumns = getInputValue('gridColumns', '9');
    const gridRows = getInputValue('gridRows', '1');
    
    const options = {
        showIcon: getCheckboxValue('showIcon'),
        forceIcon: getCheckboxValue('forceIcon'),
        showState: getCheckboxValue('showState'),
        showBackground: getCheckboxValue('showBackground'),
        stateBackground: getCheckboxValue('stateBackground')
    };

    const config = {
        serviceName,
        stackNumber,
        mainIcon,
        updateIcon,
        gridColumns,
        gridRows,
        ...options
    };

    // Générer le code YAML
    const yamlCode = generateYAMLCode(config);
    generatedCode = yamlCode;
    updateCodeOutput(yamlCode);

    // Mettre à jour l'aperçu
    updatePreview(config);
}

function generateYAMLCode(config) {
    return `type: custom:bubble-card
card_type: button
entity: switch.stack_${config.stackNumber}_state
name: ${config.serviceName}
icon: ${config.mainIcon}
show_icon: ${config.showIcon}
force_icon: ${config.forceIcon}
show_state: ${config.showState}
sub_button:
  - entity: button.stack_${config.stackNumber}_update
    show_background: ${config.showBackground}
    state_background: ${config.stateBackground}
    show_icon: true
    icon: ${config.updateIcon}
    show_state: false
    visibility:
      - condition: state
        entity: sensor.stack_${config.stackNumber}_state_update
        state: outdated
    show_name: false
    show_attribute: false
    tap_action:
      action: perform-action
      perform_action: button.press
      target:
        entity_id:
          - button.stack_${config.stackNumber}_update
card_layout: large
grid_options:
  columns: ${config.gridColumns}
  rows: ${config.gridRows}
tap_action:
  action: toggle
button_action:
  tap_action:
    action: toggle`;
}

function updatePreview(config) {
    const preview = document.getElementById('cardPreview');
    if (!preview) return;

    // Trouver l'emoji correspondant à l'icône
    const iconData = popularIcons.find(icon => icon.mdi === config.mainIcon);
    const iconEmoji = iconData ? iconData.icon : '🔘';
    
    const serviceName = config.serviceName || 'Service';
    const stackNumber = config.stackNumber || '240';

    // Créer l'aperçu visuel de la carte
    preview.innerHTML = `
        <div class="card-content">
            <div class="card-title">
                <span style="margin-right: 8px; font-size: 1.2em;">${iconEmoji}</span>${serviceName}
            </div>
            <div class="card-description">
                Stack Portainer ${stackNumber} • ${config.showState ? 'État affiché' : 'État masqué'}
                <br>
                <small style="opacity: 0.7;">
                    ${config.showIcon ? '🎯 Icône visible' : '⚪ Icône masquée'} • 
                    ${config.showBackground ? '🎨 Arrière-plan actif' : '⬜ Arrière-plan simple'}
                </small>
            </div>
            <div class="card-meta">
                <span>📍 switch.stack_${stackNumber}_state</span>
                <span>🔄 button.stack_${stackNumber}_update</span>
            </div>
        </div>
    `;
    
    // Appliquer le style selon le thème actuel
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#ff6b6b';
    preview.style.borderLeftColor = primaryColor;
}

function updateCodeOutput(code) {
    const codeOutput = document.getElementById('codeOutput');
    if (codeOutput) {
        codeOutput.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word; font-family: 'Courier New', monospace; line-height: 1.4;">${code}</pre>`;
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

function toggleThemeSelector() {
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
        themeSelector.classList.toggle('active');
    }
}

function selectTheme(theme) {
    currentTheme = theme;
    
    // Mettre à jour la sélection visuelle
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Trouver et sélectionner le bon thème
    const selectedOption = Array.from(document.querySelectorAll('.theme-option'))
        .find(option => option.onclick.toString().includes(`'${theme}'`));
    
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Appliquer le thème
    applyTheme(theme);
    
    // Fermer le sélecteur
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
        themeSelector.classList.remove('active');
    }
    
    showNotification(`Thème "${theme}" appliqué`, 'success');
}

function applyTheme(theme) {
    const body = document.body;

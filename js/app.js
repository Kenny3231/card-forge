// Variables globales
let currentTheme = 'default';
let generatedCode = '';

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
    
    console.log('🔧 Card Forge initialisé - Générateur Bubble Card');
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

function getInputValue(id, defaultValue = '') {
    const element = document.getElementById(id);
    return element ? element.value || defaultValue : defaultValue;
}

function getCheckboxValue(id) {
    const element = document.getElementById(id);
    return element ? element.checked : false;
}

function updatePreview(config) {
    const preview = document.getElementById('cardPreview');
    if (!preview) return;

    const icon = config.mainIcon.replace('mdi:', '') || 'toggle-switch';
    const serviceName = config.serviceName || 'Service';
    const stackNumber = config.stackNumber || '240';

    // Créer l'aperçu visuel de la carte
    preview.innerHTML = `
        <div class="card-content">
            <div class="card-title">
                <span style="margin-right: 8px;">🔘</span>${serviceName}
            </div>
            <div class="card-description">
                Stack ${stackNumber} - ${config.showState ? 'État visible' : 'État masqué'}
            </div>
            <div class="card-meta">
                <span>📍 Entité: switch.stack_${stackNumber}_state</span>
                <span>🔄 Update: button.stack_${stackNumber}_update</span>
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
        codeOutput.innerHTML = `<pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${code}</pre>`;
    }
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
                    copyBtn.textContent = '📋 Copier';
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
    
    // Supprimer les anciennes classes de thème
    body.className = body.className.replace(/theme-\w+/g, '');
    
    // Ajouter la nouvelle classe de thème
    body.classList.add(`theme-${theme}`);
    
    // Appliquer les styles spécifiques
    if (themes[theme]) {
        body.style.background = themes[theme].background;
        document.documentElement.style.setProperty('--primary-color', themes[theme].primary);
    }
    
    console.log(`🎨 Thème "${theme}" appliqué`);
}

function showNotification(message, type = 'info') {
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
        zIndex: '10000',
        transition: 'all 0.3s ease',
        background: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'
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

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur dans l\'application:', e.error);
    showNotification('Une erreur s\'est produite', 'error');
});

// Export des fonctions globales pour l'HTML
window.generateCard = generateCard;
window.copyCode = copyCode;
window.toggleThemeSelector = toggleThemeSelector;
window.selectTheme = selectTheme;

/**
 * ============================================
 * BRISANET FORM - CONTRATAÇÃO RESIDENCIAL
 * Wizard Multi-Step com Validação e Integração
 * ============================================
 * v1.1 - Correções Janeiro 2026:
 * - IDs Datacake corrigidos (removidos IDs Revan)
 * - Mapeamento de planos com streaming atualizado
 * - Limpeza de localStorage aprimorada
 * - Suporte a Conecta+ como addon
 * - DataLayer events atualizados
 * ============================================
 */

// ============================================
// CONFIGURAÇÃO
// ============================================
const CONFIG = {
    // Endpoint do Worker Datacake v5.x
    WORKER_URL: 'https://brisanet-datacake-worker.renatojnet.workers.dev/api/checkout',

    // Preço do addon Conecta+
    CONECTA_PLUS_PRICE: 9.90,

    // Origem do lead
    ORIGEM: 'LP_RESIDENCIAL',

    // WhatsApp comercial
    WHATSAPP_COMERCIAL: '5581992823101',

    // Versão do formulário (para debug)
    VERSION: '1.1.0'
};

// ============================================
// MAPEAMENTO DE PLANOS - IDs DATACAKE DIRETOS
// Janeiro 2026 - IDs verificados via API Datacake
// ============================================
const PLANOS_DATACAKE = {
    // ========== FIBRA PURA ==========
    'FIBRA_400': { 
        id: '280', 
        nome: '400 MEGA', 
        preco: 79.99,
        download: 400,
        upload: 200
    },
    'FIBRA_500': { 
        id: '281', 
        nome: '500 MEGA', 
        preco: 84.99,
        download: 500,
        upload: 250
    },
    'FIBRA_600': { 
        id: '284', 
        nome: '600 MEGA', 
        preco: 99.90,
        download: 600,
        upload: 300
    },
    'FIBRA_700': { 
        id: '285', 
        nome: '700 MEGA', 
        preco: 109.90,
        download: 700,
        upload: 350
    },
    'FIBRA_1GIGA': { 
        id: '287', 
        nome: '1 GIGA', 
        preco: 149.99,
        download: 1000,
        upload: 500
    },
    
    // ========== FIBRA + STREAMING (IDs combo únicos) ==========
    // Aliases para compatibilidade (podem vir da URL com _GLOBO ou _GLOBOPLAY)
    'FIBRA_500_GLOBO': { 
        id: '282', 
        nome: '500 MEGA + Globoplay', 
        preco: 124.89,
        download: 500,
        upload: 250,
        streaming: 'Globoplay'
    },
    'FIBRA_500_GLOBOPLAY': { 
        id: '282', 
        nome: '500 MEGA + Globoplay', 
        preco: 124.89,
        download: 500,
        upload: 250,
        streaming: 'Globoplay'
    },
    'FIBRA_500_TELECINE': { 
        id: '283', 
        nome: '500 MEGA + Telecine', 
        preco: 108.89,
        download: 500,
        upload: 250,
        streaming: 'Telecine'
    },
    'FIBRA_500_NETFLIX': { 
        id: '288', 
        nome: '500 MEGA + Netflix', 
        preco: 109.99,
        download: 500,
        upload: 250,
        streaming: 'Netflix'
    },
    'FIBRA_600_GLOBO': { 
        id: '290', 
        nome: '600 MEGA + Globoplay', 
        preco: 99.90,
        download: 600,
        upload: 300,
        streaming: 'Globoplay'
    },
    'FIBRA_600_GLOBOPLAY': { 
        id: '290', 
        nome: '600 MEGA + Globoplay', 
        preco: 99.90,
        download: 600,
        upload: 300,
        streaming: 'Globoplay'
    },
    'FIBRA_600_NETFLIX': { 
        id: '289', 
        nome: '600 MEGA + Netflix', 
        preco: 109.99,
        download: 600,
        upload: 300,
        streaming: 'Netflix'
    },
    'FIBRA_700_GLOBO': { 
        id: '238', 
        nome: '700 MEGA + Globoplay', 
        preco: 99.90,
        download: 700,
        upload: 350,
        streaming: 'Globoplay'
    },
    'FIBRA_700_GLOBOPLAY': { 
        id: '238', 
        nome: '700 MEGA + Globoplay', 
        preco: 99.90,
        download: 700,
        upload: 350,
        streaming: 'Globoplay'
    },
    'FIBRA_700_NETFLIX': { 
        id: '292', 
        nome: '700 MEGA + Netflix', 
        preco: 129.99,
        download: 700,
        upload: 350,
        streaming: 'Netflix'
    },
    
    // ========== COMBOS FIBRA + CHIP ==========
    'COMBO_500_CHIP': { 
        id: '272', 
        nome: '500 MEGA + Chip 20GB', 
        preco: 84.90,
        download: 500,
        upload: 250,
        chip: true
    },
    'COMBO_500_CHIP20': { 
        id: '272', 
        nome: '500 MEGA + Chip 20GB', 
        preco: 84.90,
        download: 500,
        upload: 250,
        chip: true
    },
    'COMBO_500_CHIP_GLOBO': { 
        id: '280', 
        nome: '500 MEGA + Chip 20GB + Globoplay', 
        preco: 99.99,
        download: 500,
        upload: 250,
        chip: true,
        streaming: 'Globoplay'
    },
    'COMBO_500_CHIP20_GLOBO': { 
        id: '280', 
        nome: '500 MEGA + Chip 20GB + Globoplay', 
        preco: 99.99,
        download: 500,
        upload: 250,
        chip: true,
        streaming: 'Globoplay'
    },
    'COMBO_700_2CHIPS': { 
        id: '267', 
        nome: '700 MEGA + 2 Chips 20GB + Globoplay', 
        preco: 119.99,
        download: 700,
        upload: 350,
        chips: 2,
        streaming: 'Globoplay'
    },
    'COMBO_700_2CHIP20_GLOBO': { 
        id: '267', 
        nome: '700 MEGA + 2 Chips 20GB + Globoplay', 
        preco: 119.99,
        download: 700,
        upload: 350,
        chips: 2,
        streaming: 'Globoplay'
    }
};

// ============================================
// FUNÇÕES AUXILIARES - VELOCIDADES
// ============================================
function getDownloadSpeed(codigo) {
    const plano = PLANOS_DATACAKE[codigo];
    return plano ? plano.download : 500;
}

function getUploadSpeed(codigo) {
    const plano = PLANOS_DATACAKE[codigo];
    return plano ? plano.upload : 250;
}

function getPlanPrice(codigo) {
    const plano = PLANOS_DATACAKE[codigo];
    return plano ? plano.preco : 84.99;
}

// ============================================
// ESTADO GLOBAL
// ============================================
let state = {
    currentStep: 0,
    cobertura: {
        status: false,
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        city_id: null
    },
    plano: {
        codigo: 'FIBRA_500',
        nome: '500 Mega',
        preco: 84.99,
        download: 500,
        upload: 250
    },
    titular: {
        nome: '',
        sobrenome: '',
        cpf: '',
        rg: '',
        dataNascimento: '',
        whatsapp: '',
        email: '',
        telefoneAlternativo: ''
    },
    endereco: {
        logradouro: '',
        numero: '',
        tipoImovel: '',
        complemento: '',
        referencia1: '',
        referencia2: '',
        nomeCondominio: ''
    },
    agendamento: [
        { data: '', periodo: '' },
        { data: '', periodo: '' }
    ],
    biometria: {
        responsavel: 'TITULAR',
        whatsappTitular: ''
    },
    addonConecta: false,
    whatsappDestino: 'PRINCIPAL',
    lgpdAceito: false
};

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log(`Brisanet Form v${CONFIG.VERSION} inicializando...`);
    
    // Carregar estado do localStorage (se existir)
    loadState();

    // Ler plano da URL e pré-selecionar
    const urlParams = new URLSearchParams(window.location.search);
    const planoParam = urlParams.get('plano');
    
    if (planoParam && PLANOS_DATACAKE[planoParam]) {
        const planoData = PLANOS_DATACAKE[planoParam];
        state.plano = {
            codigo: planoParam,
            nome: planoData.nome,
            preco: planoData.preco,
            download: planoData.download,
            upload: planoData.upload
        };
        updatePlanDisplay();
        saveState();
        
        console.log('Plano selecionado via URL:', planoParam, planoData);
    }

    // Inicializar máscaras
    initMasks();

    // Inicializar eventos
    initEvents();

    // Configurar data mínima para agendamento
    setMinDates();

    // Disparar evento de visualização do step inicial
    pushDataLayer('step_view', { step_number: 0 });
    
    console.log(`Brisanet Form v${CONFIG.VERSION} carregado com sucesso!`);
});

// ============================================
// PERSISTÊNCIA (localStorage)
// ============================================
function saveState() {
    try {
        localStorage.setItem('brisanet_form_state', JSON.stringify(state));
    } catch (e) {
        console.warn('Não foi possível salvar no localStorage:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('brisanet_form_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Mesclar com estado padrão (para novos campos)
            state = { ...state, ...parsed };
            
            // Se já passou do step 0, restaurar formulário
            if (state.cobertura.status && state.currentStep > 0) {
                applyStateToDOM();
                goToStep(state.currentStep, false);
            }
        }
    } catch (e) {
        console.warn('Não foi possível carregar do localStorage:', e);
    }
}

function clearState() {
    try {
        // Limpar localStorage
        localStorage.removeItem('brisanet_form_state');
        
        // Limpar sessionStorage também
        sessionStorage.clear();
        
        // Resetar estado para valores iniciais
        state = {
            currentStep: 0,
            cobertura: { status: false, cep: '', logradouro: '', bairro: '', cidade: '', uf: '', city_id: null },
            plano: { codigo: 'FIBRA_500', nome: '500 Mega', preco: 84.99, download: 500, upload: 250 },
            titular: { nome: '', sobrenome: '', cpf: '', rg: '', dataNascimento: '', whatsapp: '', email: '', telefoneAlternativo: '' },
            endereco: { logradouro: '', numero: '', tipoImovel: '', complemento: '', referencia1: '', referencia2: '', nomeCondominio: '' },
            agendamento: [{ data: '', periodo: '' }, { data: '', periodo: '' }],
            biometria: { responsavel: 'TITULAR', whatsappTitular: '' },
            addonConecta: false,
            whatsappDestino: 'PRINCIPAL',
            lgpdAceito: false
        };
        
        console.log('Estado limpo com sucesso');
    } catch (e) {
        console.warn('Não foi possível limpar localStorage:', e);
    }
}

function applyStateToDOM() {
    // Aplicar dados do titular
    const fields = {
        'nome': state.titular.nome,
        'sobrenome': state.titular.sobrenome,
        'cpf': state.titular.cpf ? formatCPF(state.titular.cpf) : '',
        'rg': state.titular.rg,
        'dataNascimento': state.titular.dataNascimento ? formatDateBR(state.titular.dataNascimento) : '',
        'whatsapp': state.titular.whatsapp ? formatPhone(state.titular.whatsapp) : '',
        'email': state.titular.email,
        'telefoneAlternativo': state.titular.telefoneAlternativo ? formatPhone(state.titular.telefoneAlternativo) : '',
        'logradouro': state.endereco.logradouro,
        'numero': state.endereco.numero,
        'complemento': state.endereco.complemento,
        'referencia1': state.endereco.referencia1,
        'referencia2': state.endereco.referencia2
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el && value) el.value = value;
    });
    
    // Tipo de imóvel
    if (state.endereco.tipoImovel) {
        const tipoRadio = document.querySelector(`input[name="tipoImovel"][value="${state.endereco.tipoImovel}"]`);
        if (tipoRadio) tipoRadio.checked = true;
    }
    
    // Atualizar plano selecionado
    updatePlanDisplay();
    
    // Atualizar endereço preview
    updateAddressPreview();
}

// ============================================
// MÁSCARAS DE INPUT
// ============================================
function initMasks() {
    // CEP: 00000-000
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
    }
    
    // CPF: 000.000.000-00
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    }
    
    // Data: dd/mm/aaaa
    const dataInput = document.getElementById('dataNascimento');
    if (dataInput) {
        dataInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            if (value.length > 5) {
                value = value.substring(0, 5) + '/' + value.substring(5, 9);
            }
            e.target.value = value;
        });
    }
    
    // Telefones: (00) 00000-0000
    const phoneInputs = ['whatsapp', 'telefoneAlternativo', 'whatsappTitular'];
    phoneInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function(e) {
                e.target.value = formatPhone(e.target.value);
            });
        }
    });
}

function formatCPF(value) {
    value = value.replace(/\D/g, '');
    if (value.length > 3) value = value.substring(0, 3) + '.' + value.substring(3);
    if (value.length > 7) value = value.substring(0, 7) + '.' + value.substring(7);
    if (value.length > 11) value = value.substring(0, 11) + '-' + value.substring(11, 13);
    return value;
}

function formatPhone(value) {
    value = value.replace(/\D/g, '');
    if (value.length > 0) value = '(' + value;
    if (value.length > 3) value = value.substring(0, 3) + ') ' + value.substring(3);
    if (value.length > 10) value = value.substring(0, 10) + '-' + value.substring(10, 14);
    return value;
}

function formatDateBR(value) {
    // Se vier no formato ISO (yyyy-mm-dd), converter para dd/mm/yyyy
    if (value && value.includes('-')) {
        const parts = value.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return value;
}

function parseDate(value) {
    // Converter dd/mm/yyyy para yyyy-mm-dd
    const parts = value.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return value;
}

// ============================================
// VALIDAÇÕES
// ============================================
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateDate(dateStr) {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return false;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    // Verificar idade mínima (18 anos)
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age >= 18;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
    }
    
    if (error) {
        if (message) error.textContent = message;
        error.classList.add('visible');
    }
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (error) {
        error.classList.remove('visible');
    }
}

function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('error');
        field.classList.add('success');
    }
    clearError(fieldId);
}

// ============================================
// NAVEGAÇÃO ENTRE STEPS
// ============================================
function goToStep(stepNumber, animate = true) {
    // Esconder todos os panels
    document.querySelectorAll('.step-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Mostrar o panel atual
    const targetPanel = document.getElementById(`step-${stepNumber}`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
    
    // Atualizar stepper
    updateStepper(stepNumber);
    
    // Atualizar estado
    state.currentStep = stepNumber;
    saveState();
    
    // Disparar evento
    pushDataLayer('step_view', { step_number: stepNumber });
    
    // Scroll para o topo
    if (animate) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateStepper(currentStep) {
    // Atualizar classes dos step items
    document.querySelectorAll('.step-item').forEach((item, index) => {
        item.classList.remove('active', 'completed');
        
        if (index < currentStep) {
            item.classList.add('completed');
        } else if (index === currentStep) {
            item.classList.add('active');
        }
    });
    
    // Atualizar barra de progresso
    const progressPercent = (currentStep / 4) * 100;
    const progressBar = document.getElementById('stepperProgress');
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
}

// ============================================
// STEP 0: CEP
// ============================================
async function checkCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        showError('cep', 'CEP deve ter 8 dígitos');
        return;
    }
    
    clearError('cep');
    
    // Mostrar loading
    document.getElementById('cepLoading').classList.add('visible');
    document.getElementById('cepResult').classList.remove('visible');
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        document.getElementById('cepLoading').classList.remove('visible');
        
        if (data.erro) {
            showCEPError('CEP não encontrado. Verifique e tente novamente.');
            return;
        }
        
        // Verificar cobertura (aqui seria integração com Datacake)
        // Por ora, simulamos que há cobertura em qualquer lugar
        const hasCobertura = true; // TODO: integrar com API de cobertura
        
        if (hasCobertura) {
            // Salvar dados
            state.cobertura = {
                status: true,
                cep: cep,
                logradouro: data.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                uf: data.uf || '',
                city_id: null // Será preenchido pelo Worker se disponível
            };
            
            state.endereco.logradouro = data.logradouro || '';
            
            saveState();
            
            // Mostrar sucesso
            showCEPSuccess(data);
            
            // Disparar evento
            pushDataLayer('cep_success', { 
                cep: cep, 
                cidade: data.localidade 
            });
            
            // Avançar automaticamente após 1.5s
            setTimeout(() => {
                goToStep(1);
                updatePlanDisplay();
                updateAddressPreview();
            }, 1500);
        } else {
            showCEPError('Infelizmente ainda não temos cobertura nesta região.');
        }
        
    } catch (error) {
        document.getElementById('cepLoading').classList.remove('visible');
        showCEPError('Erro ao consultar CEP. Tente novamente.');
        console.error('Erro ViaCEP:', error);
    }
}

function showCEPSuccess(data) {
    const resultDiv = document.getElementById('cepResult');
    resultDiv.innerHTML = `
        <div class="cep-success">
            <i class="bi bi-check-circle-fill"></i>
            <h4>Ótima notícia! Temos cobertura!</h4>
            <p>${data.logradouro ? data.logradouro + ', ' : ''}${data.bairro || ''}<br>
            ${data.localidade}/${data.uf}</p>
        </div>
    `;
    resultDiv.classList.add('visible');
}

function showCEPError(message) {
    const resultDiv = document.getElementById('cepResult');
    resultDiv.innerHTML = `
        <div class="cep-error">
            <i class="bi bi-x-circle-fill"></i>
            <h4>Ops!</h4>
            <p>${message}</p>
        </div>
    `;
    resultDiv.classList.add('visible');
}

// ============================================
// STEP 1: Validação Dados Pessoais
// ============================================
function validateStep1() {
    let isValid = true;
    
    // Nome
    const nome = document.getElementById('nome').value.trim();
    if (!nome || nome.length < 2) {
        showError('nome', 'Nome é obrigatório');
        isValid = false;
    } else {
        clearError('nome');
        state.titular.nome = nome;
    }
    
    // Sobrenome
    const sobrenome = document.getElementById('sobrenome').value.trim();
    if (!sobrenome || sobrenome.length < 2) {
        showError('sobrenome', 'Sobrenome é obrigatório');
        isValid = false;
    } else {
        clearError('sobrenome');
        state.titular.sobrenome = sobrenome;
    }
    
    // CPF
    const cpf = document.getElementById('cpf').value;
    if (!validateCPF(cpf)) {
        showError('cpf', 'CPF inválido');
        isValid = false;
    } else {
        clearError('cpf');
        state.titular.cpf = cpf.replace(/\D/g, '');
    }
    
    // RG
    const rg = document.getElementById('rg').value.trim();
    if (!rg || rg.length < 5) {
        showError('rg', 'RG é obrigatório');
        isValid = false;
    } else {
        clearError('rg');
        state.titular.rg = rg;
    }
    
    // Data de Nascimento
    const dataNascimento = document.getElementById('dataNascimento').value;
    if (!validateDate(dataNascimento)) {
        showError('dataNascimento', 'Data inválida ou menor de 18 anos');
        isValid = false;
    } else {
        clearError('dataNascimento');
        state.titular.dataNascimento = parseDate(dataNascimento);
    }
    
    // WhatsApp
    const whatsapp = document.getElementById('whatsapp').value.replace(/\D/g, '');
    if (whatsapp.length < 10) {
        showError('whatsapp', 'WhatsApp inválido');
        isValid = false;
    } else {
        clearError('whatsapp');
        state.titular.whatsapp = whatsapp;
    }
    
    // Email
    const email = document.getElementById('email').value.trim();
    if (!validateEmail(email)) {
        showError('email', 'E-mail inválido');
        isValid = false;
    } else {
        clearError('email');
        state.titular.email = email;
    }
    
    // Telefone Alternativo (opcional)
    const telefoneAlt = document.getElementById('telefoneAlternativo').value.replace(/\D/g, '');
    state.titular.telefoneAlternativo = telefoneAlt || null;
    
    if (isValid) {
        saveState();
    }
    
    return isValid;
}

// ============================================
// STEP 2: Validação Endereço
// ============================================
function validateStep2() {
    let isValid = true;
    
    // Logradouro
    const logradouro = document.getElementById('logradouro').value.trim();
    if (!logradouro) {
        showError('logradouro', 'Logradouro é obrigatório');
        isValid = false;
    } else {
        clearError('logradouro');
        state.endereco.logradouro = logradouro;
    }
    
    // Número
    const numero = document.getElementById('numero').value.trim();
    if (!numero) {
        showError('numero', 'Número é obrigatório');
        isValid = false;
    } else {
        clearError('numero');
        state.endereco.numero = numero;
    }
    
    // Tipo de Imóvel
    const tipoImovel = document.querySelector('input[name="tipoImovel"]:checked');
    if (!tipoImovel) {
        showError('tipoImovel', 'Selecione o tipo de imóvel');
        isValid = false;
    } else {
        clearError('tipoImovel');
        state.endereco.tipoImovel = tipoImovel.value;
    }
    
    // Complemento (opcional)
    state.endereco.complemento = document.getElementById('complemento').value.trim() || null;
    
    // Nome do Condomínio (opcional, se aplicável)
    const nomeCondominioEl = document.getElementById('nomeCondominio');
    if (nomeCondominioEl) {
        state.endereco.nomeCondominio = nomeCondominioEl.value.trim() || null;
    }
    
    // Referência 1
    const ref1 = document.getElementById('referencia1').value.trim();
    if (!ref1) {
        showError('referencia1', 'Ponto de referência é obrigatório');
        isValid = false;
    } else {
        clearError('referencia1');
        state.endereco.referencia1 = ref1;
    }
    
    // Referência 2
    const ref2 = document.getElementById('referencia2').value.trim();
    if (!ref2) {
        showError('referencia2', 'Segundo ponto de referência é obrigatório');
        isValid = false;
    } else {
        clearError('referencia2');
        state.endereco.referencia2 = ref2;
    }
    
    if (isValid) {
        saveState();
    }
    
    return isValid;
}

// ============================================
// STEP 3: Validação Agendamento + Biometria
// ============================================
function validateStep3() {
    let isValid = true;
    
    // Data 1
    const data1 = document.getElementById('data1').value;
    const periodo1 = document.querySelector('#period1Options .period-btn.selected');
    
    if (!data1) {
        isValid = false;
    } else {
        state.agendamento[0].data = data1;
    }
    
    if (!periodo1) {
        isValid = false;
    } else {
        state.agendamento[0].periodo = periodo1.dataset.period;
    }
    
    // Data 2
    const data2 = document.getElementById('data2').value;
    const periodo2 = document.querySelector('#period2Options .period-btn.selected');
    
    if (!data2) {
        isValid = false;
    } else {
        state.agendamento[1].data = data2;
    }
    
    if (!periodo2) {
        isValid = false;
    } else {
        state.agendamento[1].periodo = periodo2.dataset.period;
    }
    
    // Verificar se as datas são diferentes
    if (data1 && data2 && data1 === data2 && periodo1 && periodo2 && 
        periodo1.dataset.period === periodo2.dataset.period) {
        showError('agenda', 'As duas opções de agendamento devem ser diferentes');
        isValid = false;
    } else {
        clearError('agenda');
    }
    
    if (!isValid && !document.getElementById('agendaError').classList.contains('visible')) {
        showError('agenda', 'Preencha as duas opções de agendamento');
    }
    
    // Biometria
    const biometria = document.querySelector('input[name="biometria"]:checked');
    if (biometria) {
        state.biometria.responsavel = biometria.value;
        
        if (biometria.value === 'TERCEIRO') {
            const whatsappTitular = document.getElementById('whatsappTitular').value.replace(/\D/g, '');
            state.biometria.whatsappTitular = whatsappTitular || null;
            
            // Disparar evento
            pushDataLayer('biometria_terceiro');
        } else {
            pushDataLayer('biometria_titular');
        }
    }
    
    if (isValid) {
        saveState();
        updateSummary();
    }
    
    return isValid;
}

// ============================================
// STEP 4: Confirmação
// ============================================
function updateSummary() {
    // Plano
    const summaryPlan = document.getElementById('summaryPlan');
    const summarySpeed = document.getElementById('summarySpeed');
    
    if (summaryPlan) summaryPlan.textContent = state.plano.nome;
    if (summarySpeed) summarySpeed.textContent = `${state.plano.download} Mbps / ${state.plano.upload} Mbps`;
    
    // Endereço
    const enderecoStr = `${state.endereco.logradouro}, ${state.endereco.numero}` +
        (state.endereco.complemento ? ` - ${state.endereco.complemento}` : '') +
        ` - ${state.cobertura.bairro}, ${state.cobertura.cidade}/${state.cobertura.uf}`;
    
    const summaryAddress = document.getElementById('summaryAddress');
    if (summaryAddress) summaryAddress.textContent = enderecoStr;
    
    // Agendamento
    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return '-';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };
    
    const periodNames = { 'MANHA': 'Manhã', 'TARDE': 'Tarde', 'NOITE': 'Noite' };
    
    const summaryDate1 = document.getElementById('summaryDate1');
    const summaryDate2 = document.getElementById('summaryDate2');
    
    if (summaryDate1) {
        summaryDate1.textContent = state.agendamento[0].data ? 
            `${formatDateDisplay(state.agendamento[0].data)} - ${periodNames[state.agendamento[0].periodo] || ''}` : '-';
    }
    
    if (summaryDate2) {
        summaryDate2.textContent = state.agendamento[1].data ? 
            `${formatDateDisplay(state.agendamento[1].data)} - ${periodNames[state.agendamento[1].periodo] || ''}` : '-';
    }
    
    // WhatsApp principal
    const whatsappPrincipalNumber = document.getElementById('whatsappPrincipalNumber');
    if (whatsappPrincipalNumber) {
        whatsappPrincipalNumber.textContent = formatPhone(state.titular.whatsapp);
    }
    
    // WhatsApp titular (se informado)
    if (state.biometria.whatsappTitular) {
        const whatsappTitularOption = document.getElementById('whatsappTitularOption');
        const whatsappTitularNumber = document.getElementById('whatsappTitularNumber');
        
        if (whatsappTitularOption) whatsappTitularOption.style.display = 'block';
        if (whatsappTitularNumber) whatsappTitularNumber.textContent = formatPhone(state.biometria.whatsappTitular);
    }
    
    // Total
    updateTotal();
}

function updateTotal() {
    let total = state.plano.preco;
    
    if (state.addonConecta) {
        total += CONFIG.CONECTA_PLUS_PRICE;
    }
    
    const totalValue = document.getElementById('totalValue');
    if (totalValue) {
        totalValue.textContent = total.toFixed(2).replace('.', ',');
    }
}

// ============================================
// PLAN SELECTION
// ============================================
function updatePlanDisplay() {
    // Atualizar em todos os steps
    const planNames = document.querySelectorAll('#selectedPlanName, #selectedPlanName2, #selectedPlanName3');
    const planPrices = document.querySelectorAll('#selectedPlanPrice, #selectedPlanPrice2, #selectedPlanPrice3');
    
    planNames.forEach(el => {
        if (el) el.textContent = state.plano.nome;
    });
    
    planPrices.forEach(el => {
        if (el) el.textContent = Math.floor(state.plano.preco);
    });
    
    // Atualizar velocidades
    document.querySelectorAll('.plan-speed').forEach(el => {
        el.textContent = `Download ${state.plano.download} Mbps / Upload ${state.plano.upload} Mbps`;
    });
}

function selectPlan(planElement) {
    // Remover seleção anterior
    document.querySelectorAll('.plan-option').forEach(p => p.classList.remove('selected'));
    
    // Adicionar seleção
    planElement.classList.add('selected');
    
    // Obter dados do plano
    const codigo = planElement.dataset.plan;
    const planoData = PLANOS_DATACAKE[codigo];
    
    if (planoData) {
        // Atualizar estado
        state.plano = {
            codigo: codigo,
            nome: planoData.nome,
            preco: planoData.preco,
            download: planoData.download,
            upload: planoData.upload
        };
        
        saveState();
        updatePlanDisplay();
        updateTotal();
        
        // Disparar evento
        pushDataLayer('plan_selected', {
            plan_code: codigo,
            plan_name: planoData.nome,
            plan_price: planoData.preco
        });
    }
    
    // Fechar modal
    closePlanModal();
}

function openPlanModal() {
    const modal = document.getElementById('planModal');
    if (modal) modal.classList.add('visible');
}

function closePlanModal() {
    const modal = document.getElementById('planModal');
    if (modal) modal.classList.remove('visible');
}

// ============================================
// HELPERS
// ============================================
function updateAddressPreview() {
    const preview = document.getElementById('addressPreview');
    if (preview && state.cobertura.status) {
        preview.textContent = 
            `${state.cobertura.logradouro || 'Rua não identificada'}, ${state.cobertura.bairro} - ${state.cobertura.cidade}/${state.cobertura.uf}`;
    }
    
    // Preencher logradouro automaticamente
    const logradouroInput = document.getElementById('logradouro');
    if (logradouroInput && state.cobertura.logradouro) {
        logradouroInput.value = state.cobertura.logradouro;
    }
}

function setMinDates() {
    // Data mínima = amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    const data1Input = document.getElementById('data1');
    const data2Input = document.getElementById('data2');
    
    if (data1Input) data1Input.min = minDate;
    if (data2Input) data2Input.min = minDate;
}

// ============================================
// SUBMIT DO FORMULÁRIO
// ============================================
async function submitForm() {
    // Validar LGPD
    const lgpdCheck = document.getElementById('lgpdCheck');
    if (!lgpdCheck || !lgpdCheck.checked) {
        showError('lgpd', 'Você precisa aceitar os termos para continuar');
        return;
    }
    clearError('lgpd');
    
    // Mostrar loading
    const submitLoading = document.getElementById('submitLoading');
    const btnSubmit = document.getElementById('btnSubmit');
    
    if (submitLoading) submitLoading.classList.add('visible');
    if (btnSubmit) btnSubmit.disabled = true;
    
    // Disparar evento
    pushDataLayer('form_submit', {
        plan_code: state.plano.codigo,
        plan_name: state.plano.nome,
        plan_price: state.plano.preco,
        addon_conecta: state.addonConecta
    });

    // Obter dados do plano Datacake (ID já é o correto)
    const planoDC = PLANOS_DATACAKE[state.plano.codigo] || PLANOS_DATACAKE['FIBRA_500'];

    // Montar payload no formato esperado pelo Worker Datacake v5.x
    const payload = {
        // Dados pessoais
        nome: state.titular.nome,
        sobrenome: state.titular.sobrenome,
        cpf: state.titular.cpf,
        rg: state.titular.rg,
        data_nascimento: state.titular.dataNascimento,
        telefone: state.titular.whatsapp,
        email: state.titular.email,
        
        // Endereço
        cep: state.cobertura.cep,
        logradouro: state.endereco.logradouro,
        numero: state.endereco.numero,
        complemento: state.endereco.complemento || '',
        bairro: state.cobertura.bairro,
        cidade: state.cobertura.cidade,
        uf: state.cobertura.uf,
        referencia1: state.endereco.referencia1,
        referencia2: state.endereco.referencia2,
        tipo_imovel: state.endereco.tipoImovel,
        nome_condominio: state.endereco.nomeCondominio || '',
        
        // Plano - ID Datacake direto (já inclui streaming se aplicável)
        plano_id: planoDC.id,
        plano_nome: planoDC.nome,
        plano_preco: planoDC.preco,
        plan_type_id: '1', // Residencial
        
        // Agendamento
        agendamento: state.agendamento,
        
        // Biometria
        biometria: {
            responsavel: state.biometria.responsavel,
            whatsapp_titular: state.biometria.whatsappTitular
        },
        whatsapp_destino: state.whatsappDestino,
        
        // Addons
        addon_conecta: state.addonConecta,
        
        // Metadata
        origem: CONFIG.ORIGEM,
        form_version: CONFIG.VERSION
    };
    
    console.log('Payload a ser enviado:', payload);
    console.log('ID Datacake do plano:', planoDC.id);
    
    try {
        const response = await fetch(CONFIG.WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (submitLoading) submitLoading.classList.remove('visible');
        
        console.log('Resposta do Worker:', result);
        
        if (response.ok && (result.status === 'auto' || result.status === 'manual' || result.success)) {
            // Sucesso - disparar evento ANTES de limpar
            pushDataLayer('form_success', { 
                status: result.status,
                deal_id: result.deal_id || null,
                orcamento_id: result.orcamento_id || null,
                transaction_id: result.deal_id || result.orcamento_id || null,
                plan_code: state.plano.codigo,
                plan_name: state.plano.nome,
                value: state.plano.preco + (state.addonConecta ? CONFIG.CONECTA_PLUS_PRICE : 0)
            });
            
            // Limpar estado ANTES de ir para página de obrigado
            clearState();
            
            // Ir para página de obrigado
            goToStep(5);
            
        } else {
            throw new Error(result.message || result.error || 'Erro ao processar pedido');
        }
        
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        
        if (submitLoading) submitLoading.classList.remove('visible');
        if (btnSubmit) btnSubmit.disabled = false;
        
        // Disparar evento de erro
        pushDataLayer('form_error', {
            error_message: error.message
        });
        
        alert('Ocorreu um erro ao processar seu pedido. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
    }
}

// ============================================
// DATALAYER (Google Tag Manager)
// ============================================
function pushDataLayer(event, data = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: event,
        ...data
    });
    console.log('DataLayer push:', event, data);
}

// ============================================
// EVENT LISTENERS
// ============================================
function initEvents() {
    // Step 0: CEP
    const btnCheckCep = document.getElementById('btnCheckCep');
    const cepInput = document.getElementById('cep');
    
    if (btnCheckCep) btnCheckCep.addEventListener('click', checkCEP);
    if (cepInput) {
        cepInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkCEP();
        });
    }
    
    // Step 1: Navegação
    const btnBack1 = document.getElementById('btnBack1');
    const btnNext1 = document.getElementById('btnNext1');
    
    if (btnBack1) btnBack1.addEventListener('click', () => goToStep(0));
    if (btnNext1) btnNext1.addEventListener('click', () => {
        if (validateStep1()) goToStep(2);
    });
    
    // Step 2: Navegação
    const btnBack2 = document.getElementById('btnBack2');
    const btnNext2 = document.getElementById('btnNext2');
    
    if (btnBack2) btnBack2.addEventListener('click', () => goToStep(1));
    if (btnNext2) btnNext2.addEventListener('click', () => {
        if (validateStep2()) goToStep(3);
    });
    
    // Step 3: Navegação
    const btnBack3 = document.getElementById('btnBack3');
    const btnNext3 = document.getElementById('btnNext3');
    
    if (btnBack3) btnBack3.addEventListener('click', () => goToStep(2));
    if (btnNext3) btnNext3.addEventListener('click', () => {
        if (validateStep3()) goToStep(4);
    });
    
    // Step 4: Navegação e Submit
    const btnBack4 = document.getElementById('btnBack4');
    const btnSubmit = document.getElementById('btnSubmit');
    
    if (btnBack4) btnBack4.addEventListener('click', () => goToStep(3));
    if (btnSubmit) btnSubmit.addEventListener('click', submitForm);
    
    // LGPD checkbox - habilita/desabilita botão
    const lgpdCheck = document.getElementById('lgpdCheck');
    if (lgpdCheck) {
        lgpdCheck.addEventListener('change', (e) => {
            const btnSubmit = document.getElementById('btnSubmit');
            if (btnSubmit) btnSubmit.disabled = !e.target.checked;
            state.lgpdAceito = e.target.checked;
        });
    }
    
    // Addon Conecta+
    const addonConecta = document.getElementById('addonConecta');
    if (addonConecta) {
        addonConecta.addEventListener('change', (e) => {
            state.addonConecta = e.target.checked;
            updateTotal();
            
            // Disparar evento
            pushDataLayer('addon_toggle', {
                addon_name: 'conecta_plus',
                addon_enabled: e.target.checked
            });
        });
    }
    
    // WhatsApp destino
    document.querySelectorAll('input[name="whatsappDestino"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.whatsappDestino = e.target.value;
        });
    });
    
    // Plan modal
    const btnChangePlan = document.getElementById('btnChangePlan');
    const closePlanModalBtn = document.getElementById('closePlanModal');
    const planModal = document.getElementById('planModal');
    
    if (btnChangePlan) btnChangePlan.addEventListener('click', openPlanModal);
    if (closePlanModalBtn) closePlanModalBtn.addEventListener('click', closePlanModal);
    if (planModal) {
        planModal.addEventListener('click', (e) => {
            if (e.target.id === 'planModal') closePlanModal();
        });
    }
    
    // Plan selection
    document.querySelectorAll('.plan-option').forEach(option => {
        option.addEventListener('click', () => selectPlan(option));
    });
    
    // Biometria toggle
    document.querySelectorAll('input[name="biometria"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const info = document.getElementById('biometriaInfo');
            if (info) {
                if (e.target.value === 'TERCEIRO') {
                    info.classList.add('visible');
                } else {
                    info.classList.remove('visible');
                }
            }
        });
    });
    
    // Period selection (agendamento)
    document.querySelectorAll('#period1Options .period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#period1Options .period-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
    
    document.querySelectorAll('#period2Options .period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#period2Options .period-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
    
    // Edit address button
    const btnEditAddress = document.getElementById('btnEditAddress');
    if (btnEditAddress) {
        btnEditAddress.addEventListener('click', () => {
            const logradouro = document.getElementById('logradouro');
            if (logradouro) logradouro.focus();
        });
    }
    
    // Plan details button
    const btnPlanDetails = document.getElementById('btnPlanDetails');
    if (btnPlanDetails) {
        btnPlanDetails.addEventListener('click', openPlanModal);
    }
}

// ============================================
// FIM DO SCRIPT
// ============================================
console.log(`Brisanet Form v${CONFIG.VERSION} carregado`);

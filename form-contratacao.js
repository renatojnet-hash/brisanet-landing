/**
 * ============================================
 * BRISANET FORM - CONTRATAÇÃO RESIDENCIAL
 * Wizard Multi-Step com Validação e Integração
 * ============================================
 */

// ============================================
// CONFIGURAÇÃO
// ============================================
const CONFIG = {
    // Endpoint do Worker Datacake v4.0
    WORKER_URL: 'https://brisanet-datacake-worker.renatojnet.workers.dev/api/checkout',

    // Preço do addon Conecta+
    CONECTA_PLUS_PRICE: 9.90,

    // Origem do lead
    ORIGEM: 'LP_RESIDENCIAL',

    // WhatsApp comercial
    WHATSAPP_COMERCIAL: '5581992823101'
};

// ============================================
// MAPEAMENTO DE PLANOS DATACAKE - JANEIRO 2026
// ============================================
const PLANOS_DATACAKE = {
    'FIBRA_500': { id: '1056', nome: '500 MEGA', preco: 84.99 },
    'FIBRA_600': { id: '1060', nome: '600 MEGA', preco: 99.90 },
    'FIBRA_700': { id: '1062', nome: '700 MEGA', preco: 109.90 },
    'FIBRA_1GIGA': { id: '1082', nome: '1 GIGA', preco: 149.99 },
    'FIBRA_600_GLOBO': { id: '1060', sva: '870', nome: '600 MEGA + Globoplay', preco: 99.90 },
    'FIBRA_500_GLOBO': { id: '1056', sva: '836', nome: '500 MEGA + Globoplay', preco: 124.89 },
    'FIBRA_600_NETFLIX': { id: '1060', sva: '448', nome: '600 MEGA + Netflix', preco: 109.99 },
    'FIBRA_500_TELECINE': { id: '1056', sva: '411', nome: '500 MEGA + Telecine', preco: 108.89 },
    'COMBO_500_CHIP': { id: '1170', nome: '500 MEGA + Chip + Globoplay', preco: 99.99 },
    'COMBO_700_2CHIPS': { id: '1171', nome: '700 MEGA + 2 Chips + Globoplay', preco: 119.99 }
};

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
        uf: ''
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
        referencia2: ''
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
    // Carregar estado do localStorage (se existir)
    loadState();
    
    // Inicializar máscaras
    initMasks();
    
    // Inicializar eventos
    initEvents();
    
    // Configurar data mínima para agendamento
    setMinDates();
    
    // Disparar evento de visualização do step inicial
    pushDataLayer('step_view', { step_number: 0 });
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
        localStorage.removeItem('brisanet_form_state');
    } catch (e) {
        console.warn('Não foi possível limpar localStorage:', e);
    }
}

function applyStateToDOM() {
    // Aplicar dados do titular
    if (state.titular.nome) document.getElementById('nome').value = state.titular.nome;
    if (state.titular.sobrenome) document.getElementById('sobrenome').value = state.titular.sobrenome;
    if (state.titular.cpf) document.getElementById('cpf').value = formatCPF(state.titular.cpf);
    if (state.titular.rg) document.getElementById('rg').value = state.titular.rg;
    if (state.titular.dataNascimento) document.getElementById('dataNascimento').value = formatDateBR(state.titular.dataNascimento);
    if (state.titular.whatsapp) document.getElementById('whatsapp').value = formatPhone(state.titular.whatsapp);
    if (state.titular.email) document.getElementById('email').value = state.titular.email;
    if (state.titular.telefoneAlternativo) document.getElementById('telefoneAlternativo').value = formatPhone(state.titular.telefoneAlternativo);
    
    // Aplicar endereço
    if (state.endereco.logradouro) document.getElementById('logradouro').value = state.endereco.logradouro;
    if (state.endereco.numero) document.getElementById('numero').value = state.endereco.numero;
    if (state.endereco.complemento) document.getElementById('complemento').value = state.endereco.complemento;
    if (state.endereco.referencia1) document.getElementById('referencia1').value = state.endereco.referencia1;
    if (state.endereco.referencia2) document.getElementById('referencia2').value = state.endereco.referencia2;
    
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
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        e.target.value = value;
    });
    
    // CPF: 000.000.000-00
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        e.target.value = formatCPF(e.target.value);
    });
    
    // Data: dd/mm/aaaa
    const dataInput = document.getElementById('dataNascimento');
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
    document.getElementById('stepperProgress').style.width = `${progressPercent}%`;
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
                uf: data.uf || ''
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
    document.getElementById('summaryPlan').textContent = state.plano.nome;
    document.getElementById('summarySpeed').textContent = 
        `${state.plano.download} Mbps / ${state.plano.upload} Mbps`;
    
    // Endereço
    const enderecoStr = `${state.endereco.logradouro}, ${state.endereco.numero}` +
        (state.endereco.complemento ? ` - ${state.endereco.complemento}` : '') +
        ` - ${state.cobertura.bairro}, ${state.cobertura.cidade}/${state.cobertura.uf}`;
    document.getElementById('summaryAddress').textContent = enderecoStr;
    
    // Agendamento
    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return '-';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };
    
    const periodNames = { 'MANHA': 'Manhã', 'TARDE': 'Tarde', 'NOITE': 'Noite' };
    
    document.getElementById('summaryDate1').textContent = 
        state.agendamento[0].data ? 
        `${formatDateDisplay(state.agendamento[0].data)} - ${periodNames[state.agendamento[0].periodo] || ''}` : '-';
    
    document.getElementById('summaryDate2').textContent = 
        state.agendamento[1].data ? 
        `${formatDateDisplay(state.agendamento[1].data)} - ${periodNames[state.agendamento[1].periodo] || ''}` : '-';
    
    // WhatsApp principal
    document.getElementById('whatsappPrincipalNumber').textContent = 
        formatPhone(state.titular.whatsapp);
    
    // WhatsApp titular (se informado)
    if (state.biometria.whatsappTitular) {
        document.getElementById('whatsappTitularOption').style.display = 'block';
        document.getElementById('whatsappTitularNumber').textContent = 
            formatPhone(state.biometria.whatsappTitular);
    }
    
    // Total
    updateTotal();
}

function updateTotal() {
    let total = state.plano.preco;
    
    if (state.addonConecta) {
        total += CONFIG.CONECTA_PLUS_PRICE;
    }
    
    document.getElementById('totalValue').textContent = total.toFixed(2).replace('.', ',');
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
    
    // Atualizar estado
    state.plano = {
        codigo: planElement.dataset.plan,
        nome: planElement.dataset.name,
        preco: parseFloat(planElement.dataset.price),
        download: parseInt(planElement.dataset.download),
        upload: parseInt(planElement.dataset.upload)
    };
    
    saveState();
    updatePlanDisplay();
    updateTotal();
    
    // Fechar modal
    closePlanModal();
}

function openPlanModal() {
    document.getElementById('planModal').classList.add('visible');
}

function closePlanModal() {
    document.getElementById('planModal').classList.remove('visible');
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
    if (state.cobertura.logradouro) {
        document.getElementById('logradouro').value = state.cobertura.logradouro;
    }
}

function setMinDates() {
    // Data mínima = amanhã
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    document.getElementById('data1').min = minDate;
    document.getElementById('data2').min = minDate;
}

// ============================================
// SUBMIT DO FORMULÁRIO
// ============================================
async function submitForm() {
    // Validar LGPD
    if (!document.getElementById('lgpdCheck').checked) {
        showError('lgpd', 'Você precisa aceitar os termos para continuar');
        return;
    }
    clearError('lgpd');
    
    // Mostrar loading
    document.getElementById('submitLoading').classList.add('visible');
    document.getElementById('btnSubmit').disabled = true;
    
    // Disparar evento
    pushDataLayer('form_submit');

    // Obter dados do plano Datacake
    const planoDC = PLANOS_DATACAKE[state.plano.codigo] || PLANOS_DATACAKE['FIBRA_500'];

    // Montar payload no formato esperado pelo Worker Datacake v4.0
    const payload = {
        nome: state.titular.nome,
        sobrenome: state.titular.sobrenome,
        cpf: state.titular.cpf,
        telefone: state.titular.whatsapp,
        email: state.titular.email,
        data_nascimento: state.titular.dataNascimento,
        cep: state.cobertura.cep,
        logradouro: state.endereco.logradouro,
        numero: state.endereco.numero,
        complemento: state.endereco.complemento || '',
        bairro: state.cobertura.bairro,
        cidade: state.cobertura.cidade,
        uf: state.cobertura.uf,
        city_id: state.cobertura.city_id || '1660', // ID padrão Recife
        plano_id: planoDC.id,
        sva_ids: planoDC.sva ? [planoDC.sva] : [],
        referencia1: state.endereco.referencia1,
        referencia2: state.endereco.referencia2,
        plan_type_id: '1', // Residencial
        origem: CONFIG.ORIGEM,
        agendamento: state.agendamento,
        biometria: {
            responsavel: state.biometria.responsavel,
            whatsapp_titular: state.biometria.whatsappTitular
        },
        rg: state.titular.rg,
        tipo_imovel: state.endereco.tipoImovel,
        addon_conecta: state.addonConecta,
        whatsapp_destino: state.whatsappDestino
    };
    
    console.log('Payload a ser enviado:', payload);
    
    try {
        const response = await fetch(CONFIG.WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        document.getElementById('submitLoading').classList.remove('visible');
        
        if (response.ok && (result.status === 'auto' || result.status === 'manual' || result.success)) {
            // Sucesso
            pushDataLayer('form_success', { 
                status: result.status,
                orcamento_id: result.orcamento_id || null
            });
            
            // Limpar estado
            clearState();
            
            // Ir para página de obrigado
            goToStep(5);
        } else {
            throw new Error(result.message || 'Erro ao processar pedido');
        }
        
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        
        document.getElementById('submitLoading').classList.remove('visible');
        document.getElementById('btnSubmit').disabled = false;
        
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
    document.getElementById('btnCheckCep').addEventListener('click', checkCEP);
    document.getElementById('cep').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkCEP();
    });
    
    // Step 1: Navegação
    document.getElementById('btnBack1').addEventListener('click', () => goToStep(0));
    document.getElementById('btnNext1').addEventListener('click', () => {
        if (validateStep1()) goToStep(2);
    });
    
    // Step 2: Navegação
    document.getElementById('btnBack2').addEventListener('click', () => goToStep(1));
    document.getElementById('btnNext2').addEventListener('click', () => {
        if (validateStep2()) goToStep(3);
    });
    
    // Step 3: Navegação
    document.getElementById('btnBack3').addEventListener('click', () => goToStep(2));
    document.getElementById('btnNext3').addEventListener('click', () => {
        if (validateStep3()) goToStep(4);
    });
    
    // Step 4: Navegação e Submit
    document.getElementById('btnBack4').addEventListener('click', () => goToStep(3));
    document.getElementById('btnSubmit').addEventListener('click', submitForm);
    
    // LGPD checkbox - habilita/desabilita botão
    document.getElementById('lgpdCheck').addEventListener('change', (e) => {
        document.getElementById('btnSubmit').disabled = !e.target.checked;
        state.lgpdAceito = e.target.checked;
    });
    
    // Addon Conecta+
    document.getElementById('addonConecta').addEventListener('change', (e) => {
        state.addonConecta = e.target.checked;
        updateTotal();
    });
    
    // WhatsApp destino
    document.querySelectorAll('input[name="whatsappDestino"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.whatsappDestino = e.target.value;
        });
    });
    
    // Plan modal
    document.getElementById('btnChangePlan').addEventListener('click', openPlanModal);
    document.getElementById('closePlanModal').addEventListener('click', closePlanModal);
    document.getElementById('planModal').addEventListener('click', (e) => {
        if (e.target.id === 'planModal') closePlanModal();
    });
    
    // Plan selection
    document.querySelectorAll('.plan-option').forEach(option => {
        option.addEventListener('click', () => selectPlan(option));
    });
    
    // Biometria toggle
    document.querySelectorAll('input[name="biometria"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const info = document.getElementById('biometriaInfo');
            if (e.target.value === 'TERCEIRO') {
                info.classList.add('visible');
            } else {
                info.classList.remove('visible');
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
    document.getElementById('btnEditAddress').addEventListener('click', () => {
        document.getElementById('logradouro').focus();
    });
    
    // Plan details button (pode abrir modal de detalhes futuramente)
    document.getElementById('btnPlanDetails').addEventListener('click', () => {
        // Por ora, abre o modal de seleção
        openPlanModal();
    });
}

// ============================================
// FIM DO SCRIPT
// ============================================
console.log('Brisanet Form v1.0 carregado');

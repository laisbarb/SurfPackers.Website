// FrontEnd/script.js

document.addEventListener("DOMContentLoaded", function() {
    
    // --- ELEMENTOS HTML ---
    const beachSelect = document.getElementById('beach-select');
    const forecastContainer = document.getElementById('previsao-tempo-dados');
    // 1. ADICIONADO: O botão que o usuário clica
    const fetchButton = document.getElementById('fetch-live-data-btn');
    const animationContainer = document.querySelector('.container-imagens-viagens');

    // --- FUNÇÃO PRINCIPAL DE BUSCA ---
    async function fetchStormGlassData() {
        if (!beachSelect) return; // Se não houver seletor, não faz nada

        // Lê a seleção atual
        const [lat, lng] = beachSelect.value.split(',');
        const beachName = beachSelect.options[beachSelect.selectedIndex].text;
        
        // Constrói a URL do backend
        const BACKEND_API_URL = `http://localhost:3000/api/waves/conditions?lat=${lat}&lng=${lng}`;

        // Mostra mensagem de carregamento
        forecastContainer.innerHTML = `<p class="loading-message">Carregando condições para **${beachName}**...</p>`; 

        try {
            const response = await fetch(BACKEND_API_URL);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ${response.status} do servidor.`);
            }

            const data = await response.json();
            
            // Pega a previsão mais recente (hora atual)
            const hourData = data.hours[0]; 
            
            // Chama a nova função para renderizar o card
            displayStyledCard(hourData, beachName); 

        } catch (error) {
            console.error("Erro ao carregar dados do mar:", error);
            forecastContainer.innerHTML = `<div class="mensagem-erro">Não foi possível carregar as condições. <br>Tente novamente mais tarde.</div>`;
        }
    }

    // --- 2. FUNÇÃO DE RENDERIZAÇÃO (MODIFICADA) ---
    // Esta função agora cria o HTML do card estilizado
    function displayStyledCard(hourData, beachName) {
        if (!hourData) {
            forecastContainer.innerHTML = '<div class="mensagem-erro">Dados de previsão não disponíveis para este local.</div>';
            return;
        } 

        // Limpa a mensagem de "carregando"
        forecastContainer.innerHTML = '';

        // Funções auxiliares (as mesmas que você já tinha)
        const getValue = (param) => {
            if (!hourData[param]) return 'N/A';
            // Pega a primeira fonte (ex: 'sg', 'noaa')
            const source = Object.keys(hourData[param])[0]; 
            return hourData[param][source];
        };

        const getDirectionText = (degrees) => {
            if (degrees === 'N/A' || degrees === undefined || degrees === null) return 'N/A';
            const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']; 
            const index = Math.round(degrees / 45) % 8; 
            return directions[index]; 
        };

        // Preenche as variáveis com os dados da API
        const waveHeight = getValue('waveHeight').toFixed(1);
        const waveDirection = getDirectionText(getValue('waveDirection'));
        const swellHeight = getValue('swellHeight').toFixed(1);
        const swellPeriod = getValue('swellPeriod').toFixed(1);
        const swellDirection = getDirectionText(getValue('swellDirection'));
        const windSpeed = (getValue('windSpeed') * 3.6).toFixed(0); // m/s para km/h
        const windDirection = getDirectionText(getValue('windDirection'));
        const waterTemp = getValue('waterTemperature').toFixed(0);
        const airTemp = getValue('airTemperature').toFixed(0);

        // Cria o elemento card
        const card = document.createElement('div');
        // Usa a classe que JÁ ESTILIZAMOS no CSS
        card.classList.add('card-previsao'); 

        // Adiciona o HTML do novo card, preenchido com as variáveis
        card.innerHTML = `
            <h3 class="card-titulo-praia">Condições em ${beachName}</h3>
            
            <div class="metricas-wrapper">
                
                <div class="bloco-info-wrapper">
                    <span class="bloco-titulo"><i class="fas fa-water"></i> ONDA</span>
                    <div class="metrica-principal">${waveHeight}m</div>
                    <div class="metrica-detalhe">Dir: ${waveDirection}</div>
                </div>

                <div class="bloco-info-wrapper">
                    <span class="bloco-titulo"><i class="fas fa-wave-square"></i> SWELL</span>
                    <div class="metrica-principal">${swellHeight}m @ ${swellPeriod}s</div>
                    <div class="metrica-detalhe">Dir: ${swellDirection}</div>
                </div>

                <div class="bloco-info-wrapper">
                    <span class="bloco-titulo"><i class="fas fa-wind"></i> VENTO</span>
                    <div class="metrica-principal">${windSpeed} km/h</div>
                    <div class="metrica-detalhe">Dir: ${windDirection}</div>
                </div>

                <div class="bloco-info-wrapper">
                    <span class="bloco-titulo"><i class="fas fa-thermometer-half"></i> TEMPERATURA</span>
                    <div class="metrica-principal">${waterTemp}°C <span class="label-temp">(Água)</span></div>
                    <div class="metrica-detalhe">${airTemp}°C (Ar)</div>
                </div>

            </div>
        `;
        
        forecastContainer.appendChild(card); // Adiciona o card pronto à página
    }

    // --- 3. LISTENERS (GATILHOS) ---

    // Carrega dados da praia padrão (Arpoador) assim que a página carrega
    if (beachSelect) {
        fetchStormGlassData();
    }
    
    // Ouve mudanças no seletor de praia
    if (beachSelect) {
        beachSelect.addEventListener('change', fetchStormGlassData);
    }
    
    // Ouve cliques no botão "Ver Condições"
    if (fetchButton) {
        fetchButton.addEventListener('click', fetchStormGlassData);
    }

    // Intersection Observer (Animação das imagens de viagem)
    if (animationContainer) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2 
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(animationContainer);
    }
});
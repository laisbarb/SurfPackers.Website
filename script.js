// FrontEnd/script.js (Versão 100% Frontend - CORRETA e COMPLETA)

document.addEventListener("DOMContentLoaded", function() {
    
    // --- ELEMENTOS HTML ---
    const beachSelect = document.getElementById('beach-select');
    const forecastContainer = document.getElementById('previsao-tempo-dados');
    const fetchButton = document.getElementById('fetch-live-data-btn');
    const animationContainer = document.querySelector('.container-imagens-viagens');

    // --- FUNÇÃO PRINCIPAL DE BUSCA (Chama API pública) ---
    async function fetchPublicAPIData() {
        // Se os elementos não existirem, não faz nada
        if (!beachSelect || !forecastContainer || !fetchButton) {
            console.error("Elementos da API não encontrados no HTML.");
            return; 
        }

        // Lê a seleção atual
        const [lat, lng] = beachSelect.value.split(',');
        const beachName = beachSelect.options[beachSelect.selectedIndex].text;
        
        // Constrói a URL da API pública (Open-Meteo)
        const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=sea_surface_temperature,wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_period,swell_wave_direction,wind_speed_10m,wind_direction_10m,temperature_2m&timezone=America/Sao_Paulo`;

        forecastContainer.innerHTML = `<p class="loading-message">Carregando condições para ${beachName}...</p>`; 

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`Erro ${response.status} ao buscar dados da API.`);
            }

            const data = await response.json();
            
            // Pega a previsão mais recente (hora atual)
            const currentData = data.current; 
            
            // Chama a função para renderizar o card
            displayStyledCard(currentData, beachName); 

        } catch (error) {
            console.error("Erro ao carregar dados do mar:", error);
            // Esta é a mensagem que você está vendo
            forecastContainer.innerHTML = `<div class="mensagem-erro">Não foi possível carregar as condições.<br>Tente novamente mais tarde.</div>`;
        }
    }

    // --- FUNÇÃO DE RENDERIZAÇÃO (construída para Open-Meteo) ---
    function displayStyledCard(current, beachName) {
        if (!current) {
            forecastContainer.innerHTML = '<div class="mensagem-erro">Dados de previsão não disponíveis para este local.</div>';
            return;
        } 

        forecastContainer.innerHTML = ''; // Limpa o "carregando"

        // Funções auxiliares (específicas para Open-Meteo)
        // Adiciona ?? 'N/A' para caso a API não retorne um valor (null)
        const getValue = (param) => current[param] ?? 'N/A';
        
        const getDirectionText = (degrees) => {
            if (degrees === 'N/A' || degrees === undefined || degrees === null) return 'N/A';
            const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']; 
            const index = Math.round(degrees / 45) % 8; 
            return directions[index]; 
        };

        // Formata o valor, mas só se não for 'N/A'
        const formatValue = (value, decimals = 1) => {
            if (value === 'N/A' || value === null) return 'N/A';
            return value.toFixed(decimals);
        };

        // Preenche as variáveis com os dados da API
        const waveHeight = formatValue(getValue('wave_height'));
        const waveDirection = getDirectionText(getValue('wave_direction'));
        const swellHeight = formatValue(getValue('swell_wave_height'));
        const swellPeriod = formatValue(getValue('swell_wave_period'));
        const swellDirection = getDirectionText(getValue('swell_wave_direction'));
        const windSpeed = formatValue(getValue('wind_speed_10m'), 0); // 0 casas decimais
        const windDirection = getDirectionText(getValue('wind_direction_10m'));
        const waterTemp = formatValue(getValue('sea_surface_temperature'), 0);
        const airTemp = formatValue(getValue('temperature_2m'), 0);

        const card = document.createElement('div');
        card.classList.add('card-previsao'); 

        // Monta o HTML do Card
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
        
        forecastContainer.appendChild(card);
    }

    // --- LISTENERS (GATILHOS) ---

    // Carrega dados da praia padrão (Arpoador) assim que a página carrega
    if (beachSelect) {
        fetchPublicAPIData();
    }
    
    // Ouve mudanças no seletor de praia
    if (beachSelect) {
        beachSelect.addEventListener('change', fetchPublicAPIData);
    }
    
    // Ouve cliques no botão "Ver Condições"
    if (fetchButton) {
        fetchButton.addEventListener('click', fetchPublicAPIData);
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
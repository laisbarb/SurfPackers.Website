document.addEventListener("DOMContentLoaded", function() {
    
    // ELEMENTOS HTML
    const beachSelect = document.getElementById('beach-select');
    const forecastContainer = document.getElementById('previsao-tempo-dados');
    const fetchButton = document.getElementById('fetch-live-data-btn');
    const animationContainer = document.querySelector('.container-imagens-viagens');

    // FUNÇÃO PRINCIPAL DE BUSCA 
    async function fetchPublicAPIData() {
        if (!beachSelect || !forecastContainer || !fetchButton) {
            console.error("Elementos da API não encontrados no HTML.");
            return; 
        }

        const [lat, lng] = beachSelect.value.split(',');
        const beachName = beachSelect.options[beachSelect.selectedIndex].text;
        

        const API_URL = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=sea_surface_temperature,wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_period,swell_wave_direction,wind_speed_10m,wind_direction_10m&timezone=America/Sao_Paulo`;

        forecastContainer.innerHTML = `<p class="loading-message">Carregando condições para ${beachName}...</p>`; 

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                // Se a API falhar (ex: 404), ela agora vai mostrar o erro
                const errorData = await response.json();
                console.error("Erro da API Marine:", errorData);
                throw new Error(errorData.reason || `Erro ${response.status} ao buscar dados.`);
            }

            const data = await response.json();

            const currentData = data.current; 
            
            displayStyledCard(currentData, beachName); 

        } catch (error) {
            console.error("Erro ao carregar dados do mar:", error);

            forecastContainer.innerHTML = `<div class="mensagem-erro">Não foi possível carregar as condições.<br>Detalhe: ${error.message}</div>`;
        }
    }

    function displayStyledCard(current, beachName) {
        if (!current) {
            forecastContainer.innerHTML = '<div class="mensagem-erro">Dados de previsão não disponíveis para este local.</div>';
            return;
        } 

        forecastContainer.innerHTML = ''; // Limpa o "carregando"

        const getValue = (param) => current[param] ?? 'N/A';
        
        const getDirectionText = (degrees) => {
            if (degrees === 'N/A' || degrees === undefined || degrees === null) return 'N/A';
            const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']; 
            const index = Math.round(degrees / 45) % 8; 
            return directions[index]; 
        };

        const formatValue = (value, decimals = 1) => {
            if (value === 'N/A' || value === null) return 'N/A';
            return value.toFixed(decimals);
        };


        const waveHeight = formatValue(getValue('wave_height'));
        const waveDirection = getDirectionText(getValue('wave_direction'));
        const swellHeight = formatValue(getValue('swell_wave_height'));
        const swellPeriod = formatValue(getValue('swell_wave_period'));
        const swellDirection = getDirectionText(getValue('swell_wave_direction'));
        const windSpeed = formatValue(getValue('wind_speed_10m'), 0); 
        const windDirection = getDirectionText(getValue('wind_direction_10m'));
        const waterTemp = formatValue(getValue('sea_surface_temperature'), 0);
        
        
        const airTemp = 'N/A';

        const card = document.createElement('div');
        card.classList.add('card-previsao'); 

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
                    <div class="metrica-detalhe">Ar: ${airTemp}</div>
                </div>
            </div>
        `;
        
        forecastContainer.appendChild(card);
    }

    if (beachSelect) {
        fetchPublicAPIData(); // Carrega dados ao iniciar
        beachSelect.addEventListener('change', fetchPublicAPIData); 
    }
    if (fetchButton) {
        fetchButton.addEventListener('click', fetchPublicAPIData); 
    }

    // ANIMAÇÃO DAS IMAGENS 
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
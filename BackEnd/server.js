
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

app.get('/api/waves/conditions', async (req, res) => {
    

    const { lat, lng } = req.query;
    const LATITUDE = lat || -22.9859; 
    const LONGITUDE = lng || -43.1895;

    const API_KEY = process.env.STORM_GLASS_API_KEY;

    if (!API_KEY) {
        console.error('ERRO CRÍTICO: A chave da API da Storm Glass não foi carregada. Verifique seu arquivo .env');
        return res.status(500).json({ 
            message: 'Erro interno do servidor: Chave de API da Storm Glass não está configurada.' 
        });
    }

    const PARAMS = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,wavePeriod,windDirection,windSpeed,airTemperature,waterTemperature';
    
    const now = new Date();
    const end = new Date(now.getTime() + (1 * 60 * 60 * 1000)); 
    
    const startTimestamp = now.toISOString().split('.')[0] + 'Z';
    const endTimestamp = end.toISOString().split('.')[0] + 'Z';
    const stormGlassUrl = `https://api.stormglass.io/v2/weather/point?lat=${LATITUDE}&lng=${LONGITUDE}&params=${PARAMS}&start=${startTimestamp}&end=${endTimestamp}`;

    try {
        
        const sgResponse = await fetch(stormGlassUrl, {
            headers: {
                'Authorization': API_KEY
            }
        });

    
        if (!sgResponse.ok) {
            const errorData = await sgResponse.json();
            console.error(' ERRO DA API STORM GLASS:', sgResponse.status, errorData); 
            return res.status(sgResponse.status).json({
                message: 'Falha ao buscar dados da Storm Glass. Chave de API Inválida ou Limite Excedido.',
                details: errorData
            });
        }

        const sgData = await sgResponse.json(); 
        res.json(sgData); 

    } catch (error) {
        // Captura erros de rede (ex: servidor da Storm Glass fora do ar)
        console.error('Erro de rede ao conectar à Storm Glass:', error);
        res.status(500).json({ message: 'Erro de conexão com o serviço externo (Storm Glass).', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Node.js do backend rodando em http://localhost:${PORT}`);

    console.log(`API Key da Storm Glass carregada: ${process.env.STORM_GLASS_API_KEY ? 'SIM' : 'NÃO'}`);
});
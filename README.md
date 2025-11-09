SURF PACKERS 



Um site criado para quem ama surf e viagens, com informações em tempo real sobre as condições do mar.

🔗 Acesse o site ao vivo > https://laisbarb.github.io/SurfPackers.Website/

🌎 Sobre o Projeto
O Surf Packers é uma comunidade criada por mim que conecta viajantes solos pelo mundo. 
O site também traz um verificador de ondas em tempo real, além de um blog e guias de viagem. Ele foi desenvolvido do zero — desde o design responsivo até a parte do servidor.

✨ Funcionalidades

Verificador de Ondas: Escolha uma praia e veja dados atualizados sobre altura das ondas, vento, swell e temperatura da água.

Design Responsivo: O layout se adapta bem a qualquer tela — computador, tablet ou celular.

Formulário de Contato: Envio direto de mensagens via Formspree.

Animações Suaves: Efeitos visuais que deixam a navegação mais leve e moderna.

💻 Tecnologias

Frontend: HTML, CSS (Grid, Flexbox, animações) e JavaScript (Fetch API e manipulação do DOM).

Backend (versão local): Node.js e Express.js, com variáveis de ambiente protegendo as chaves de API.

APIs: Open-Meteo (dados públicos) e Stormglass (dados profissionais com chave privada).

🛠️ Como Funciona
O projeto foi criado em dois modos:

Versão Online: Usa apenas a API pública da Open-Meteo, ideal para o deploy no GitHub Pages.

Versão Local (Full-Stack): Usa um servidor Node.js que protege e gerencia as chaves da Stormglass.

📁 Estrutura Simplificada

/SurfPackers.Website/
├── BackEnd/ (Node.js e .env)
├── images/
├── index.html
├── styles.css
└── script.js

# Starter Story - Análise de Estratégias de Divulgação

Sistema completo para extrair e analisar estratégias de marketing e divulgação de produtos a partir de vídeos do canal Starter Story no YouTube, usando a API do Gemini 2.5 Flash-Lite.

## 🎯 O que faz

1. **Extrai transcrições** dos vídeos do Starter Story
2. **Analisa com IA** (Gemini 2.5 Flash-Lite) as estratégias de divulgação utilizadas
3. **Gera relatórios** em markdown com insights sobre marketing
4. **Visualiza em dashboard** com análises consolidadas dos padrões

## 📦 Requisitos

- Node.js v18+
- npm

## 🚀 Instalação Rápida

### 1. Configurar as API Keys

```bash
# Editar .env e adicionar suas chaves:
GEMINI_API_KEY=sua_chave_gemini
YOUTUBE_API_KEY=sua_chave_youtube
```

### 2. Instalar dependências

```bash
npm install
cd web && npm install && cd ..
```

## 📊 Como Usar

### Opção 1: Apenas Análise de Vídeos

Extrair e analisar vídeos do Starter Story:

```bash
# Analisar 1 vídeo (teste)
npm run analyze 1

# Analisar 5 vídeos
npm run analyze 5

# Analisar 15 vídeos
npm run analyze 15

# Analisar 50 vídeos (máximo recomendado)
npm run analyze 50
```

✅ Os resultados são salvos em `./analises_videos/`

### Opção 2: Visualizar no Dashboard

Depois de analisar vídeos, visualizar os resultados em um dashboard interativo:

```bash
# Terminal 1: Iniciar servidor de API
npm run server

# Terminal 2 (em outro terminal): Iniciar React Dev
npm run web:dev
```

Após isso, abra: **http://localhost:3000**

### Opção 3: Executar Tudo de Uma Vez

```bash
# Analisar 10 vídeos e iniciar dashboard
npm run analyze 10 && npm run dev
```

## 🌐 Deploy Online

Seu projeto está pronto pra Vercel! Vercel roda o frontend + API serverless tudo em um lugar.

### Inicio Rápido (3 minutos):

1. **GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
```
Depois crie um repositório em https://github.com/new e faça push

2. **Vercel**:
- Vá em https://vercel.com
- Click "New Project"
- Conecte seu repo do GitHub
- Deploy automático! ✅

📖 **Instruções completas**: Veja [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📁 Estrutura de Deploy

```
starter-story-summarizer/
├── analyze-videos.js          # Script para extrair e analisar vídeos
├── server.js                  # API Node.js para servir dados
├── test.js                    # Script de teste rápido
├── .env                       # Variáveis de ambiente
├── analises_videos/           # Resultados (markdown files)
├── package.json               # Dependências raiz
└── web/                       # Projeto React
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── VideoCard.jsx
    │   │   └── StrategyAnalysis.jsx
    │   ├── App.css
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🎨 Dashboard Features

- **📊 Grade de Vídeos**: Visualize todos os vídeos analisados
- **📈 Análise Consolidada**: 
  - Gráfico de canais mais utilizados
  - Insights principais extraídos
  - Padrões de crescimento
  - Checklist de estratégias
- **🔍 Modal Detalhado**: Clique em um vídeo para ver análise completa

## 📝 O que a IA Analisa

Para cada vídeo, extrai:

1. **Produto/Projeto** - O que está sendo divulgado?
2. **Problema Resolvido** - Qual problema o produto resolve?
3. **Canais de Divulgação** - TikTok, Instagram, Email, YouTube, etc?
4. **Estratégias Principais** - Quais foram as principais táticas?
5. **Tática de Publicação** - Como publicavam conteúdo?
6. **Crescimento** - Números e velocidade de crescimento
7. **Lições Aprendidas** - Key takeaways sobre marketing
8. **Replicável** - Essas estratégias funcionam para outros produtos?

## 🔧 Configuração Avançada

### Filtro de Duração de Vídeos

Por padrão, apenas vídeos com **mais de 10 minutos** são analisados (excluindo Shorts).

Para mudar no `analyze-videos.js`:
```javascript
const isLongFormat = duration > 600; // 600 = 10 minutos
// Mude para qualquer valor desejado (em segundos)
```

### Número de Tentativas em Erro 503

No `analyze-videos.js`, aumentar tentativas de retry:
```javascript
const maxRetries = 3; // Mude para mais tentativas
const retryDelay = 5000; // Espera em ms entre tentativas
```

## 📊 Exemplo de Análise Gerada

```markdown
# Análise de Estratégia de Divulgação

**Vídeo:** How I Built This $160K/Month Gym App
**ID:** OV09yPLf8BI
**Link:** https://www.youtube.com/watch?v=OV09yPLf8BI

---

1. **Produto/Projeto**: Aplicativo de fitness que genera $160K/mês
2. **Canais de Divulgação**: TikTok, Instagram, Email Marketing
3. **Estratégia Principal**: Conteúdo educativo + Community building
...
```

## 💡 Tips

- 🟢 Comece com `npm run analyze 3` para testar
- 🟡 Use `npm run analyze 10-15` para ter uma boa amostra
- 🔴 Acima de 30 vídeos pode demorar bastante
- 💰 Custos do Gemini são baixos (~$0.01 por 1K tokens)

## 🐛 Troubleshooting

### "Cannot find package 'cors'"
```bash
npm install cors express
```

### "YouTube API Key inválida"
1. Verifique se a chave está em `.env`
2. Certifique-se que YouTube Data API v3 está ativada
3. Regenere a chave no Google Cloud Console

### "503 Service Unavailable"
Isso é normal em horários de pico. O script faz retry automaticamente. Espere um pouco e tente novamente.

### "0 vídeos encontrados"
- Verifique YouTube API Key
- Certifique-se que a API está ativada no Google Cloud
- Tente novamente mais tarde

## 📚 Recursos

- [Google Generative AI SDK](https://ai.google.dev/)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [React + Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)

## 📄 Licença

Projeto pessoal para análise educacional de conteúdo público.

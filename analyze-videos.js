import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchTranscript } from "youtube-transcript";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!GEMINI_API_KEY || !YOUTUBE_API_KEY) {
  console.error(
    "❌ GEMINI_API_KEY e YOUTUBE_API_KEY não configuradas no .env"
  );
  process.exit(1);
}

const client = new GoogleGenerativeAI(GEMINI_API_KEY);
const CHANNEL_NAME = "starterstory"; // Nome do canal sem @
const RESULTS_DIR = "./analises_videos";

// Obter número de vídeos do argumento ou usar padrão
const numVideos = parseInt(process.argv[2]) || 50;

if (isNaN(numVideos) || numVideos < 1) {
  console.error("❌ Use: npm run analyze [número_de_vídeos]");
  console.error("   Exemplo: npm run analyze 10");
  process.exit(1);
}

// Função para buscar Channel ID pelo nome
async function getChannelIdByName(channelName) {
  try {
    console.log(`🔍 Buscando Channel ID para: @${channelName}\n`);
    
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: YOUTUBE_API_KEY,
          q: channelName,
          part: "snippet",
          type: "channel",
          maxResults: 1,
        },
      }
    );

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error(`Canal "@${channelName}" não encontrado`);
    }

    const channelId = response.data.items[0].id.channelId;
    const title = response.data.items[0].snippet.title;
    console.log(`✅ Canal encontrado: ${title}`);
    console.log(`   Channel ID: ${channelId}\n`);
    
    return channelId;
  } catch (error) {
    console.error("❌ Erro ao buscar canal:", error.message);
    throw error;
  }
}

// Criar diretório de resultados se não existir
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// Função para obter IDs dos vídeos já analisados
function getExistingVideoIds() {
  if (!fs.existsSync(RESULTS_DIR)) {
    return new Set();
  }
  
  const existingIds = new Set();
  const files = fs.readdirSync(RESULTS_DIR).filter(f => f.endsWith('.md'));
  
  files.forEach(file => {
    const filePath = path.join(RESULTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const idMatch = content.match(/\*\*ID:\*\*\s*(.+)/);
    if (idMatch) {
      existingIds.add(idMatch[1].trim());
    }
  });
  
  return existingIds;
}

async function getChannelVideos(channelId, maxResults = 50) {
  try {
    console.log(`📺 Buscando ${maxResults} vídeos com MAIS de 10 minutos do canal...\n`);
    console.log(`🔍 Parâmetros da busca:`);
    console.log(`   - Channel ID: ${channelId}`);
    console.log(`   - Max Results: ${maxResults}`);
    console.log(`   - Order: date (mais recentes)\n`);

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: YOUTUBE_API_KEY,
          channelId: channelId,
          part: "snippet",
          order: "date",
          maxResults: maxResults * 10, // Buscar muito mais para compensar filtro rigoroso
          type: "video",
        },
      }
    );

    console.log(`✅ Resposta da API recebida`);
    console.log(`   - Total de items: ${response.data.items?.length || 0}\n`);

    if (!response.data.items || response.data.items.length === 0) {
      console.warn(`⚠️  AVISO: A API retornou 0 vídeos!`);
      console.log(`   Possíveis causas:`);
      console.log(`   1. Channel ID incorreto`);
      console.log(`   2. YouTube API Key inválida ou sem permissão`);
      console.log(`   3. Canal não possui vídeos públicos`);
      console.log(`   4. Problema com a API do YouTube\n`);
      return [];
    }

    // Agora filtrar apenas vídeos normais (excluir shorts)
    console.log(`🔍 Verificando duração dos vídeos para excluir Shorts...\n`);
    
    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    
    const detailsResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: YOUTUBE_API_KEY,
          id: videoIds,
          part: "contentDetails",
        },
      }
    );

    // Função para converter ISO 8601 para segundos
    function parseISO8601Duration(duration) {
      const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
      const matches = duration.match(regex);
      
      const hours = parseInt(matches[1]) || 0;
      const minutes = parseInt(matches[2]) || 0;
      const seconds = parseInt(matches[3]) || 0;
      
      return hours * 3600 + minutes * 60 + seconds;
    }

    // Filtrar vídeos que têm mais de 10 minutos
    const videosNormais = response.data.items.filter((item, index) => {
      const videoDetail = detailsResponse.data.items[index];
      if (!videoDetail) return false;
      
      const duration = parseISO8601Duration(videoDetail.contentDetails.duration);
      const isLongFormat = duration > 600; // Mais de 10 minutos
      
      if (!isLongFormat) {
        const minutos = Math.floor(duration / 60);
        const segundos = duration % 60;
        console.log(`   ⏭️  Pulando vídeo curto: ${item.snippet.title} (${minutos}m${segundos}s)`);
      }
      
      return isLongFormat;
    });

    console.log(`\n✅ Filtrado: ${videosNormais.length} vídeos com mais de 10 minutos encontrados\n`);

    return videosNormais.slice(0, maxResults);
  } catch (error) {
    console.error("❌ Erro ao buscar vídeos:", error.message);
    if (error.response?.data) {
      console.error("   Resposta da API:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

async function getTranscriptSafe(videoId) {
  try {
    const transcript = await fetchTranscript(videoId);
    return transcript.map((item) => item.text).join(" ");
  } catch (error) {
    console.warn(`⚠️  Não conseguiu transcrição para ${videoId}: ${error.message}`);
    return null;
  }
}

async function analyzeVideoMarketing(title, transcript) {
  const maxRetries = 3;
  const retryDelay = 5000; // 5 segundos

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = client.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      });

      const prompt = `Você é um especialista em marketing e divulgação de produtos. Analise este vídeo sobre um case de sucesso e extraia as estratégias de divulgação/marketing utilizadas.

TÍTULO: ${title}

TRANSCRIÇÃO:
---
${transcript}
---

Por favor, forneça uma análise estruturada com:

1. **Produto/Projeto**: Qual é o produto/projeto mencionado?
2. **Problema Resolvido**: Qual problema o produto resolve?
3. **Canais de Divulgação**: Quais canais foram usados para divulgar? (redes sociais, email, partnerships, etc)
4. **Estratégias de Marketing Principais**: Quais foram as principais estratégias?
5. **Tática de Publicação**: Como publicavam conteúdo? (frequência, tipo de conteúdo, etc)
6. **Crescimento**: Como foi o crescimento inicial? (números se mencionados)
7. **Lições Aprendidas**: Quais foram as principais lições sobre divulgação?
8. **Replicável**: Essas estratégias são replicáveis para outros produtos?

Seja conciso mas detalhado.`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      const is503 = error.message && error.message.includes("503");
      
      if (is503 && attempt < maxRetries) {
        console.log(`  ⚠️  Erro 503 - Tentativa ${attempt}/${maxRetries}. Aguardando 5 segundos...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }
      
      throw error;
    }
  }
}

async function main() {
  try {
    console.log("🚀 Iniciando análise de vídeos do Starter Story\n");
    console.log("=".repeat(60) + "\n");

    // Obter Channel ID
    const CHANNEL_ID = await getChannelIdByName(CHANNEL_NAME);

    // Obter vídeos
    const videos = await getChannelVideos(CHANNEL_ID, numVideos);
    console.log(`✅ Encontrados ${videos.length} vídeos\n`);

    // Obter IDs dos vídeos já analisados
    const existingIds = getExistingVideoIds();
    console.log(`📊 Vídeos já analisados: ${existingIds.size}`);
    console.log(`📍 Buscando novos vídeos...\n`);

    let processados = 0;
    let erros = 0;
    let pulados = 0;

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const videoId = video.id.videoId;
      const title = video.snippet.title;
      const publishedAt = video.snippet.publishedAt;

      // Verificar se já foi analisado
      if (existingIds.has(videoId)) {
        console.log(`\n[${i + 1}/${videos.length}] ⏭️  PULANDO: ${title}`);
        console.log(`   ✅ Já foi analisado anteriormente`);
        pulados++;
        continue;
      }

      console.log(`\n[${i + 1}/${videos.length}] Processando: ${title}`);
      console.log(`ID: ${videoId}`);
      console.log(`Publicado: ${publishedAt}`);

      try {
        // Obter transcrição
        console.log("  ⏳ Extraindo transcrição...");
        const transcript = await getTranscriptSafe(videoId);

        if (!transcript) {
          console.log("  ⚠️  Pulando (sem transcrição disponível)");
          erros++;
          continue;
        }

        console.log(`  ✅ Transcrição obtida (${transcript.length} caracteres)`);

        // Analisar com Gemini
        console.log("  🤖 Analisando com Gemini...");
        const analise = await analyzeVideoMarketing(title, transcript);

        // Salvar resultado
        const fileName = `${processados + 1 + pulados}_${title.substring(0, 50).replace(/[/\\?*:|"<>]/g, "_")}.md`;
        const filePath = path.join(RESULTS_DIR, fileName);

        const conteudo = `# Análise de Estratégia de Divulgação

**Vídeo:** ${title}  
**ID:** ${videoId}  
**Link:** https://www.youtube.com/watch?v=${videoId}  
**Publicado:** ${publishedAt}

---

${analise}
`;

        fs.writeFileSync(filePath, conteudo);
        console.log(`  💾 Salvo em: ${fileName}`);
        processados++;

        // Rate limiting (1 segundo entre requisições)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ❌ Erro: ${error.message}`);
        erros++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(
      `\n✨ Análise concluída!\n📊 Novos processados: ${processados}, Pulados: ${pulados}, Erros: ${erros}`
    );
    console.log(`📁 Resultados salvos em: ./${RESULTS_DIR}/\n`);
  } catch (error) {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  }
}

main();

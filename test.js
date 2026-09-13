import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchTranscript } from "youtube-transcript";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY não configurada no .env");
  process.exit(1);
}

const client = new GoogleGenerativeAI(apiKey);

// Extrair video ID da URL do YouTube
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function testYouTubeTranscript() {
  try {
    console.log("🚀 Teste: Extrair transcrição + Resumir com Gemini\n");

    const youtubeUrl = "https://www.youtube.com/watch?v=W5F03pLjZCs";
    console.log(`📹 URL do vídeo: ${youtubeUrl}\n`);

    // Extrair video ID
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      console.error("❌ Erro: URL inválida");
      process.exit(1);
    }

    // Obter transcrição
    console.log("⏳ Extraindo transcrição do YouTube...\n");
    const transcript = await fetchTranscript(videoId);
    const transcriptText = transcript.map((item) => item.text).join(" ");

    console.log("✅ Transcrição extraída com sucesso!\n");
    console.log(`📊 Tamanho: ${transcriptText.length} caracteres\n`);

    // Enviar para Gemini resumir
    console.log("🤖 Enviando para o Gemini resumir...\n");

    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const resumePrompt = `Aqui está a transcrição de um vídeo do YouTube. Por favor, faça um resumo conciso do assunto principal:

---
${transcriptText}
---

Resuma o conteúdo de forma clara e estruturada.`;

    const result = await model.generateContent(resumePrompt);
    const response = result.response;

    console.log("📝 Resumo do Gemini:\n");
    console.log(response.text());
    console.log("\n✨ Teste concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro:", error.message);
    process.exit(1);
  }
}

testYouTubeTranscript();

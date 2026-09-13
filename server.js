import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3001;
const ANALYSES_DIR = './analises_videos';

app.use(cors());
app.use(express.json());

// Rota para obter todos os vídeos analisados
app.get('/api/videos', (req, res) => {
  try {
    if (!fs.existsSync(ANALYSES_DIR)) {
      return res.json([]);
    }

    const files = fs.readdirSync(ANALYSES_DIR).filter(f => f.endsWith('.md'));
    
    const videos = files.map((file, index) => {
      const filePath = path.join(ANALYSES_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Parse do arquivo markdown
      const titleMatch = content.match(/\*\*Vídeo:\*\*\s*(.+)/);
      const idMatch = content.match(/\*\*ID:\*\*\s*(.+)/);
      const linkMatch = content.match(/\*\*Link:\*\*\s*\[(.+?)\]\(https:\/\/www\.youtube\.com\/watch\?v=([^)]+)\)/);
      const dateMatch = content.match(/\*\*Publicado:\*\*\s*(.+)/);
      
      const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '');
      const videoId = idMatch ? idMatch[1].trim() : 'unknown';
      const publishedAt = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
      
      // Extrair a análise (conteúdo após a primeira linha de ----)
      const analysisMatch = content.match(/---\n\n([\s\S]*)/);
      const analysis = analysisMatch ? analysisMatch[1].trim() : content;
      
      return {
        id: index,
        title,
        videoId,
        publishedAt,
        analysis,
        fileName: file
      };
    });

    res.json(videos);
  } catch (error) {
    console.error('Erro ao ler análises:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter um vídeo específico
app.get('/api/videos/:id', (req, res) => {
  try {
    const files = fs.readdirSync(ANALYSES_DIR).filter(f => f.endsWith('.md'));
    const file = files[parseInt(req.params.id)];
    
    if (!file) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const filePath = path.join(ANALYSES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api/videos\n`);
});

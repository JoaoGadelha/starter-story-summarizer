import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ANALYSES_DIR = path.join(process.cwd(), 'analises_videos');

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (!fs.existsSync(ANALYSES_DIR)) {
      return res.status(200).json([]);
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

    res.status(200).json(videos);
  } catch (error) {
    console.error('Erro ao ler análises:', error);
    res.status(500).json({ error: error.message });
  }
}

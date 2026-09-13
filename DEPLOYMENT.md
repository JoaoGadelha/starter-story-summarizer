# DEPLOYMENT.md

# 🚀 Deploy no Vercel

## Pré-requisitos

1. Conta no GitHub
2. Conta no Vercel (grátis em https://vercel.com)
3. Git instalado localmente

## Passo 1: Preparar Git e GitHub

```bash
# Inicializar repositório Git (se não tiver)
cd d:\projetos\starter-story-summarizer
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit: Starter Story Analyzer"

# Criar repositório no GitHub
# 1. Vá em https://github.com/new
# 2. Nome: "starter-story-summarizer"
# 3. Copie a URL do repositório
```

## Passo 2: Conectar GitHub

```bash
# Adicionar origem remota (substitua USERNAME)
git remote add origin https://github.com/USERNAME/starter-story-summarizer.git

# Fazer push inicial
git branch -M main
git push -u origin main
```

## Passo 3: Deploy no Vercel

### Opção A: Via Interface Vercel (Mais Fácil)

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione seu repositório no GitHub
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Adicione variáveis de ambiente:
   - `VITE_API_URL` = `https://seu-dominio.vercel.app/api`
6. Clique em "Deploy"

### Opção B: Via CLI Vercel

```bash
# Instalar CLI Vercel
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

## Passo 4: Configurar Variáveis de Ambiente

**No Vercel Dashboard:**

1. Vá em: Project Settings → Environment Variables
2. Adicione:
   - `VITE_API_URL` = `https://seu-dominio.vercel.app/api`

**Localmente (para desenvolvimento):**

Crie `web/.env.local`:
```
VITE_API_URL=http://localhost:3001/api
```

## Passo 5: Atualizar Frontend pra API

O frontend já foi configurado para usar a variável de ambiente. Ele vai procurar a API em:
- Desenvolvimento: `http://localhost:3001/api`
- Produção: `https://seu-dominio.vercel.app/api`

## Passo 6: Upload de Análises

**Importante**: Você precisa fazer upload dos arquivos `analises_videos/*.md` para o Vercel ou eles não aparecerão no site.

**Opção 1**: Git (Recomendado)
```bash
# Adicionar pasta de análises
git add analises_videos/
git commit -m "Add analyzed videos"
git push
# Vercel vai redeploy automaticamente
```

**Opção 2**: Diretório estático
1. Crie pasta pública no Vercel e coloque lá
2. Configure em `vercel.json`

## Passo 7: Acompanhar Deploy

1. Vá em https://vercel.com/dashboard
2. Selecione seu projeto
3. Veja o histórico de deployments em "Deployments"
4. URL do site estará em "Domains"

## URLs Após Deploy

- **Frontend**: `https://seu-dominio.vercel.app`
- **API**: `https://seu-dominio.vercel.app/api/videos`

## Troubleshooting

### "Failed to fetch from API"
- Verifique se `VITE_API_URL` está correto
- Certifique-se que `api/videos.js` existe no repositório
- Veja logs em: Project Settings → Functions

### "Module not found"
- Certifique-se que dependências estão no `package.json` (raiz e web/)
- Rodou `npm install` localmente antes de fazer push?

### "Build failed"
- Veja logs completos no Vercel Dashboard
- Certifique-se que `web/` tem seu próprio `package.json`

## Atualizações Futuras

```bash
# Fazer alterações localmente
# Committar
git add .
git commit -m "Describe changes"

# Fazer push
git push

# Vercel faz redeploy automaticamente!
```

## Remover Análises Antigas

Se quiser remover as análises do Git (porque são muitos arquivos):

```bash
# Adicionar ao .gitignore
echo "analises_videos/" >> .gitignore

# Remover do Git mas manter localmente
git rm -r --cached analises_videos/

# Commit
git commit -m "Remove analyzed videos from repo"
git push
```

Depois coloque manualmente os arquivos via SFTP ou outro método no servidor.

---

**Pronto!** Seu projeto está online! 🎉

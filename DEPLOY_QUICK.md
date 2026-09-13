# 🚀 Deploy Rápido (5 minutos)

## 1. GitHub Setup

```bash
git init
git add .
git commit -m "Starter Story Analyzer"
```

Depois em https://github.com/new crie um repo, e volte e rode:

```bash
git remote add origin https://github.com/SEU_USER/starter-story-summarizer.git
git branch -M main
git push -u origin main
```

## 2. Vercel Deploy

1. Acesse https://vercel.com
2. Clique "New Project"
3. Conecte seu GitHub
4. Selecione `starter-story-summarizer`
5. Pronto! Deploy automático!

## 3. Configurar Variáveis

No Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_URL = https://seu-dominio.vercel.app/api
```

## ✅ Pronto!

- Frontend: `https://seu-dominio.vercel.app`
- API: `https://seu-dominio.vercel.app/api/videos`

## 📝 Próximas análises

```bash
# Local
npm run analyze 10

# Commit e push
git add analises_videos/
git commit -m "Add new video analyses"
git push

# Vercel redeploy automático!
```

---

Ver [DEPLOYMENT.md](DEPLOYMENT.md) pra mais detalhes e troubleshooting.

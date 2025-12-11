# 🚀 Deploy Instructions - V2 (Railway + Netlify)

## 1️⃣ Deploy Backend (Go) → Railway

### Pré-requisitos
- Conta no [Railway.app](https://railway.app)
- CLI do Railway: `npm i -g @railway/cli`

### Passos

```bash
# 1. Logar no Railway
railway login

# 2. Na pasta /backend/rosamexicano-reservas-v2/backend
cd /home/guigo/Starken/rosamexicano-reservas-v2/backend

# 3. Iniciar novo projeto no Railway
railway init

# 4. Configurar variáveis de ambiente (Railway Dashboard)
# Adicione:
DATABASE_URL=postgresql://...  # Sua DB PostgreSQL
JWT_ACCESS_SECRET=seu-secret-32-bytes
JWT_REFRESH_SECRET=seu-secret-32-bytes
ENCRYPTION_KEY=sua-chave-32-bytes
ASAAS_API_URL=https://api.asaas.com/v3
ASAAS_API_KEY=sua-chave-asaas
ASAAS_WEBHOOK_SECRET=seu-webhook-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-app-password
FRONTEND_URL=https://rosamexicano.netlify.app
PORT=8080
GIN_MODE=release

# 5. Deploy
railway up

# 6. Obter URL da API (será algo como)
# https://rosamexicano-api.railway.app
```

**✅ Salve a URL do Railway API para usar no frontend!**

---

## 2️⃣ Deploy Frontend (React) → Netlify

### Pré-requisitos
- Conta no [Netlify](https://netlify.com)
- CLI do Netlify: `npm i -g netlify-cli`

### Passos

```bash
# 1. Logar no Netlify
netlify login

# 2. Na pasta /frontend
cd /home/guigo/Starken/rosamexicano-reservas-v2/frontend

# 3. Criar arquivo .env com URL do Railway
echo "VITE_API_URL=https://rosamexicano-api.railway.app" > .env

# 4. Deploy
netlify deploy --prod

# Ou: Conectar ao repositório GitHub para auto-deploy
netlify init
```

### Configurar variáveis no Netlify Dashboard
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment variable**:
  - `VITE_API_URL` = `https://rosamexicano-api.railway.app`

**✅ Frontend estará em https://rosamexicano.netlify.app**

---

## 3️⃣ Sincronização V1 ↔ V2

Quando você **modifica algo em v1**:

```bash
# 1. Edita arquivo em v1
# /home/guigo/Starken/rosamexicano/rosamexicano-reservas/...

# 2. Edita o arquivo equivalente em v2
# /home/guigo/Starken/rosamexicano-reservas-v2/...

# 3. Commit/push apenas v1
cd /home/guigo/Starken/rosamexicano/rosamexicano-reservas
git add .
git commit -m "feature: descrição"
git push origin main

# 4. (Opcional) Triggerar rebuild manual no Railway/Netlify
# Railway: `railway up` na pasta /backend
# Netlify: `netlify deploy --prod` na pasta /frontend
```

---

## 4️⃣ Variáveis Críticas

### Backend (Railway)
```
DATABASE_URL          → PostgreSQL conexão
JWT_ACCESS_SECRET     → 32 bytes hex (openssl rand -hex 32)
ASAAS_API_KEY         → Token Asaas produção
FRONTEND_URL          → https://rosamexicano.netlify.app
```

### Frontend (Netlify)
```
VITE_API_URL          → https://rosamexicano-api.railway.app
```

### V1 (Netlify - sem mudanças)
```
DATABASE_URL          → Mesmo PostgreSQL
ASAAS_API_KEY         → Mesmo token
```

---

## 5️⃣ Checklist de Deploy

- [ ] Criar conta Railway.app
- [ ] Criar conta Netlify (ou já tem?)
- [ ] Deploy backend Go → Railway
- [ ] Obter URL da API Railway
- [ ] Deploy frontend React → Netlify com VITE_API_URL
- [ ] Testar fluxo: Landing → Form → Payment → Voucher
- [ ] Verificar logs (Railway Dashboard + Netlify Logs)
- [ ] Configurar domínios customizados (opcional)

---

## 6️⃣ Troubleshooting

### "Dockerfile not found"
```bash
# Railway não achou o Dockerfile
# Solução: Verificar se está em /backend/Dockerfile
ls -la /home/guigo/Starken/rosamexicano-reservas-v2/backend/Dockerfile
```

### "VITE_API_URL is undefined"
```bash
# Frontend não tá recebendo variável de env
# Solução: Adicionar no Netlify Dashboard → Site settings → Build & deploy → Environment
VITE_API_URL = https://rosamexicano-api.railway.app
```

### "Connection refused to Railway API"
```bash
# Frontend tá tentando conectar em localhost em vez de Railway
# Solução: Verificar vite.config.ts e .env
VITE_API_URL deve apontar para Railway, não localhost
```

---

## 📞 Suporte

Se algo não funcionar:
1. Verificar logs no Railway Dashboard
2. Verificar logs no Netlify Logs
3. Testar conexão: `curl https://rosamexicano-api.railway.app/health`
4. Verificar CORS headers: `curl -I -H "Origin: https://rosamexicano.netlify.app" https://rosamexicano-api.railway.app`

---

**Status**: ✅ Pronto para deploy!

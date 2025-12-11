# ⚡ Netlify Integration - Guia Rápido

---

## 1️⃣ Acessar Netlify

1. Vá em https://netlify.com
2. Faça login com GitHub
3. Clique em "Add new site" > "Import an existing project"
4. Selecione o repositório: **rosamexicano-reservas-frontend**

---

## 2️⃣ Configurar Build (Automático)

Netlify vai detectar automaticamente:
- **Build command:** `npm run build`
- **Publish directory:** `dist`

Se não detectar, configure manualmente.

---

## 3️⃣ Configurar Variáveis de Ambiente

1. No Netlify, vá em **Site settings** > **Build & deploy** > **Environment**
2. Clique em **Add environment variables**

### Adicione estas 2 variáveis:

```
VITE_API_URL=https://seu-backend-railway-url.up.railway.app/api
VITE_SITE_URL=https://rosamexicano.com
```

**Importante:** Copie a URL correta do seu backend no Railway!

---

## 4️⃣ Deploy Automático

Pronto! Netlify vai:
1. ✅ Detectar push no GitHub automaticamente
2. ✅ Fazer npm install
3. ✅ Fazer npm run build
4. ✅ Colocar no ar em `https://seunome.netlify.app`

---

## 5️⃣ Fluxo Completo:

```
Você faz push no GitHub (frontend repo)
        ↓
Netlify detecta automaticamente
        ↓
Netlify roda: npm install
        ↓
Netlify roda: npm run build
        ↓
Netlify publica a pasta 'dist'
        ↓
Frontend fica LIVE em https://seu-site.netlify.app 🟢
        ↓
Frontend se conecta ao backend no Railway
```

---

## 6️⃣ Resumo do que Fazer AGORA:

### Na Netlify:
1. **Conectar repositório frontend** (rosamexicano-reservas-frontend)
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. **Variáveis:**
   ```
   VITE_API_URL=https://seu-backend-railway.up.railway.app/api
   VITE_SITE_URL=https://rosamexicano.com
   ```
5. **Deploy automático**

### No GitHub:
```bash
# Quando tudo estiver pronto:
git push origin main

# Netlify faz o deploy sozinho!
```

---

## ✅ Pronto!

Seu site estará live em:
```
https://rosamexicano.netlify.app
```

E conectado ao backend no Railway! 🚀

---

## 🆘 Se Algo Não Funcionar

1. **Veja os logs:** Netlify > Deploys > Deploy log
2. **Verifique VITE_API_URL:** Deve estar correto
3. **Teste a conexão:**
   - Abra o site
   - Abra DevTools (F12)
   - Vá em Console
   - Veja se há erros de conexão com API

---

**É isso! Quando fizer push, Netlify redeploya automaticamente! 🎉**

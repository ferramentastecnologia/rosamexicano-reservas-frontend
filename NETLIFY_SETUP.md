# 🚀 Netlify Setup - Rosa Mexicano Frontend

Guia passo-a-passo para configurar o frontend no Netlify.

---

## 1️⃣ Conectar ao Netlify

1. Acesse [netlify.com](https://netlify.com)
2. Clique em "Add new site" > "Import an existing project"
3. Selecione GitHub e conecte o repositório `rosamexicano-reservas-frontend`

---

## 2️⃣ Configurar Build Settings

Na tela de configuração:

**Build command:**
```bash
npm run build
```

**Publish directory:**
```
dist
```

---

## 3️⃣ Configurar Variáveis de Ambiente

Clique em "Site settings" > "Build & deploy" > "Environment":

### Variáveis Necessárias:

```
VITE_API_URL=https://rosamexicano-api-production.up.railway.app/api
VITE_SITE_URL=https://rosamexicano.com
```

**Nota:** Mude a URL da API quando o backend estiver pronto no Railway.

---

## 4️⃣ Configurar Domínio Customizado (Opcional)

1. Vá para "Site settings" > "Domain management"
2. Clique em "Add custom domain"
3. Adicione seu domínio (ex: `rosamexicano.com`)
4. Siga as instruções para configurar DNS

---

## 5️⃣ Deploy

1. Ao conectar o repositório, Netlify faz o primeiro deploy automaticamente
2. Futuros deploys acontecem automaticamente a cada push no GitHub
3. Acompanhe em "Deploys" para ver o progresso

---

## ✅ Checklist Final

- [ ] Repositório GitHub conectado
- [ ] Build command configurado (`npm run build`)
- [ ] Publish directory configurado (`dist`)
- [ ] `VITE_API_URL` apontando para o Railway
- [ ] Primeiro deploy realizado com sucesso
- [ ] Site acessível via URL Netlify
- [ ] Domínio customizado configurado (opcional)

---

## 🧪 Testes Após Deploy

1. Acesse a URL do Netlify
2. Verifique se a página carrega
3. Teste o formulário de reserva
4. Verifique conexão com API (deve conectar ao Railway)

---

## 🆘 Troubleshooting

### Erro: Build falha
- Verifique logs em "Deploys" > "Deploy log"
- Certifique-se de que `npm install` funciona localmente
- Confira versão do Node.js

### Erro: API retorna erro
- Verifique se `VITE_API_URL` está correto
- Certifique-se de que backend está rodando no Railway
- Verifique CORS no backend

### Site em branco
- Abra o DevTools (F12) e veja console de erros
- Verifique se há erros de conexão com API

---

## 📝 Notas Importantes

- Netlify oferece SSL automático
- Deploy é grátis com repositório público
- Acompanhe uso de banda (limite gratuito: 100 GB/mês)
- Logs disponíveis em "Deploys"

---

**Status:** Pronto para conectar! 🚀

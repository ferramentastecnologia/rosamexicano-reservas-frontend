# Rosa Mexicano - Frontend

Frontend React para o sistema de reservas do restaurante Rosa Mexicano.

**Stack:** React + TypeScript + Vite + Tailwind CSS | **Deploy:** Netlify

---

## 🚀 Quick Start

### Requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com a URL da API
nano .env
```

### Execução

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

Frontend estará disponível em: **http://localhost:3000**

---

## 📝 Configuração

### Variáveis de Ambiente (`.env`)

```bash
VITE_API_URL=http://localhost:8080/api
```

---

## 📁 Estrutura do Projeto

```
src/
├── pages/              # Páginas (Landing, Pagamento, Admin, etc)
├── components/         # Componentes reutilizáveis
├── services/           # Cliente HTTP (Axios)
├── context/            # State management (Auth, etc)
├── hooks/              # Custom React hooks
├── lib/                # Utilitários
├── types/              # TypeScript types
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

---

## 🎨 Páginas Principais

| Rota | Descrição | Autenticação |
|------|-----------|--------------|
| `/` | Landing page + formulário de reserva | Não |
| `/pagamento` | Página de pagamento (QR Code PIX) | Não |
| `/sucesso` | Confirmação de reserva + voucher | Não |
| `/admin` | Login | Não |
| `/admin/dashboard` | Dashboard com stats | Sim |
| `/admin/reservations` | Lista de reservas | Sim |
| `/admin/validar-voucher` | Validação de vouchers | Sim |
| `/admin/tables` | Ocupação de mesas | Sim |
| `/admin/users` | Gerenciamento de usuários | Sim |
| `/admin/reports` | Relatórios | Sim |

---

## 💻 Tech Stack

| Componente | Tecnologia | Versão |
|-----------|-----------|--------|
| **Framework** | React | 19.2.0 |
| **Build Tool** | Vite | v6.0.3 |
| **Language** | TypeScript | v5.6.2 |
| **Routing** | React Router | v6.22.0 |
| **HTTP Client** | Axios | v1.6.7 |
| **Forms** | React Hook Form | v7.66.0 |
| **Validation** | Zod | v4.1.12 |
| **Styling** | Tailwind CSS | v4.0.0 |
| **Animations** | Framer Motion | v11.15.0 |
| **Icons** | Lucide React | v0.553.0 |
| **Shaders** | @paper-design/shaders-react | v0.0.37 |

---

## 🔐 Segurança

- ✅ XSS protection (DOMPurify)
- ✅ JWT token handling
- ✅ HTTPS em produção
- ✅ Environment variables para dados sensíveis

---

## 🚀 Deployment (Netlify)

1. Criar conta em [netlify.com](https://netlify.com)
2. Conectar repositório
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Adicionar variáveis de ambiente
6. Deploy automático

---

## 📞 Suporte

Para questões de integração com o backend, veja o repositório [rosamexicano-reservas-backend](https://github.com/ferramentastecnologia/rosamexicano-reservas-backend)

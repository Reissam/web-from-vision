# 🚀 Guia de Deploy - Sistema de Chamados

## 📋 Pré-requisitos
- Conta no GitHub
- Projeto no Supabase configurado
- Código funcionando localmente

---

## 🎯 Vercel (Recomendado)

### 1. **Preparar o repositório**
```bash
# Adicionar ao .gitignore
.env.local
.env.production
```

### 2. **Fazer push para GitHub**
```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 3. **Deploy no Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione seu repositório
5. Configure as variáveis de ambiente:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

6. Clique em "Deploy"

### 4. **URL do projeto**
- `https://seu-projeto.vercel.app`

---

## 🌐 Netlify

### 1. **Deploy automático**
1. Acesse [netlify.com](https://netlify.com)
2. Faça login com GitHub
3. Clique em "New site from Git"
4. Selecione seu repositório
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 2. **Variáveis de ambiente**
- Vá em Site settings → Environment variables
- Adicione as mesmas variáveis do Vercel

---

## 🚂 Railway

### 1. **Deploy full-stack**
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Configure as variáveis de ambiente

### 2. **Vantagens**
- Banco PostgreSQL incluído
- Deploy full-stack
- $5 de crédito mensal (praticamente gratuito)

---

## 📱 GitHub Pages

### 1. **Configurar deploy**
1. Vá em Settings do repositório
2. Pages → Source: GitHub Actions
3. Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

---

## 🔧 Configurações Importantes

### **Variáveis de Ambiente**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### **Domínio Personalizado**
- Vercel: Settings → Domains
- Netlify: Site settings → Domain management
- GitHub Pages: Settings → Pages

### **SSL/HTTPS**
- ✅ Automático no Vercel
- ✅ Automático no Netlify
- ✅ Automático no Railway
- ✅ Automático no GitHub Pages

---

## 🎉 URLs de Exemplo

- **Vercel:** `https://sistema-chamados.vercel.app`
- **Netlify:** `https://sistema-chamados.netlify.app`
- **Railway:** `https://sistema-chamados.railway.app`
- **GitHub Pages:** `https://seu-usuario.github.io/seu-repo`

---

## 🚨 Troubleshooting

### **Erro de build**
```bash
# Verificar se build funciona localmente
npm run build
```

### **Variáveis de ambiente**
- Verificar se estão configuradas corretamente
- Reiniciar deploy após alterações

### **CORS/API**
- Supabase já está configurado para produção
- Não precisa de configurações adicionais

---

## 📞 Suporte

- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **Netlify:** [netlify.com/support](https://netlify.com/support)
- **Railway:** [railway.app/docs](https://railway.app/docs)
- **GitHub:** [docs.github.com](https://docs.github.com) 
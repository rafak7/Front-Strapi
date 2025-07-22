# Gerenciador de Campanhas - Frontend

Este é um projeto Next.js para gerenciar campanhas de financiamento coletivo, conectado a uma API Strapi.

## 🚀 Funcionalidades Recriadas

- ✅ **Visualização de Campanhas**: Lista todas as campanhas em cards organizados
- ✅ **Criação de Campanhas**: Formulário modal para criar novas campanhas
- ✅ **Edição de Campanhas**: Editar campanhas existentes
- ✅ **Exclusão de Campanhas**: Remover campanhas com confirmação
- ✅ **Estados de Loading**: Indicadores visuais de carregamento
- ✅ **Tratamento de Erros**: Mensagens de erro claras
- ✅ **Interface Responsiva**: Design adaptável para diferentes telas

## 🛠️ Tecnologias

- **Next.js 15.4.2** - Framework React
- **React 19.1.0** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Strapi** - API backend (deve estar rodando separadamente)

## 📁 Estrutura do Projeto Recriada

```
src/
├── app/
│   ├── layout.js          # Layout raiz do Next.js
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globais
├── components/
│   ├── CampaignCard/      # Componente de card da campanha
│   ├── CampaignForm/      # Formulário modal de campanha
│   ├── CampaignList/      # Lista de campanhas
│   └── Layout/            # Layout principal da aplicação
├── services/
│   └── campaignApi.ts     # Serviços de API para campanhas
└── types/
    └── campaign.ts        # Tipos TypeScript para campanhas
```

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variável de ambiente:**
   - A API Strapi deve estar rodando em `http://localhost:1337`
   - Se estiver em outra URL, defina `NEXT_PUBLIC_STRAPI_API_URL` no arquivo `.env.local`

3. **Executar o projeto:**
   ```bash
   npm run dev
   ```

4. **Acessar:** http://localhost:3000

## 🔗 Integração com Strapi

O projeto espera uma API Strapi com:

- **Endpoint:** `/api/campanhas`
- **Campos obrigatórios:**
  - `nome_campanha` (string)
  - `descricao_campanha` (string)  
  - `status_campanha` (string)
  - `data_campanha` (date)

## 📝 Comandos Disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Fazer build para produção
- `npm run start` - Executar build de produção
- `npm run lint` - Executar linter

## 🎨 Interface

A interface inclui:

- **Header** com título e botão "Nova Campanha"
- **Dashboard** com contador de campanhas e botão atualizar
- **Grid de Cards** responsivo (1 coluna mobile, 2 tablet, 3 desktop)
- **Modal de Formulário** para criar/editar campanhas
- **Estados visuais** para loading, erro e lista vazia

## 🔧 Configuração da API

Por padrão, a aplicação tenta se conectar com `http://localhost:1337/api`. Para alterar:

1. Crie um arquivo `.env.local`
2. Defina: `NEXT_PUBLIC_STRAPI_API_URL=sua_url_aqui`

---

**Nota:** Este projeto foi recriado após corrupção dos arquivos. Todos os componentes foram restaurados conforme a especificação original.

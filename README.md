Syncro – App de Chat em tempo real


Syncro é um aplicativo de mensagens desenvolvido em React Native com backend em Supabase, que permite comunicação entre usuários por meio de chats em tempo real e grupos.

Funcionalidades
- Cadastro e login de usuários com autenticação do Supabase

- Chats em tempo real com atualização instantânea

- Envio de mensagens privadas e criação de grupos

- Adição de contatos

- Tela de perfil do usuário

 Estrutura do Projeto


app_syncro_smartweb/
├── src/
│   ├── assets/              # Imagens, ícones, etc.
│   ├── component/           # Componentes reutilizáveis
│   ├── features/            # Lógicas específicas, hooks, contextos
│   ├── routes/              # Configurações de navegação (React Navigation)
│   │   └── Routes.js
│   └── screens/             # Telas principais
│       ├── AddContato.js
│       ├── Cadastro.js
│       ├── Chat.js
│       ├── Conversas.js
│       ├── CriarGrupo.js
│       ├── Login.js
│       └── Perfil.js
├── App.js                   # Arquivo principal
└── .gitignore


Tecnologias Utilizadas

React Native

Expo

Supabase

React Navigation

JavaScript

 Instalação e Execução

Clone o repositório:


git clone https://github.com/seu-usuario/app_syncro_smartweb.git
cd app_syncro_smartweb



Instale as dependências:


npm install

# ou

yarn



Configure o Supabase:

Crie um projeto em https://supabase.com
Copie sua SUPABASE_URL e SUPABASE_ANON_KEY

Crie um arquivo supabaseConfig.js com:

js
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient('SUA_SUPABASE_URL', 'SUA_SUPABASE_ANON_KEY');



Inicie o app:


npx expo start --tunnel

# EloHabits

[![CI](https://github.com/jomasii/EloHabits/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/jomasii/EloHabits/actions/workflows/ci.yml)

> O elo que mantém sua rotina: rastreador de hábitos baseado em compromisso mútuo onde a sequência só avança se a dupla cumprir a meta.

## Descrição do Projeto
Aplicação de gerenciamento de hábitos, desenvolvido para a disciplina de Processos de Software (DIM0510), ministrada pelo professor Dr. Fernando Marques Figueira, no curso de Bacharelado em Engenharia de Software da Universidade Federal do Rio Grande do Norte (UFRN).

---
## Equipe

| Integrante | Matrícula | Usuário Github |
| :--- | :--- | :--- |
| João Marcos Silva Fernandes de Freitas | 20230052103 | [Jomasii](https://github.com/jomasii) |

---

## Informações Adicionais

* **Coorte de apresentação:** B 
* **Integração com outras matérias:** N/A
* **Link do quadro no GitHub Projects:** [EloHabits Kanban](https://github.com/users/jomasii/projects/2)


---

## Como rodar

Pré-requisitos: Docker com o plugin Compose, Node 20 e o app **Expo Go** no celular Android. O celular e o computador precisam estar na mesma rede.

**1. API e banco (Docker)**

```bash
docker compose up --build
curl localhost:3000/health   # {"status":"ok"}
```

Não precisa de `.env`: o compose traz valores padrão para desenvolvimento.

**2. App (Expo, fora do Docker)**

```bash
cd app
npm install
EXPO_PUBLIC_API_URL=http://<IP-do-computador>:3000 npx expo start
```

Troque `<IP-do-computador>` pelo IP da máquina na rede local (por exemplo `192.168.0.10`). Escaneie o QR code com o Expo Go.

**3. O que esperar**

1. Cadastre-se e entre.
2. Crie uma dupla e copie o código de convite. Uma segunda conta aceita o convite.
3. Cadastre o hábito da dupla.
4. Cada pessoa toca em "Fiz hoje". O mascote fica **Feliz** só quando as duas fizeram check-in no dia, **Faminto** com o dia aberto e **Desmaiado** depois de um dia fechado sem as duas.

Vídeo de demonstração: _em breve_.

Mais detalhes (hot reload, testes, comandos) em [docs/COMO-RODAR.md](docs/COMO-RODAR.md).

## Mapa do repositório

| Caminho | Conteúdo |
| :--- | :--- |
| `src/domain`, `src/api`, `src/infra` | Código da API (Node + Fastify + TypeScript) |
| `src/tests` | Testes da API |
| `app/` | App Expo (React Native) |
| `migrations/` | Migrações do banco (Knex) |
| `contratos/openapi.yaml` | Contrato da API |
| `compose.yaml`, `compose.dev.yaml` | Stack Docker (produção local e hot reload) |
| `scripts/` | `smoke-compose.sh` (smoke test) e `dora.sh` (métricas) |
| `docs/` | Proposta, spec, plano, métricas, fluxo de valor, retrospectivas, uso de IA |
| `docs/decisoes/` | ADRs |
| `docs/evidencias/` | Evidências (proteção da `main`) |
| `processo/` | Acordo de processo e backlog |
| `.github/workflows/` | CI (`verificar`, `docker`, `compose-smoke`, `app`) |

# Proposta de Projeto: EloHabits

**Disciplina:** DIM0510 — Processos de Software  
**Link**: 

---

## 1. Visão do Produto

* **Para:** Jovens adultos
* **Que:** Têm dificuldade em manter consistência em suas rotinas (estudo, exercícios, leitura) e desistem rápido por falta de acompanhamento
* **O EloHabits:** É uma aplicação web de rastreamento de hábitos baseada em duplas de responsabilidade
* **Que:** Conecta duas pessoas em um compromisso diário conjunto, no qual a consistência de ambos determina o progresso
* **Diferente de:** Aplicativos de hábitos individuais convencionais (como Notion, Habitica ou Loop)
* **Nosso produto:** Faz a sequência (*streak*) e a vida do mascote da dupla dependerem do cumprimento das metas de ambos os parceiros até a meia-noite

### Hipótese de Valor
> **Acreditamos que** estudantes universitários **vão** manter suas metas diárias por pelo menos 14 dias consecutivos **porque** a visibilidade mútua e a responsabilidade compartilhada geram cobrança social positiva, reduzindo a procrastinação.

---

## 2. Definição do MVP (Mínimo Produto Viável)

O MVP foi delimitado para validar a dinâmica da dupla e o vínculo com o bichinho virtual com o menor esforço de engenharia possível, mantendo foco na qualidade do fluxo e cobertura de testes.

| No MVP (Escopo Ativo) | Fora do MVP (Próximos Passos) |
| :--- | :--- |
| Cadastro e autenticação básica (e-mail e senha) | Login social via terceiros (Google, GitHub) |
| Criação de vínculo de dupla via código/link único | Grupos com 3 ou mais membros |
| Cadastro de 1 hábito diário por participante | Múltiplos hábitos simultâneos por participante |
| Check-in diário com confirmação de conclusão | Upload de foto/vídeo para comprovação da meta |
| Mascote compartilhado com 3 estados visuais (Feliz, Faminto/Triste, Doente/Desmaiado) | Loja de acessórios, customização visual e skins do pet |
| Cálculo de *streak* (streak cresce se ambos cumprem; pet sofre dano se um falhar) | Minigames com o mascote ou batalhas entre duplas |
| Painel do dia com status de ambos os membros e vida/estado do mascote | Notificações push nativas, integração com WhatsApp/SMS |

---

## 3. Backlog Inicial e Quadro Kanban

O backlog é mantido no **GitHub Projects** configurado com as cinco colunas obrigatórias do fluxo contínuo da disciplina: `Backlog`, `Sprint Backlog`, `Em progresso`, `Em revisão` e `Pronto`.

### Histórias de Usuário Priorizadas

| Prio | História de Usuário | Critérios de Aceitação | Estimativa | Sprint |
| :---: | :--- | :--- | :---: | :---: |
| **P1** | **Como usuário**, quero criar minha conta com e-mail e senha **para** ter meu cadastro individual no sistema. | 1. Validação de formato de e-mail e unicidade no banco.<br>2. Senha com no mínimo 6 caracteres com hash seguro.<br>3. Retorno de token de sessão/JWT. | 3 pts | 1 |
| **P1** | **Como usuário autenticado**, quero gerar um código de convite e dar nome ao pet **para** iniciar a jornada em dupla. | 1. Geração de código exclusivo de 6 caracteres.<br>2. Entrada do segundo participante via código e definição do nome do pet.<br>3. Bloqueio para que nenhum dos dois entre em outra dupla simultânea. | 5 pts | 1 |
| **P1** | **Como membro da dupla**, quero cadastrar meu hábito diário **para** definir a tarefa necessária para manter o mascote vivo. | 1. Título da meta com até 50 caracteres.<br>2. Horário-limite diário (padrão: 23:59).<br>3. Apenas 1 meta ativa por usuário por ciclo. | 2 pts | 1 |
| **P1** | **Como participante**, quero marcar meu hábito como feito hoje **para** alimentar o pet e avançar o streak da dupla. | 1. Check-in permitido exclusivamente para a data corrente.<br>2. Atualização atômica do status individual.<br>3. Se ambos concluírem no dia, pet fica "Feliz" e soma +1 ao streak; se virar o dia sem conclusão mútua, pet muda para "Faminto/Desmaiado" e streak zera. | 5 pts | 2 |
| **P2** | **Como membro da dupla**, quero visualizar o painel diário **para** acompanhar o status do meu parceiro e a vida do mascote. | 1. Exibição do estado visual do pet (ilustração/ícone e status textual).<br>2. Sinalização em tempo real da situação de cada membro (Pendente / Concluído).<br>3. Contador visível de dias consecutivos (*streak*). | 3 pts | 2 |

---

## 4. Stack Tecnológico e Justificativa

* **Frontend Mobile (Android): React Native / Expo (TypeScript) ou Flutter**  
  * *Justificativa:* Permite focar na plataforma Android com alta velocidade de prototipação, componentes declarativos e facilidade para executar testes de interface e de componentes de forma desacoplada de emuladores pesados.
* **Backend / Camada de Dados: Node.js (TypeScript) + Fastify / Express ou Firebase/Supabase**  
  * *Justificativa:* Arquitetura leve para manipulação do estado da dupla e da máquina de estados do mascote, simplificando a escrita de testes de integração via HTTP.
* **Banco de Dados & Modelagem: SQLite / PostgreSQL (Prisma ORM)**  
  * *Justificativa:* Permite persistência consistente das entidades de usuário, dupla e transições diárias do pet, viabilizando bancos efêmeros em memória para execução rápida de testes locais e no CI.
* **Testes Automatizados: Jest + React Native Testing Library (ou Flutter Test)**  
  * *Justificativa:* Suporta testes unitários puros da lógica de domínio (cálculo de streak, virada de data e vida do pet) e testes de renderização de componentes sem depender de emuladores Android no ambiente de CI.
* **Integração Contínua (CI): GitHub Actions**  
  * *Justificativa:* Pipeline automatizado executado a cada push/PR para checagem de formatação/linter (ESLint), compilação estática (TypeScript) e execução da suíte de testes Jest.

---

## 5. Acordo de Processo (Estratégia Individual)

### 5.1. Cadência e Rituais Pessoais
* **Duração da Sprint:** 2 semanas.
* **Planejamento da Sprint (*Sprint Planning*):** Segunda-feira inicial (30 min). Revisão das pendências do backlog, detalhamento técnico das telas/endpoints e alocação estrita ao limite de capacidade individual.
* **Acompanhamento Pessoal (*Daily Log*):** Registro breve no início do turno de trabalho em uma issue dedicada de progresso da sprint: *(1. O que foi implementado; 2. Próxima etapa imediata; 3. Dificuldades técnicas encontradas)*.
* **Revisão e Retrospectiva (*Self-Review & Retrospective*):** Sexta-feira final (40 min). Teste de usabilidade no dispositivo Android físico ou emulador, análise de métricas de fluxo do GitHub Projects (Throughput e Cycle Time) e registro de planos de melhoria.

### 5.2. Definição de Pronto (*Definition of Done - DoD*)
Um item só é considerado **Pronto** se cumprir todos os requisitos:
1. Critérios de aceitação da história validados na interface mobile.
2. Regras de negócio essenciais (estados do pet, check-in e cálculo do streak) cobertas por testes automatizados unitários/integração.
3. Pipeline de CI (linter, tipagem e testes) verde no GitHub Actions.
4. Auto-revisão estruturada realizada no Pull Request antes do merge.
5. Código integrado à branch principal (`main`) de forma limpa.

### 5.3. Estratégia de Inspeção e Auto-Review
Diante do contexto individual, a inspeção de código adota um **Checklist de Auto-Review** registrado na descrição de todo Pull Request:
* [ ] Os testes unitários das regras do mascote e virada de dia foram executados com sucesso?
* [ ] A interface foi testada em resolução de tela padrão de smartphone Android?
* [ ] Não há logs residuais (`console.log`), arquivos de build móvel (`.apk`, `/build`, cache) ou credenciais versionadas?
* [ ] O linter e a compilação do TypeScript passaram sem avisos ou erros?

### 5.4. Limites de Trabalho em Progresso (*WIP Limits*)
Ajustados para evitar troca excessiva de contexto em desenvolvimento solo:
* **Em progresso:** Limite estrito de **1 item**. Uma funcionalidade deve ser concluída antes de qualquer nova tarefa ser puxada.
* **Em revisão:** Limite estrito de **1 item**. A finalização da documentação, testes e checklist de PR tem prioridade máxima sobre novos desenvolvimentos.

### 5.5. Ferramentas Adotadas
* **Gestão de Fluxo e Backlog:** GitHub Projects.
* **Repositório e CI:** GitHub + GitHub Actions.
* **Emulação e Teste Manual:** Android Studio Emulator / Dispositivo Android físico com Expo Go (ou APK de debug).

---

## 6. Identificação do Integrante

| Nome Completo | Matrícula | E-mail | Papel Principal |
| :--- | :---: | :--- | :--- |
| João Marcos Silva Fernandes de Freitas | 20230052103| jomasii2@gmail.com | Desenvolvedor & Gestor de Processo |
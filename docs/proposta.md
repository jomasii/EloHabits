# Proposta de Projeto: EloHabits


## 1. Visão do Produto

* Para estudantes e jovens adultos que tem dificuldade em manter consistência em metas diárias (estudos, leitura, exercícios) e desistem rápido por falta de acompanhamento mútuo e visibilidade do próprio progresso.
* O **EloHabits** é um aplicativo móvel de acompanhamento de hábitos em duplas de responsabilidade que vincula dois parceiros a um mascote virtual compartilhado e consolida o histórico da dupla em um dashboard visual intuitivo com métricas de consistência. 
* **Diferente de** Aplicativos de hábitos puramente individuais (como Habitica, Notion ou Loop Habit Tracker). 
* **Nosso produto** condiciona a sobrevivência do mascote e o streak à disciplina mútua diária, fornecendo infográficos visuais do ritmo e taxa de sucesso da dupla ao longo do tempo.

### Hipótese de Valor
> **Acreditamos que** estudantes universitários **vão** manter suas metas diárias ativas por pelo menos 21 dias consecutivos **porque** o compromisso conjunto pelo mascote, somado à visualização clara de sua evolução em infográficos, reforça o senso de progresso e reduz a evasão.

---

## 2. Definição do MVP (Mínimo Produto Viável)

O MVP foi delimitado para validar a dinâmica da dupla e o vínculo com o bichinho virtual com o menor esforço de engenharia possível, mantendo foco na qualidade do fluxo e cobertura de testes.

| No MVP (Escopo Ativo) | Fora do MVP (Próximos Passos) |
| :--- | :--- |
| Cadastro e autenticação básica (e-mail e senha) | Login social via terceiros (Google, GitHub) |
| Criação de vínculo de dupla via código/link único | Grupos com 3 ou mais membros |
| Cadastro de 1 hábito diário por usuário | Múltiplos hábitos simultâneos por participante |
| Check-in diário com confirmação de conclusão | Upload de foto/vídeo como prova de execução |
| Mascote compartilhado com 3 estados (Feliz, Faminto, Desmaiado) | Widget de tela inicial do Android |
| Regra de *streak* mútua com impacto na saúde do pet | Notificações push em tempo real via Firebase (FCM) |
| Tela principal com status da dupla e saúde do mascote | Loja de itens cosméticos ou roupinhas para o mascote |
| Dashboard de Hábitos com infográfico semanal/mensal de consistência da dupla | Exportação de relatórios em PDF ou integração com smartwatches |
| Painel do dia com status de ambos os membros e vida/estado do mascote | Notificações push nativas, integração com WhatsApp/SMS |

---

## 3. Backlog Inicial e Quadro Kanban

Link para o quadro: [EloHabits Kanban](https://github.com/users/jomasii/projects/2)

### Histórias de Usuário Priorizadas

| Prio | História de Usuário | Critérios de Aceitação | Estimativa | Sprint |
| :---: | :--- | :--- | :---: | :---: |
| **P1** | **Como usuário móvel**, quero criar minha conta com e-mail e senha **para** ter meu perfil individual seguro no app. | 1. Validação de formato de e-mail e senha (mínimo de 6 caracteres).<br>2. Bloqueio de e-mails duplicados.<br>3. Armazenamento seguro de token no dispositivo. | 3 pts | 1 |
| **P1** | **Como usuário**, quero vincular minha conta à de um parceiro via código **para** criar a dupla e escolher o mascote. | 1. Geração de código de 6 caracteres com botão de cópia.<br>2. Vinculação atômica entre os dois usuários.<br>3. Bloqueio para impedir participação em mais de uma dupla ativa. | 5 pts | 1 |
| **P1** | **Como usuário**, quero marcar meu hábito como feito hoje **para** alimentar o mascote e somar pontos ao streak da dupla. | 1. Check-in ativo apenas na data corrente.<br>2. Atualização imediata do status individual para "Concluído".<br>3. Se ambos marcarem até 23:59, pet fica "Feliz" e soma +1 ao streak; caso contrário, pet adoece e streak zera. | 5 pts | 2 |
| **P2** | **Como participante**, quero visualizar na tela principal o mascote e a situação do meu parceiro **para** saber se preciso cobrá-lo. | 1. Exibição da ilustração do pet de acordo com o estado.<br>2. Indicador claro de status de ambos os membros (Pendente / Concluído).<br>3. Exibição em destaque do contador de dias consecutivos (*streak*). | 3 pts | 2 |
| **P3** | **Como membro da dupla**, quero visualizar um dashboard com infográficos de desempenho **para** analisar a nossa taxa de consistência ao longo do tempo. | 1. Gráfico de calendário/mapa de calor dos últimos 14 a 30 dias mostrando dias de sucesso e falhas da dupla.<br>2. Gráfico de barras ou progresso comparativo com o total de check-ins individuais de cada parceiro.<br>3. Indicador de taxa de aproveitamento percentual do ciclo corrente. | 5 pts | **3** |

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

### 5.2. Definição de Pronto
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

## 7. Informações Adicionais

* **Coorte de apresentação:** B
* **Integração com outras Matérias:** N/A
* **Link do quadro no GitHub Projects:** [EloHabits Kanban](https://github.com/users/jomasii/projects/2)
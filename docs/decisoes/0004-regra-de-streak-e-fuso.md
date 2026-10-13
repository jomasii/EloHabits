# ADR-0004 — Regra do streak e virada de dia

Status: proposta (revisar antes da Sprint 1) · Data: 2026-10-05

## Decisão proposta
- Um dia só conta para a dupla se **os dois** membros tiverem `checkins.concluido = true` naquela data.
- O streak é o número de dias consecutivos contados até hoje; um dia passado sem os dois check-ins zera o streak.
- A "data" do check-in é calculada no fuso fixo `America/Fortaleza` (UTC−3, sem horário de verão), definido em um único ponto do código, e não no fuso do dispositivo.
- O dia corrente ainda aberto não quebra o streak; só é avaliado após 23:59 no fuso acima.

## Consequências
- Comportamento previsível para os dois membros, mesmo com dispositivos em fusos diferentes.
- A coluna `checkins.data` é do tipo `date` já resolvido nesse fuso.
- Se a dupla usar o app fora do Brasil, o fuso por dupla seria uma evolução futura.

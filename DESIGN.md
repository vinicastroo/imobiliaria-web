# DESIGN.md · Scala

> Se este arquivo e o código discordarem, vale o código até o Vini decidir. Registre o conflito em Perguntas em aberto.

## Produto

Scala é uma plataforma SaaS multi-tenant para o mercado imobiliário. Num só lugar, a imobiliária tem o painel de gestão (imóveis, CRM em kanban, métricas, equipe) e o site público white-label dela.
Esta marca vale para a **plataforma**: login, painel admin, super admin, site/landing de venda do produto e materiais comerciais. Os sites públicos de cada imobiliária continuam com a marca e as cores **do cliente**.
Uso: corretores no celular durante o dia (cadastro de imóvel, fotos, leads) e gestores no notebook (CRM, métricas). (assumido)
Tarefa principal da tela mais usada (admin → Imóveis): achar, cadastrar e atualizar imóveis rápido.

## Público e voz

Imobiliárias pequenas e médias (5 a 30 corretores) que hoje usam planilha, WhatsApp ou sistema antigo, e corretores autônomos que querem site e CRM próprios. Pouco técnicos.
Voz: profissional e confiável, sóbria, transmite solidez. Sem gíria e sem jargão de TI.
Idioma: português (Brasil). Formatos: datas 14/11/2026, dinheiro R$ 450.000,00, área 120 m².

## Clima

Palavras: moderna/tech, limpa/minimalista, elegante/premium.
Nunca parecer:

- clichê imobiliário: casinha com chaminé, chave, aperto de mão, ilustração literal. Elementos de imóvel (prédios) são permitidos no símbolo, desde que reduzidos a geometria limpa;
- startup colorida (gradiente neon, mascote, app "jovem" demais);
- sistema corporativo antigo (cinza, denso, cara de ERP de banco);
- luxo exagerado (preto com dourado, serifa rebuscada, "alto padrão").

## Marca

Nome: **Scala** (de _escala_: crescer, subir de nível, proporção). Escolhido em 2026-11-25.
Domínio: **scalamob.com.br** (e `scalamob.com` para proteger a marca), escolhido em 2026-11-25. A marca continua **Scala**; só o endereço é "scalamob". Os dois domínios estavam livres na data e ainda não foram registrados. Estrutura planejada: `scalamob.com.br` para o site da Scala, `admin.scalamob.com.br` para o super admin (no lugar de `admin.codelabz.com.br`) e `<imobiliaria>.scalamob.com.br` para os sites de clientes sem domínio próprio.
Logo: símbolo **Duas torres** (dois prédios de alturas diferentes, topos inclinados; a torre alta em azul royal e a baixa em azul claro) + a palavra **"scala" em Sora SemiBold (600)**, em azul royal, com espaçamento −3% e convertida em curvas. O símbolo tem a altura do "l". Ícone do app e favicon: só as Duas torres. O favicon é o ícone do app (torres claras sobre o quadrado azul royal). Arquivos em `design/brand/` (logo claro, escuro, branco e mono; símbolo; ícones; favicon; prévia em `index.html`).
Cores: base tinta `#141A22` sobre papel `#F7F7F5`. Destaque **Azul royal** `#1F4FD1` (hover `#1A43B3`, pressed `#163A99`, soft `#EAF0FE`, torre baixa `#B9CBF8`; em fundo escuro `#6E93FF`, com o texto do logo em `#C9D7FF`).
Tipografia: **Sora** no logo e em toda a interface do painel e do login (Google Fonts, licença SIL OFL, livre para uso comercial). Carregada via `next/font` com `preload: false`, para não pesar nos sites públicos.
Fonte da verdade: `design/tokens.css` e `design/guide-foundations.html`. Não herdamos a exploração "ZUNO" de `docs/branding/`.
Código atual: tema neutro padrão do shadcn (`app/globals.css`, oklch cinza), fonte base Montserrat (`app/layout.tsx`). Os tokens `--primary` e `--secondary` são sobrescritos pelas cores de cada tenant nos sites públicos.

## Referências

- **Linear**: pegar tipografia precisa, muito espaço, poucos elementos, sensação de produto afiado. Evitar o fundo escuro como padrão.
- **Stripe**: pegar confiança, hierarquia clara e uma cor de destaque bem usada. Evitar os gradientes coloridos chamativos.
- **Airbnb (produto)**: pegar a foto como protagonista, cards limpos, cantos suaves e navegação simples. Evitar o tom caloroso e "de consumidor" demais.

## Restrições

- Stack: Next.js + Tailwind v4 + shadcn/ui. A identidade precisa virar tokens CSS no `globals.css`.
- Ícones: lucide-react (client) e Phosphor (SSR), já em uso.
- Tema claro como padrão (Linear: evitar escuro). Modo escuro só para o painel, se for o caso. (assumido)
- O painel precisa conviver com as cores do tenant: a marca Scala não pode brigar com o `--primary` do cliente. (assumido)
- Funcionar em celular (≈390 px) e notebook (≈1280 px). Contraste WCAG AA. (assumido)

## Registro de decisões

- 2026-11-25: nome **Scala**, depois de descartar ZUNO (desconhecido), Prumo (domínios tomados) e Nivo (já usado). Riscos aceitos: Scala Incorporadora (mesmo setor), Scala Data Centers e a linguagem Scala.
- 2026-11-25: fonte do logo **Sora SemiBold**. A Satoshi e a Geist foram descartadas depois de testes no logo, e o "s" desenhado à parte (Traço) saiu.
- 2026-11-25: símbolo **Duas torres** + texto "scala". O símbolo não podia ser o S e precisava falar de imóvel. Ficou à frente de porta em arco, casa isométrica e skyline. A regra "nada de prédio no logo" foi relaxada para "prédio só em geometria limpa".
- 2026-11-25: cor **Azul royal**, escolhida entre 23 paletas. Finalistas descartadas: Grafite + azul e Terracota. O Esmeralda, escolhido antes, foi trocado a pedido do Vini.
- 2026-11-25: domínio **scalamob.com.br**, com a marca mantida como Scala. Foram descartados `usescala.com.br` (não agradou), `scala.imb.br` (possíveis restrições da categoria `.imb.br`) e `scalaimob.com.br` (trocado pelo mais curto).
- 2026-11-25: **landing page** da Scala em `app/scala`, servida no domínio da plataforma (rewrite em `proxy.ts`). Botão principal: "Agendar demonstração". Mostra os 3 planos (lidos de `GET /platform/plans`) e a Auros e a Gilli como clientes (autorizado).
- 2026-11-25: pedidos de demonstração ficam **salvos no sistema**: tabela `demo_requests` na API e tela "Pedidos de demo" no super admin. A entrega por WhatsApp e por e-mail foi descartada.
- 2026-11-25: na sidebar, o ícone da imobiliária fica sobre a cor dela, porque muitos ícones de tenant são brancos e foram feitos para a sidebar colorida antiga.
- 2026-11-26: **padrão das telas do painel** em `components/admin` (AdminPage, PageHeader, DataCard, FormSection, EmptyState, RowActions, TableSkeletonRows). Telas do menu sem "Voltar", título em texto normal, ações de linha no menu "⋯", sem colunas de ID técnico e esqueleto do mesmo tamanho ao carregar.
- 2026-11-26: imóveis com miniatura, preço, local e situação; formulário de imóvel em seções numa página só, com barra de salvar fixa e aviso de alterações não salvas; corretores em cards com foto; CRM com colunas neutras e só a bolinha na cor da etapa; configurações com navegação lateral.
- 2026-11-26: **sem tracejados/hachuras** na landing (o Vini não gostou). Fundos lisos.
- 2026-11-26: favicon = ícone do app (torres claras sobre azul royal), a pedido do Vini.
- 2026-11-26: **landing page refeita** com referência em Valeti, Arco e Valid: selos em pílula, hero com pessoa recortada sobre bloco azul-claro e prévia do painel com cards flutuando, faixa de clientes em cinza, abas de soluções com indicador deslizante, cards arredondados com traço de cor e bloco final em azul royal.
- 2026-11-26: **pessoas nas composições**. Fotos geradas na Higgsfield (gpt_image_2_6) em `public/scala/`: corretora (recortada), corretor com casal, gestora e equipe.
- 2026-11-26: **animações** com a lib `motion` e as peças em `components/motion` (Reveal, Stagger, Float, CountUp, Typewriter), nos tokens de 120/200/320 ms, curva (.2,0,0,1) e respeitando `prefers-reduced-motion`.
- 2026-11-26: **menu lateral claro**, com barra azul deslizante na página ativa. Ele empurra o conteúdo, lembra o estado num cookie (`scala_sidebar`) e vira gaveta no celular. Ganhou o item "Início".
- 2026-11-26: cores fixas da Auros (`#17375F`) trocadas por `primary` em todo o `app/admin`. Nos sites públicos, as cores fixas continuam.
- 2026-11-25: marca da plataforma separada da marca dos tenants, que continuam white-label.
- 2026-11-25: painel admin e login usam a **marca Scala** (azul royal, Sora, logo Scala), com o logo e o nome da imobiliária junto (sidebar e selo no login). Implementado por `components/scala-theme.tsx`, que sobrescreve as cores do tenant só nessas telas. Os sites públicos seguem 100% do cliente. A sidebar passou a ser azul-noite (`#0D1530`).

## Perguntas em aberto

- Busca no INPI (classes 9, 35, 36 e 42) para "Scala": a fazer pelo Vini.
- Registrar `scalamob.com.br` e `scalamob.com`, e depois trocar `admin.codelabz.com.br` no middleware (`proxy.ts`) e em `NEXT_PUBLIC_PLATFORM_DOMAIN`.
- O super admin continua em `admin.codelabz.com.br` ou migra para o domínio Scala?
- Landing: os textos das perguntas frequentes e do "Como funciona" são rascunho (por exemplo, "ajudamos a apontar o domínio"). Confirmar que descrevem o serviço real.
- Landing: falta um "Entrar" para clientes. Hoje o login fica no domínio de cada imobiliária (`/admin`).
- Sites públicos ainda têm ~60 cores fixas `#17375F` em componentes compartilhados (busca, listas, galeria). Elas deveriam usar `--primary` do tenant.
- Slogan: a proposta é "Sua imobiliária em outra escala." (não confirmada).

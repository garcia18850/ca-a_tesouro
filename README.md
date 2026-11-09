# Ilha do Tesouro — 2º ano

Um novo programa de busca do tesouro, exclusivo para crianças do 2º ano do Ensino Fundamental. O caminho da aventura substitui a navegação por matérias, séries, loja e painéis de pontuação.

## A aventura

Cinco lugares: Praia das Conchas, Ponte do Rio Azul, Bosque dos Coqueiros, Cantinho do Papagaio e Esconderijo do Tesouro. Cada lugar tem três pistas de leitura, Matemática e natureza, totalizando 15 perguntas curtas. A criança escolhe entre três alternativas, confirma e recebe incentivo para continuar. Uma resposta incorreta permite tentar novamente, sem cronômetro ou perda de vidas.

A cada lugar concluído, um pedaço do mapa é encontrado. O último lugar abre o baú do tesouro. O mapa libera somente a próxima parada, e a tela mostra uma pergunta por vez. As ilustrações são SVG locais, com cores vivas e sem anúncios ou links para jogos externos.

O botão “Ligar voz” ativa a leitura automática. Cada pergunta pode ser ouvida de novo e respondida pelo botão “Falar”, nos navegadores compatíveis. A fala apenas seleciona a resposta; a criança precisa confirmar. O navegador pode usar um serviço externo para reconhecer a voz. O programa não salva gravações nem transcrições. O microfone exige permissão e HTTPS ou localhost.

## Progresso

O mapa e a alternativa ainda selecionada ficam salvos no navegador com a chave `trilha-viva-tesouro-2ano-v1`. Não é necessário informar nome, e-mail ou ano escolar. A aventura pode ser retomada após fechar a página. Limpar os dados do navegador remove o progresso. Se o armazenamento estiver indisponível, a tela informa que o mapa fica disponível apenas enquanto a página estiver aberta.

O novo salvamento é independente dos dados do programa anterior. Os módulos antigos de currículo, perfis, loja e avatares foram retirados da aplicação. O link para o Doom foi removido.

## Executar

Requer Node.js 20.9 ou superior para o aplicativo; os scripts de validação usam Node.js 24.

```sh
npm install
npm run dev
```

Abra http://localhost:3000.

```sh
npm run typecheck
npm run check:treasure
npm run check:speech
npm run build
npm start
```

As fontes, o mapa e as ilustrações são locais. O conteúdo é apoio à aprendizagem e deve ser revisado por educadores antes de uso em sala de aula. Não atribuímos códigos BNCC sem essa revisão.

A interface adapta a largura ao celular, mantém botões de pelo menos 44 pixels e permite ampliar a página. A narração depende das vozes instaladas e das políticas do navegador. As preferências de movimento reduzido do dispositivo são respeitadas.

## Projeto independente

Esta pasta contém somente a Ilha do Tesouro do 2º ano. Pode ser aberta ou copiada como um projeto próprio. Possui suas próprias dependências e não importa arquivos da Trilha Viva.

Execute `npm run dev` para abrir em http://localhost:3100. Para produção, execute `npm run build` e depois `npm start`; a porta também será 3100.

No Windows, também é possível dar dois cliques em `iniciar-ilha-do-tesouro.cmd` para iniciar esta versão.

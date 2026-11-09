export interface TreasureClue {
  id: string
  prompt: string
  options: [string, string, string]
  answer: string
  hint: string
  illustration: 'shell' | 'bridge' | 'palm' | 'parrot' | 'chest'
}

export const treasureStops = [
  { id: 'praia', name: 'Praia das Conchas', shortName: 'Praia', color: '#f7bf44', icon: 'shell', x: 21, y: 77 },
  { id: 'ponte', name: 'Ponte do Rio Azul', shortName: 'Ponte', color: '#f48b65', icon: 'bridge', x: 70, y: 64 },
  { id: 'bosque', name: 'Bosque dos Coqueiros', shortName: 'Bosque', color: '#78c96f', icon: 'palm', x: 27, y: 48 },
  { id: 'papagaio', name: 'Cantinho do Papagaio', shortName: 'Papagaio', color: '#bc96ed', icon: 'parrot', x: 70, y: 32 },
  { id: 'tesouro', name: 'Esconderijo do Tesouro', shortName: 'Tesouro', color: '#ffc748', icon: 'chest', x: 38, y: 14 },
] as const

// Only second-year content: short reading, syllables, quantities, shapes and nature.
export const treasureClues: TreasureClue[] = [
  { id: 'praia-1', prompt: 'Você achou 12 conchas e ganhou mais 5. Quantas conchas tem agora?', options: ['15', '17', '19'], answer: '17', hint: 'Comece no 12 e conte mais cinco.', illustration: 'shell' },
  { id: 'praia-2', prompt: 'O bilhete diz: “O mapa está na areia.” Onde está o mapa?', options: ['Na árvore', 'No barco', 'Na areia'], answer: 'Na areia', hint: 'Ouça o final do bilhete: na areia.', illustration: 'shell' },
  { id: 'praia-3', prompt: 'Qual atitude deixa a praia limpa?', options: ['Colocar o lixo na lixeira', 'Jogar papel no mar', 'Deixar garrafas na areia'], answer: 'Colocar o lixo na lixeira', hint: 'Pense no lugar certo para colocar o lixo.', illustration: 'shell' },
  { id: 'ponte-1', prompt: 'A ponte tinha 20 tábuas. Foram retiradas 4. Quantas ficaram?', options: ['24', '14', '16'], answer: '16', hint: 'Volte quatro números a partir do 20.', illustration: 'bridge' },
  { id: 'ponte-2', prompt: 'Qual forma tem três lados?', options: ['Círculo', 'Triângulo', 'Quadrado'], answer: 'Triângulo', hint: 'O nome dessa forma começa com TRI.', illustration: 'bridge' },
  { id: 'ponte-3', prompt: 'Bata palmas para os pedaços de PON-TE. Quantas sílabas são?', options: ['2', '3', '4'], answer: '2', hint: 'Uma palma para PON e outra para TE.', illustration: 'bridge' },
  { id: 'bosque-1', prompt: 'Há 3 grupos de 10 sementes. Quantas sementes há ao todo?', options: ['13', '30', '20'], answer: '30', hint: 'Some dez, mais dez, mais dez.', illustration: 'palm' },
  { id: 'bosque-2', prompt: 'Qual parte da planta absorve água do solo?', options: ['Flor', 'Fruto', 'Raiz'], answer: 'Raiz', hint: 'Essa parte geralmente fica debaixo da terra.', illustration: 'palm' },
  { id: 'bosque-3', prompt: 'Qual palavra rima com MÃO?', options: ['PÃO', 'SOL', 'LUA'], answer: 'PÃO', hint: 'Ouça o som ÃO no final das palavras.', illustration: 'palm' },
  { id: 'papagaio-1', prompt: 'O papagaio contou: 2, 4, 6... Qual número vem agora?', options: ['7', '10', '8'], answer: '8', hint: 'A sequência aumenta de dois em dois.', illustration: 'parrot' },
  { id: 'papagaio-2', prompt: 'O recado diz: “Bia levou a chave.” Quem levou a chave?', options: ['O papagaio', 'Bia', 'O peixe'], answer: 'Bia', hint: 'Ouça o nome que aparece no começo do recado.', illustration: 'parrot' },
  { id: 'papagaio-3', prompt: 'Qual destes animais tem penas?', options: ['Papagaio', 'Tartaruga', 'Peixe'], answer: 'Papagaio', hint: 'Pense na cobertura do corpo das aves.', illustration: 'parrot' },
  { id: 'tesouro-1', prompt: 'Você tem 10 moedas e divide igualmente entre 2 baús. Quantas vão em cada baú?', options: ['2', '10', '5'], answer: '5', hint: 'Procure dois grupos iguais que, juntos, formem dez.', illustration: 'chest' },
  { id: 'tesouro-2', prompt: 'Complete o recado: “Uma chave, duas ___.”', options: ['chave', 'chaves', 'chavinha'], answer: 'chaves', hint: 'Precisamos da palavra que indica mais de uma chave.', illustration: 'chest' },
  { id: 'tesouro-3', prompt: 'A última pista diz: “O baú está debaixo da árvore.” Onde procurar?', options: ['Debaixo da árvore', 'Dentro do rio', 'Em cima da ponte'], answer: 'Debaixo da árvore', hint: 'Ouça o lugar que aparece na pista.', illustration: 'chest' },
]

export const CLUES_PER_STOP = 3
export const TREASURE_STORAGE_KEY = 'trilha-viva-tesouro-2ano-v1'
export type TreasureScreen = 'map' | 'question' | 'found' | 'complete'
export interface TreasureProgress { version: 1; step: number; screen: TreasureScreen; choice: string | null }
export function newTreasureProgress(): TreasureProgress { return { version: 1, step: 0, screen: 'map', choice: null } }

export function readTreasureProgress(value: unknown): TreasureProgress {
  if (!value || typeof value !== 'object') return newTreasureProgress()
  const input = value as Partial<TreasureProgress>
  const step = input.step
  if (input.version !== 1 || !Number.isInteger(step) || step! < 0 || step! > treasureClues.length) return newTreasureProgress()
  if (step === treasureClues.length) return { version: 1, step, screen: 'complete', choice: null }
  if (!['map', 'question', 'found'].includes(input.screen ?? '')) return newTreasureProgress()
  if (input.screen === 'found' && (step === 0 || step! % CLUES_PER_STOP !== 0)) return newTreasureProgress()
  if (input.screen === 'map' && step! % CLUES_PER_STOP !== 0) return newTreasureProgress()
  const choice = input.screen === 'question' && typeof input.choice === 'string' && treasureClues[step!].options.includes(input.choice) ? input.choice : null
  return { version: 1, step: step!, screen: input.screen as TreasureScreen, choice }
}
export function parseTreasureProgress(raw: string | null): TreasureProgress {
  try { return readTreasureProgress(raw ? JSON.parse(raw) : null) }
  catch { return newTreasureProgress() }
}
export function openTreasureStop(progress: TreasureProgress, id: string): TreasureProgress {
  const currentStop = treasureStops[Math.floor(progress.step / CLUES_PER_STOP)]
  return progress.screen === 'map' && currentStop?.id === id ? { ...progress, screen: 'question', choice: null } : progress
}
export function chooseTreasureAnswer(progress: TreasureProgress, choice: string): TreasureProgress {
  return progress.screen === 'question' && treasureClues[progress.step]?.options.includes(choice) ? { ...progress, choice } : progress
}
export function confirmTreasureAnswer(progress: TreasureProgress): { correct: boolean; progress: TreasureProgress } {
  if (progress.screen !== 'question' || progress.choice === null || progress.choice !== treasureClues[progress.step]?.answer) return { correct: false, progress }
  const step = progress.step + 1
  return { correct: true, progress: { version: 1, step, choice: null, screen: step === treasureClues.length ? 'complete' : step % CLUES_PER_STOP === 0 ? 'found' : 'question' } }
}
export function continueTreasureMap(progress: TreasureProgress): TreasureProgress {
  return progress.screen === 'found' ? { ...progress, screen: 'map', choice: null } : progress
}

// Deliberately match exact answers or explicit option labels, never fuzzy guesses.
export function normalizeSpeech(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[?!.,;:()[\]"'“”]/g, ' ').replace(/\s+/g, ' ').trim()
}
const numbers: Record<string, string> = {
  zero: '0', um: '1', uma: '1', dois: '2', duas: '2', tres: '3', quatro: '4', cinco: '5',
  seis: '6', sete: '7', oito: '8', nove: '9', dez: '10', onze: '11', doze: '12',
  treze: '13', quatorze: '14', catorze: '14', quinze: '15', dezesseis: '16',
  dezessete: '17', dezoito: '18', dezenove: '19', vinte: '20', trinta: '30',
  quarenta: '40', cinquenta: '50', sessenta: '60', cem: '100',
}
export function matchSpokenOption(transcript: string, options: readonly string[]): string | null {
  const text = normalizeSpeech(transcript).replace(/^(?:a minha resposta e|minha resposta e|a resposta e|resposta)\s+/, '')
  if (!text) return null
  const punctuation: Record<string, string> = { 'ponto de interrogacao': '?', 'interrogacao': '?', 'ponto final': '.', 'ponto de exclamacao': '!', 'exclamacao': '!', 'virgula': ',' }
  if (punctuation[text] && options.includes(punctuation[text])) return punctuation[text]
  const exact = options.filter(option => normalizeSpeech(option) === text || normalizeSpeech(option) === numbers[text])
  if (exact.length === 1) return exact[0]
  if (exact.length > 1) return null
  const label = text.match(/^(?:(?:alternativa|opcao|letra)\s+)?([abcd]|be|ce|de)$/)
  if (label) {
    const index = ({ a: 0, b: 1, be: 1, c: 2, ce: 2, d: 3, de: 3 } as Record<string, number>)[label[1]]
    return options[index] ?? null
  }
  const ordinal = text.match(/^(?:opcao|alternativa)\s+(um|uma|dois|duas|tres|quatro|[1-4])$/)
  if (ordinal) return options[Number(numbers[ordinal[1]] ?? ordinal[1]) - 1] ?? null
  return null
}

export function readableSpeech(text: string): string {
  const symbols: Record<string, string> = { '?': 'ponto de interrogação', '.': 'ponto final', ',': 'vírgula', '!': 'ponto de exclamação' }
  if (symbols[text.trim()]) return symbols[text.trim()]
  return text.replace(/×/g, ' vezes ').replace(/÷/g, ' dividido por ')
    .replace(/(\d+)\s*-\s*(?=\d)/g, '$1 menos ').replace(/\+/g, ' mais ').replace(/=/g, ' igual a ')
    .replace(/(\d+)\/(\d+)/g, '$1 sobre $2').replace(/🪨|●/gu, ' pedra ')
}

"use client"

import { useEffect, useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'
import { matchSpokenOption } from '@/lib/speech'
import { useNarration } from './narration'

interface Recognition {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void; abort: () => void
}
type VoiceWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }

export function VoiceAnswer({ options, onSelect, disabled, compact = false }: { options: string[]; onSelect: (option: string) => void; disabled: boolean; compact?: boolean }) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [message, setMessage] = useState('')
  const recognition = useRef<Recognition | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { stop, speak, automatic, setListening: setNarrationListening } = useNarration()
  function cancel() {
    if (timer.current) clearTimeout(timer.current)
    const current = recognition.current
    recognition.current = null
    if (current) { current.onend = null; current.onresult = null; current.onerror = null; current.abort() }
    setListening(false)
    setNarrationListening(false)
  }
  useEffect(() => {
    const browser = window as VoiceWindow
    setSupported(Boolean(browser.SpeechRecognition || browser.webkitSpeechRecognition) && window.isSecureContext)
    const hide = () => { if (document.hidden) cancel() }
    document.addEventListener('visibilitychange', hide)
    window.addEventListener('pagehide', cancel)
    return () => {
      document.removeEventListener('visibilitychange', hide)
      window.removeEventListener('pagehide', cancel)
      if (timer.current) clearTimeout(timer.current)
      const current = recognition.current
      if (current) { current.onresult = null; current.onerror = null; current.onend = null; current.abort() }
      setNarrationListening(false)
    }
  }, [setNarrationListening])
  useEffect(() => { if (disabled) cancel() }, [disabled]) // stop capture when this answer closes
  function start() {
    cancel()
    stop()
    const browser = window as VoiceWindow
    const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition
    if (!Constructor || disabled) return
    const current = new Constructor()
    recognition.current = current
    current.lang = 'pt-BR'; current.continuous = false; current.interimResults = false; current.maxAlternatives = 1
    current.onresult = event => {
      if (recognition.current !== current) return
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      const answer = matchSpokenOption(transcript, options)
      cancel()
      const feedback = answer ? `Você escolheu: ${answer}. Toque em Confirmar resposta ou escolha outra opção.` : `Não consegui escolher uma alternativa. Diga a letra A, B, C ou D, ou fale o texto da resposta.`
      setMessage(compact ? (answer ? `Ouvi: “${transcript}”. Confira sua escolha.` : 'Não entendi. Tente dizer a letra da resposta.') : transcript ? `Ouvi: “${transcript}”. ${feedback}` : feedback)
      if (answer) onSelect(answer)
      if (automatic) speak(feedback)
    }
    current.onerror = event => {
      if (recognition.current !== current) return
      cancel()
      const feedback = event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? 'O microfone não foi liberado. Peça ajuda a um adulto ou toque na resposta.'
        : event.error === 'audio-capture' ? 'Não encontrei um microfone. Você pode tocar na resposta.'
        : event.error === 'network' ? 'A conexão de voz falhou. Tente novamente ou toque na resposta.'
        : 'Não consegui ouvir. Tente de novo, falando depois de tocar no microfone, ou toque na resposta.'
      setMessage(feedback)
      if (automatic) speak(feedback)
    }
    current.onend = () => {
      if (recognition.current !== current) return
      cancel()
      setMessage('A escuta terminou. Toque no microfone para tentar de novo ou escolha uma resposta na tela.')
    }
    setMessage('Estou ouvindo! Diga a letra da alternativa ou fale sua resposta.')
    setListening(true); setNarrationListening(true)
    try {
      current.start()
      timer.current = setTimeout(() => { if (recognition.current === current) { cancel(); setMessage('A escuta terminou. Toque no microfone para tentar novamente.') } }, 20000)
    } catch { cancel(); setMessage('Não foi possível iniciar o microfone. Tente novamente ou toque na resposta.') }
  }
  if (compact) return <section aria-label="Responder por áudio" className="treasure-mic">
    <button type="button" disabled={!supported || disabled} aria-pressed={listening} aria-label={listening ? 'Parar microfone' : 'Responder falando'} onClick={() => listening ? cancel() : start()} className="treasure-hint"><span aria-hidden="true">{listening ? <Square size={18} /> : <Mic size={19} />}</span>{listening ? 'Parar' : 'Falar'}</button>
    {!supported && <span className="sr-only">O microfone não está disponível neste navegador. Toque em uma resposta.</span>}
    <p role="status" aria-live="polite" className="treasure-mic-status">{listening ? 'Estou ouvindo…' : message}</p>
  </section>
  return <section aria-label="Responder por áudio" className="rounded-2xl border border-primary/25 bg-primary/5 p-4">
    <button type="button" disabled={!supported || disabled} aria-pressed={listening} onClick={() => listening ? cancel() : start()} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white disabled:opacity-50">
      {listening ? <Square size={22} aria-hidden="true" /> : <Mic size={24} aria-hidden="true" />}{listening ? 'Parar microfone' : 'Responder falando'}
    </button>
    <p className="mt-2 text-sm">{supported ? 'Diga A, B, C ou D, ou o texto da resposta. Depois confirme sua escolha.' : 'A resposta por voz precisa de um navegador compatível e de HTTPS ou localhost. Você pode tocar nas alternativas.'}</p>
    {supported && <p className="mt-2 text-xs text-muted-foreground">O navegador pode enviar a voz ao serviço de reconhecimento dele. O projeto não salva gravações.</p>}
    <p role="status" aria-live="polite" className="mt-2 font-semibold">{message}</p>
  </section>
}

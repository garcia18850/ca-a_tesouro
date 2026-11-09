"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { readableSpeech } from '@/lib/speech'

interface Narration {
  supported: boolean; automatic: boolean; speaking: boolean; error: string; listening: boolean
  speak: (text: string) => void; stop: () => void; toggle: (intro: string) => void
  setListening: (value: boolean) => void
}
const Context = createContext<Narration | null>(null)
const preferenceKey = 'trilha-viva-narration'

export function NarrationProvider({ children }: { children: React.ReactNode }) {
  const [supported, setSupported] = useState(false)
  const [automatic, setAutomatic] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [listening, updateListening] = useState(false)
  const listeningRef = useRef(false)
  const [error, setError] = useState('')
  const token = useRef(0)
  const stop = useCallback(() => {
    token.current++
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])
  const setListening = useCallback((value: boolean) => {
    listeningRef.current = value
    updateListening(value)
    if (value) stop()
  }, [stop])
  useEffect(() => {
    setSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window)
    try { setAutomatic(localStorage.getItem(preferenceKey) === 'on') } catch { /* Session-only when storage is unavailable. */ }
    const hide = () => { if (document.hidden) stop() }
    document.addEventListener('visibilitychange', hide)
    return () => { document.removeEventListener('visibilitychange', hide); token.current++; if ('speechSynthesis' in window) window.speechSynthesis.cancel() }
  }, [stop])
  const speak = useCallback((text: string) => {
    if (listeningRef.current || !text.trim() || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return
    const id = ++token.current
    const synth = window.speechSynthesis
    synth.cancel()
    setError('')
    const chunks = readableSpeech(text).match(/[^.!?\n]+[.!?]?/g) ?? [text]
    function next(index: number) {
      if (token.current !== id) return
      if (index >= chunks.length) { setSpeaking(false); return }
      const utterance = new SpeechSynthesisUtterance(chunks[index])
      utterance.lang = 'pt-BR'
      const voices = synth.getVoices()
      const voice = voices.find(v => /^pt[-_]BR$/i.test(v.lang)) ?? voices.find(v => /^pt/i.test(v.lang))
      if (voice) utterance.voice = voice
      utterance.rate = 0.85
      utterance.onend = () => next(index + 1)
      utterance.onerror = event => {
        if (token.current !== id || event.error === 'canceled' || event.error === 'interrupted') return
        setSpeaking(false)
        setError('Não foi possível reproduzir a voz. Toque em Ouvir ou peça ajuda a um adulto.')
      }
      synth.speak(utterance)
    }
    setSpeaking(true)
    next(0)
  }, [])
  const toggle = useCallback((intro: string) => {
    const enabled = !automatic
    setAutomatic(enabled)
    try { localStorage.setItem(preferenceKey, enabled ? 'on' : 'off') } catch { /* Still works for this session. */ }
    if (enabled) speak(intro); else stop()
  }, [automatic, speak, stop])
  return <Context.Provider value={{ supported, automatic, speaking, error, listening, setListening, speak, stop, toggle }}>{children}</Context.Provider>
}
export function useNarration() {
  const context = useContext(Context)
  if (!context) throw new Error('Narração precisa de NarrationProvider')
  return context
}
export function NarrationControls({ intro }: { intro: string }) {
  const { supported, automatic, speaking, error, stop, toggle } = useNarration()
  return <section aria-label="Ajuda por voz" data-narration-ignore className="mb-5 rounded-2xl border bg-card p-4">
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
      <button type="button" disabled={!supported} aria-pressed={automatic} onClick={() => toggle(intro)} className="min-h-12 min-w-0 rounded-xl bg-primary px-4 py-2 font-bold text-white disabled:opacity-50">{automatic ? 'Desativar leitura do site' : 'Ativar leitura do site'}</button>
      {speaking && <button type="button" onClick={stop} className="min-h-12 min-w-0 rounded-xl border px-4 py-2 font-bold">Parar áudio</button>}
    </div>
    <p className="mt-2 text-sm text-muted-foreground">{supported ? 'A leitura acompanha as telas, perguntas, dicas e explicações. Use Ouvir esta tela para repetir.' : 'Este navegador não oferece leitura por voz. Peça ajuda a um adulto.'}</p>
    {error && <p className="mt-2 text-sm" role="status">{error}</p>}
  </section>
}

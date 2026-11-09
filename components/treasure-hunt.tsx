"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, Check, Ear, Flag, KeyRound, LockKeyhole, Map, RotateCcw, Sparkles, Square, Volume2 } from 'lucide-react'
import { useNarration } from '@/components/activity/narration'
import { VoiceAnswer } from '@/components/activity/voice-answer'
import { IslandLandscape, TreasureArt } from '@/components/treasure-art'
import { CLUES_PER_STOP, TREASURE_STORAGE_KEY, chooseTreasureAnswer, confirmTreasureAnswer, continueTreasureMap, newTreasureProgress, openTreasureStop, parseTreasureProgress, treasureClues, treasureStops, type TreasureProgress } from '@/lib/treasure'

export function TreasureHunt() {
  const [progress, setProgress] = useState<TreasureProgress>(newTreasureProgress)
  const latest = useRef(progress)
  const [ready, setReady] = useState(false)
  const [welcome, setWelcome] = useState(true)
  const [celebrate, setCelebrate] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [resetOpen, setResetOpen] = useState(false)
  const resetDialog = useRef<HTMLDialogElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const { automatic, supported, speaking, listening, error, speak, stop, toggle } = useNarration()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TREASURE_STORAGE_KEY)
      const restored = parseTreasureProgress(raw)
      latest.current = restored; setProgress(restored)
    } catch { setStorageAvailable(false) }
    setReady(true)
  }, [])
  const save = useCallback((next: TreasureProgress) => {
    latest.current = next; setProgress(next)
    try { localStorage.setItem(TREASURE_STORAGE_KEY, JSON.stringify(next)); setStorageAvailable(true) }
    catch { setStorageAvailable(false) }
  }, [])
  const currentStop = treasureStops[Math.min(treasureStops.length - 1, Math.floor(progress.step / CLUES_PER_STOP))]
  const clue = treasureClues[progress.step]
  const foundStop = treasureStops[Math.max(0, Math.floor(progress.step / CLUES_PER_STOP) - 1)]
  const fragments = Math.floor(progress.step / CLUES_PER_STOP)
  const screen = welcome ? 'welcome' : celebrate ? 'celebrate' : progress.screen
  const questionReading = clue ? `${clue.prompt} ${clue.options.map((option, i) => `Alternativa ${String.fromCharCode(65 + i)}: ${option}.`).join(' ')} Escolha uma resposta e toque em Confirmar resposta.` : ''
  const reading = resetOpen ? 'Começar uma nova busca? O mapa desta aventura vai voltar ao começo. Você pode escolher continuar aqui.'
    : screen === 'welcome' ? 'A Ilha do Tesouro. Uma aventura para o segundo ano. Encontre as pistas e descubra o tesouro! Toque em começar ou continuar sua aventura.'
    : screen === 'map' ? `Vamos para ${currentStop.name}! Toque no lugar marcado com a bandeira. Você já encontrou ${fragments} de cinco pedaços do mapa.`
    : screen === 'found' ? `Você encontrou um pedaço do mapa em ${foundStop.name}! Já são ${fragments} de cinco. Toque em Seguir o mapa.`
    : screen === 'complete' ? 'Você encontrou o tesouro! Juntou os cinco pedaços do mapa. Parabéns por cada descoberta! Você pode começar uma nova busca quando quiser.'
    : screen === 'celebrate' ? 'Boa descoberta! Você acertou. Toque em Próxima pista.'
    : questionReading

  useEffect(() => {
    if (!ready) return
    heading.current?.focus()
    if (automatic) speak(reading)
    return () => stop()
  }, [automatic, ready, reading, speak, stop])
  useEffect(() => {
    const dialog = resetDialog.current
    if (resetOpen && !dialog?.open) dialog?.showModal()
    else if (!resetOpen && dialog?.open) dialog.close()
  }, [resetOpen])

  function choose(option: string) {
    const next = chooseTreasureAnswer(latest.current, option)
    if (next === latest.current) return
    setWrong(false); setShowHint(false); save(next)
  }
  function confirm() {
    const before = latest.current
    if (celebrate || before.choice === null) return
    const result = confirmTreasureAnswer(before)
    stop()
    if (!result.correct) {
      setWrong(true)
      if (automatic) speak('Quase! Você pode tentar outra resposta ou pedir uma ajuda.')
      return
    }
    setWrong(false); setShowHint(false)
    if (result.progress.screen === 'question') setCelebrate(true)
    save(result.progress)
  }
  function begin() { stop(); setWelcome(false); setWrong(false); setShowHint(false) }
  function reset() { stop(); save(newTreasureProgress()); setResetOpen(false); setCelebrate(false); setWrong(false); setShowHint(false); setWelcome(false) }
  function pause() { stop(); setCelebrate(false); setWrong(false); setShowHint(false); setWelcome(true) }

  return <div className="treasure-app">
    <a href="#aventura" className="treasure-skip">Pular para a aventura</a>
    <header className="treasure-header">
      <a className="treasure-brand" href="/" aria-label="Ilha do Tesouro, início"><span className="treasure-brand-icon"><Map size={23} aria-hidden="true" /></span><span>Ilha do<br /><strong>Tesouro<span aria-hidden="true">!</span></strong></span></a>
      <div className="treasure-header-actions"><span className="treasure-grade">2º ano</span><button className="treasure-voice" type="button" disabled={!supported || listening} aria-pressed={automatic} aria-label={automatic ? 'Desativar leitura automática' : 'Ativar leitura automática'} onClick={() => toggle(reading)}><Ear size={22} aria-hidden="true" /><span>{automatic ? 'Voz ligada' : 'Ligar voz'}</span></button></div>
    </header>
    <main id="aventura" className={`treasure-main treasure-screen-${screen}`} tabIndex={-1}>
      {!ready ? <p role="status" className="treasure-loading">Preparando sua aventura…</p> : <>
        {screen === 'welcome' && <section className="treasure-welcome">
          <span className="treasure-kicker"><Sparkles size={15} aria-hidden="true" />Uma ilha. Muitas descobertas.</span>
          <div className="welcome-illustration"><div className="welcome-sun" aria-hidden="true" /><TreasureArt open className="welcome-chest" /><span className="welcome-bubble bubble-one" aria-hidden="true">✦</span><span className="welcome-bubble bubble-two" aria-hidden="true">✦</span></div>
          <h1 tabIndex={-1} ref={heading}>Vamos encontrar<br />o <span>tesouro?</span></h1>
          <p>Resolva as pistas e siga o mapa!</p>
          <button className="treasure-button button-coral" onClick={begin}>{progress.step === treasureClues.length ? 'Ver meu tesouro' : progress.step > 0 || progress.screen === 'question' ? 'Continuar aventura' : 'Começar aventura'}<ArrowRight size={22} aria-hidden="true" /></button>
          <details className="treasure-adult"><summary>Para quem acompanha</summary><p>Aventura exclusiva para o 2º ano, com 15 pistas de Matemática, leitura e natureza. Sem cronômetro. O progresso fica neste navegador. A voz depende do dispositivo. No microfone, o navegador pode usar um serviço externo; o programa não salva gravações.</p></details>
        </section>}

        {screen === 'map' && <section className="treasure-map-section">
          <p className="treasure-kicker">Sua próxima descoberta</p>
          <h1 tabIndex={-1} ref={heading}>Vamos para {currentStop.shortName === 'Praia' || currentStop.shortName === 'Ponte' ? 'a' : 'o'} <span>{currentStop.shortName}!</span></h1>
          <div className="island-map" role="group" aria-label="Mapa da busca do tesouro">
            <IslandLandscape />
            {treasureStops.map((place, i) => {
              const done = i < fragments
              const active = i === fragments
              return <button key={place.id} type="button" className={`island-stop ${active ? 'stop-current' : ''} ${done ? 'stop-done' : ''}`} disabled={!active} aria-label={active ? `Explorar ${place.name}` : done ? `${place.name}, concluído` : `${place.name}, ainda não descoberto`} style={{ left: `${place.x}%`, top: `${place.y}%`, '--stop-color': place.color } as CSSProperties} onClick={() => { stop(); save(openTreasureStop(latest.current, place.id)) }}>
                <span className="island-stop-art"><TreasureArt kind={place.icon} />{done ? <Check className="stop-state" size={18} aria-hidden="true" /> : active ? <Flag className="stop-state" size={18} aria-hidden="true" /> : <LockKeyhole className="stop-state" size={15} aria-hidden="true" />}</span><span className="island-stop-name">{place.shortName}</span>{active && <span className="stop-invitation">Toque aqui!</span>}
              </button>
            })}
          </div>
          <MapPieces count={fragments} />
        </section>}

        {screen === 'question' && clue && <section className="treasure-clue-card" key={clue.id}>
          <div className="clue-topline"><button type="button" className="treasure-back" aria-label="Guardar a aventura e voltar ao início" onClick={pause}><ArrowLeft size={20} aria-hidden="true" /></button><p>{currentStop.shortName} <span>· Pista {progress.step % CLUES_PER_STOP + 1} de {CLUES_PER_STOP}</span></p><button type="button" className="treasure-back" disabled={!supported || listening} aria-label="Ouvir esta pista" onClick={() => speak(questionReading)}><Volume2 size={21} aria-hidden="true" /></button></div>
          <TreasureArt kind={clue.illustration} className="clue-illustration" />
          <h1 tabIndex={-1} ref={heading}>{clue.prompt}</h1>
          <div className="treasure-options" role="group" aria-label="Escolha sua resposta">{clue.options.map((option, i) => <button key={option} type="button" aria-pressed={progress.choice === option} className={`treasure-option option-${i} ${progress.choice === option ? 'option-selected' : ''}`} onClick={() => choose(option)}><span className="option-letter" aria-hidden="true">{progress.choice === option ? <Check size={19} /> : String.fromCharCode(65 + i)}</span><span>{option}</span></button>)}</div>
          {wrong && <p className="treasure-response" role="status">Quase! Tente outra resposta. Você consegue!</p>}
          <div className="clue-help"><button type="button" className="treasure-hint" aria-expanded={showHint} aria-controls="treasure-hint" onClick={() => { setShowHint(value => !value); if (!showHint && automatic) speak(clue.hint); else stop() }}><KeyRound size={18} aria-hidden="true" />Uma ajudinha</button><VoiceAnswer compact options={clue.options} disabled={false} onSelect={choose} /></div>
          {showHint && <p id="treasure-hint" className="treasure-hint-text">{clue.hint}</p>}
          <button type="button" disabled={progress.choice === null} className="treasure-button button-purple" onClick={confirm}>Confirmar resposta <ArrowRight size={21} aria-hidden="true" /></button>
        </section>}

        {screen === 'celebrate' && <section className="treasure-reward-card"><span className="treasure-success-icon" aria-hidden="true"><Check size={43} /></span><h1 tabIndex={-1} ref={heading}>Boa descoberta!</h1><p>A próxima pista está esperando.</p><button type="button" className="treasure-button button-purple" onClick={() => { stop(); setCelebrate(false) }}>Próxima pista <ArrowRight size={22} aria-hidden="true" /></button></section>}

        {screen === 'found' && <section className="treasure-reward-card"><div className="map-piece-reward" aria-hidden="true"><Map size={76} /><span><Check size={24} /></span></div><p className="treasure-kicker">Você conseguiu!</p><h1 tabIndex={-1} ref={heading}>Mais um pedaço<br />do mapa!</h1><MapPieces count={fragments} /><button type="button" className="treasure-button button-coral" onClick={() => { stop(); save(continueTreasureMap(latest.current)) }}>Seguir o mapa <ArrowRight size={22} aria-hidden="true" /></button></section>}

        {screen === 'complete' && <section className="treasure-reward-card treasure-finish"><span className="treasure-kicker"><Sparkles size={16} aria-hidden="true" />A aventura valeu a pena!</span><TreasureArt open className="finish-chest" /><h1 tabIndex={-1} ref={heading}>O tesouro<br />é <span>seu!</span></h1><p>Parabéns por cada descoberta!</p><MapPieces count={treasureStops.length} /><button type="button" className="treasure-button button-coral" onClick={() => setResetOpen(true)}><RotateCcw size={21} aria-hidden="true" />Nova busca</button></section>}
      </>}
      {(!storageAvailable || error) && <p className="treasure-notice" role="status">{error || 'Seu mapa fica guardado só enquanto esta página estiver aberta.'}</p>}
    </main>
    {speaking && <button type="button" onClick={stop} className="treasure-stop-voice"><Square size={16} aria-hidden="true" />Parar voz</button>}
    <dialog ref={resetDialog} onCancel={() => setResetOpen(false)} className="treasure-reset-dialog" aria-labelledby="new-adventure-heading"><h2 id="new-adventure-heading">Começar uma nova busca?</h2><p>Seu mapa vai voltar ao começo.</p><button type="button" className="treasure-button button-coral" onClick={reset}>Sim, nova aventura!</button><button type="button" className="treasure-hint" onClick={() => setResetOpen(false)}>Continuar aqui</button></dialog>
  </div>
}

function MapPieces({ count }: { count: number }) {
  return <div className="treasure-pieces" aria-label={`${count} de ${treasureStops.length} pedaços do mapa encontrados`}><div aria-hidden="true">{treasureStops.map((place, i) => <span key={place.id} className={i < count ? 'piece-found' : ''}><Map size={18} /></span>)}</div><p>{count} de {treasureStops.length} pedaços do mapa</p></div>
}

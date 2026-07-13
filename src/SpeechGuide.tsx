import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, Square } from 'lucide-react'
import type { GuideContent } from './types'
import { useI18n } from './i18n'

export function SpeechGuide({guide, rate}: {guide: GuideContent; rate: number}) {
  const {locale,t}=useI18n()
  const [state, setState] = useState<'idle'|'playing'|'paused'|'unsupported'>('idle')
  const [active, setActive] = useState(-1)
  const queue = useRef<SpeechSynthesisUtterance[]>([])
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => () => { if (supported) window.speechSynthesis.cancel() }, [supported])

  const play = () => {
    if (!supported) { setState('unsupported'); return }
    if (state === 'paused') { window.speechSynthesis.resume(); setState('playing'); return }
    window.speechSynthesis.cancel()
    queue.current = guide.transcript.map((text, index) => {
      const utterance = new SpeechSynthesisUtterance(t(text))
      utterance.lang = locale === 'zh' ? 'zh-CN' : 'en-US'; utterance.rate = rate
      utterance.onstart = () => setActive(index)
      utterance.onend = () => { if (index === guide.transcript.length - 1) { setState('idle'); setActive(-1) } }
      return utterance
    })
    queue.current.forEach((item) => window.speechSynthesis.speak(item))
    setState('playing')
  }
  const pause = () => { window.speechSynthesis.pause(); setState('paused') }
  const stop = () => { window.speechSynthesis.cancel(); setState('idle'); setActive(-1) }

  return <section className="guide-player" aria-labelledby="guide-title">
    <div className="guide-heading"><div><span className="eyebrow">{t('语音与文字导览')}</span><h2 id="guide-title">{t(guide.title)}</h2></div><span>{t(guide.duration)}</span></div>
    <div className="player-controls">
      <button className="primary-button" onClick={play}><Play size={18}/>{t(state === 'paused' ? '继续' : state === 'idle' ? '播放导览' : '重新播放')}</button>
      <button onClick={pause} disabled={state !== 'playing'}><Pause size={18}/>{t('暂停')}</button>
      <button onClick={stop} disabled={state === 'idle'}><Square size={17}/>{t('停止')}</button>
      <button onClick={() => { stop(); play() }}><RotateCcw size={17}/><span className="sr-only">{t('从头')}</span></button>
    </div>
    {state === 'unsupported' && <p className="inline-alert" role="alert">{t('当前浏览器不支持语音朗读，您仍可阅读下方完整文字稿。')}</p>}
    <ol className="transcript">{guide.transcript.map((text, index) => <li key={text} className={active === index ? 'active' : ''}>{t(text)}</li>)}</ol>
  </section>
}

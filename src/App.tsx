import { useEffect, useMemo, useRef, useState } from 'react'
import { HashRouter, Link, Route as RouterRoute, Routes } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, HandHeart, LocateFixed, MapPin, PackageCheck, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { PageShell, StatusBanner, NeedIcon } from './components'
import { SpeechGuide } from './SpeechGuide'
import { attractions, facilities, facilityLabels, needLabels, routes } from './data'
import { WestLakeMapAdapter } from './mapAdapter'
import { defaultPreferences, loadPreferences, savePreferences } from './preferences'
import type { AccessibilityPreferences, FacilityType, Need } from './types'
import { EquipmentRequestPage, HelpCardPage, HelpCenterPage, VolunteerRequestPage } from './AssistancePages'
import { useI18n } from './i18n'

function HomePage() {
  const {t}=useI18n()
  const mapRef = useRef<HTMLDivElement>(null)
  const adapterRef = useRef(new WestLakeMapAdapter())
  const [mode, setMode] = useState<'live'|'mock'>('mock')
  const [needs, setNeeds] = useState<Need[]>([])
  const [query, setQuery] = useState('')
  const [locationMessage, setLocationMessage] = useState('')
  const normalizedQuery=query.trim().toLocaleLowerCase()
  const filteredAttractions = attractions.filter((item) => [item.name,t(item.name),...item.tags,...item.tags.map(t)].some(value=>value.toLocaleLowerCase().includes(normalizedQuery)))

  useEffect(() => {
    const adapter = adapterRef.current
    if (!mapRef.current) return
    let cancelled = false
    adapter.initialize(mapRef.current).then((nextMode) => {
      if (!cancelled) setMode(nextMode)
    })
    return () => {
      cancelled = true
      adapter.destroy()
    }
  }, [])
  useEffect(() => {
    adapterRef.current.renderMarkers([
      ...filteredAttractions.map((item) => ({id:item.id,label:t(item.name),coordinate:item.coordinate,kind:'attraction' as const})),
      ...facilities.map((item) => ({id:item.id,label:t(item.name),coordinate:item.coordinate,kind:'facility' as const}))
    ])
  }, [filteredAttractions,t])

  const locate = () => {
    if (!navigator.geolocation) { setLocationMessage(t('当前设备不支持定位，已使用西湖中心作为起点。')); return }
    setLocationMessage(t('正在请求定位授权…'))
    navigator.geolocation.getCurrentPosition(
      ({coords}) => { adapterRef.current.focus([coords.longitude, coords.latitude]); setLocationMessage(t('已定位到您的当前位置。')) },
      () => setLocationMessage(t('未获得定位权限，已使用西湖中心；您仍可手动选择起点。')),
      { timeout: 6000 }
    )
  }

  return <PageShell>
    <section className="hero-grid">
      <div className="hero-copy">
        <span className="eyebrow"><Sparkles size={15}/> {t('从西湖开始，自在出发')}</span>
        <h1>{t('每一种抵达，')}<br/><em>{t('都值得被照顾。')}</em></h1>
        <p>{t('把语音导览、无障碍设施和友好路线放进一张地图，让每个人都能从容游西湖。')}</p>
        <div className="hero-facts"><span><strong>3</strong> {t('类友好服务')}</span><span><strong>7</strong> {t('处示例设施')}</span><span><strong>2</strong> {t('条示范路线')}</span></div>
      </div>
      <aside className="quick-needs" aria-labelledby="needs-title">
        <span className="section-number">01</span><h2 id="needs-title">{t('我需要哪些帮助？')}</h2><p>{t('可多选，地图内容会随之调整。')}</p>
        <div className="need-options">{(Object.keys(needLabels) as Need[]).map((need) => {
          const selected = needs.includes(need)
          return <button key={need} aria-pressed={selected} onClick={() => setNeeds(selected ? needs.filter(n => n !== need) : [...needs, need])}>
            <NeedIcon type={need}/><span>{t(needLabels[need])}</span>{selected && <Check size={17}/>}</button>
        })}</div>
      </aside>
    </section>

    <section className="map-section" aria-labelledby="map-title">
      <div className="section-heading"><div><span className="section-number">02</span><h2 id="map-title">{t('现在，从这里出发')}</h2></div><p>{t('查找景点、路线与身边的无障碍设施')}</p></div>
      <div className="map-layout">
        <div className="map-frame">
          <div className="map-toolbar">
            <label className="search-box"><Search size={19}/><span className="sr-only">{t('搜索景点')}</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('搜索景点或服务…')}/></label>
            <button className="locate-button" onClick={locate}><LocateFixed size={19}/><span>{t('我的位置')}</span></button>
          </div>
          <div ref={mapRef} className="map-canvas" role="application" aria-label={t(mode === 'live' ? '高德地图，显示西湖景点与无障碍设施' : '西湖示意地图，显示景点与无障碍设施')}/>
          <div className="map-legend"><span><i className="dot attraction"/>{t('景点')}</span><span><i className="dot facility"/>{t('无障碍设施')}</span></div>
          {mode === 'mock' && <div className="map-mode">{t('演示地图')}</div>}
        </div>
        <div className="map-results">
          {locationMessage && <StatusBanner>{locationMessage}</StatusBanner>}
          <div className="result-head"><strong>{t('推荐地点')}</strong><span>{filteredAttractions.length} {t('个结果')}</span></div>
          {filteredAttractions.map(item => <Link className="place-card" to={`/attractions/${item.id}`} key={item.id}>
            <span className="place-index">{String(attractions.indexOf(item)+1).padStart(2,'0')}</span>
            <div><h3>{t(item.name)}</h3><p>{t(item.subtitle)}</p><div className="tag-row">{item.tags.slice(0,2).map(tag => <span key={tag}>{t(tag)}</span>)}</div></div><ChevronRight/>
          </Link>)}
          {!filteredAttractions.length && <p className="empty-state">{t('没有找到匹配地点，请换个关键词。')}</p>}
        </div>
      </div>
    </section>
    <section className="quick-help-strip" aria-labelledby="quick-help-title"><div><span className="eyebrow">{t('现场帮助')}</span><h2 id="quick-help-title">{t('遇到障碍，不必独自解决。')}</h2><p>{t('呼叫志愿同行，或预约坡道和感官导览设备。当前为交互演示。')}</p></div><div><Link to="/help/volunteer"><HandHeart/>{t('呼叫志愿者')}<ArrowRight/></Link><Link to="/help/equipment"><PackageCheck/>{t('预约辅助设备')}<ArrowRight/></Link></div></section>
    <RouteStrip/>
  </PageShell>
}

function RouteStrip() {
  const {t}=useI18n()
  return <section className="route-strip"><div><span className="eyebrow">{t('今日推荐')}</span><h2>{t('少一点顾虑，')}<br/>{t('多一点湖光。')}</h2><p>{t('路线信息为首版示例，请出行前结合现场情况确认。')}</p><Link className="text-link" to="/routes">{t('查看全部友好路线')} <ArrowRight size={18}/></Link></div>
    <div className="route-preview"><span className="route-badge">{t('示范路线')}</span><h3>{t(routes[0].name)}</h3><div className="route-points"><span>{t(routes[0].from)}</span><i/><span>{t(routes[0].to)}</span></div><div className="route-meta"><span><Clock3/> {t(routes[0].duration)}</span><span><MapPin/> {t(routes[0].distance)}</span></div></div>
  </section>
}

function RoutesPage() {
  const {t}=useI18n()
  const [need, setNeed] = useState<Need|'all'>('all')
  const shown = routes.filter(route => need === 'all' || route.suitableFor.includes(need))
  return <PageShell><div className="page-wrap"><span className="eyebrow">{t('友好路线')}</span><h1>{t('更安心的西湖游线')}</h1><p className="lead">{t('优先展示路面、坡度、台阶和休息设施。以下均为示范信息，出行前请向景区确认。')}</p>
    <div className="filter-tabs" role="group" aria-label={t('按需求筛选路线')}><button aria-pressed={need==='all'} onClick={()=>setNeed('all')}>{t('全部')}</button>{(Object.keys(needLabels) as Need[]).map(n=><button key={n} aria-pressed={need===n} onClick={()=>setNeed(n)}>{t(needLabels[n])}</button>)}</div>
    <div className="route-list">{shown.map(route => <article className="route-card" key={route.id}><div className="route-card-top"><span className="route-badge">{t('示范路线')}</span><span>{t(route.distance)} · {t(route.duration)}</span></div><h2>{t(route.name)}</h2><div className="route-points"><span>{t(route.from)}</span><i/><span>{t(route.to)}</span></div><div className="route-specs"><span><small>{t('路面')}</small>{t(route.surface)}</span><span><small>{t('坡度')}</small>{t(route.slope)}</span></div><div className="tag-row">{route.tags.map(tag=><span key={tag}>{t(tag)}</span>)}</div><ol className="steps">{route.steps.map((step,index)=><li key={step.instruction}><b>{index+1}</b><div><strong>{t(step.instruction)}</strong><small>{t(step.distance)}</small>{step.alert&&<p>{t('注意：')}{t(step.alert)}</p>}</div></li>)}</ol></article>)}</div>
  </div></PageShell>
}

function AttractionPage({preferences}: {preferences: AccessibilityPreferences}) {
  const {t}=useI18n()
  const id = location.pathname.split('/').pop()
  const item = attractions.find(a=>a.id===id) ?? attractions[0]
  return <PageShell><div className="page-wrap detail-page"><Link to="/" className="back-link"><ArrowLeft/>{t('返回地图')}</Link><div className="detail-hero"><div><span className="eyebrow">{t('景点无障碍指南')}</span><h1>{t(item.name)}</h1><p>{t(item.subtitle)}</p></div><span className="scenic-glyph" aria-hidden="true">{t('桥')}</span></div>
    <StatusBanner>{t('本页为示例信息，开放情况和无障碍设施请以现场公告为准。')}</StatusBanner>
    <div className="detail-grid"><section><h2>{t('到访之前')}</h2><p>{t(item.description)}</p><dl><div><dt>{t('开放时间')}</dt><dd>{t(item.openHours)}</dd></div><div><dt>{t('适合体验')}</dt><dd>{item.tags.map(t).join(localeSeparator(t))}</dd></div></dl><h2>{t('无障碍提示')}</h2><ul className="check-list">{item.accessibility.map(text=><li key={text}><ShieldCheck/>{t(text)}</li>)}</ul></section><SpeechGuide guide={item.guide} rate={preferences.speechRate}/></div>
  </div></PageShell>
}

function FacilitiesPage() {
  const {t}=useI18n()
  const [type,setType] = useState<FacilityType|'all'>('all')
  const shown = facilities.filter(f=>type==='all'||f.type===type)
  return <PageShell><div className="page-wrap"><span className="eyebrow">{t('身边的帮助')}</span><h1>{t('无障碍设施目录')}</h1><p className="lead">{t('快速找到厕所、坡道、休息点与人工服务。设施状态不实时更新，请以现场为准。')}</p>
    <label className="select-label">{t('设施类型')}<select value={type} onChange={e=>setType(e.target.value as FacilityType|'all')}><option value="all">{t('全部设施')}</option>{Object.entries(facilityLabels).map(([key,label])=><option value={key} key={key}>{t(label)}</option>)}</select></label>
    <div className="facility-grid">{shown.map(f=><article className="facility-card" key={f.id}><div className="facility-icon"><MapPin/></div><div><div className="facility-head"><span>{t(facilityLabels[f.type])}</span><small>{t(f.distance)}</small></div><h2>{t(f.name)}</h2><div className="tag-row">{f.features.map(feature=><span key={feature}>{t(feature)}</span>)}</div><p>{t(f.note)}</p>{f.type==='service'&&<Link className="facility-book" to="/help/equipment?location=hub-quyuan">{t('从这里预约设备')} <ArrowRight/></Link>}</div></article>)}</div>
  </div></PageShell>
}

function SettingsPage({preferences,setPreferences}:{preferences:AccessibilityPreferences;setPreferences:(p:AccessibilityPreferences)=>void}) {
  const {t}=useI18n()
  const set = <K extends keyof AccessibilityPreferences>(key:K,value:AccessibilityPreferences[K]) => setPreferences({...preferences,[key]:value})
  const toggles: [keyof Pick<AccessibilityPreferences,'largeText'|'highContrast'|'reduceMotion'|'autoSpeak'|'visualAlerts'>,string,string][] = [
    ['largeText','大字号','放大正文和主要控件文字'],['highContrast','高对比模式','增强文字、边框与背景的对比'],['reduceMotion','减少动态效果','关闭非必要动画和过渡'],['autoSpeak','自动播报','进入景点时自动准备语音导览'],['visualAlerts','视觉提醒','用醒目的文字通知呈现重要信息']
  ]
  return <PageShell><div className="page-wrap settings-page"><span className="eyebrow">{t('按你的方式使用')}</span><h1>{t('无障碍设置')}</h1><p className="lead">{t('设置只保存在当前设备，不会上传，也不会收集个人健康信息。')}</p><div className="settings-panel">{toggles.map(([key,title,desc])=><label className="setting-row" key={key}><span><strong>{t(title)}</strong><small>{t(desc)}</small></span><input type="checkbox" checked={preferences[key]} onChange={e=>set(key,e.target.checked)}/><i aria-hidden="true"/></label>)}<label className="rate-row"><span><strong>{t('语音速度')}</strong><small>{t('当前')} {preferences.speechRate.toFixed(1)} {t('倍速')}</small></span><input type="range" min="0.6" max="1.6" step="0.1" value={preferences.speechRate} onChange={e=>set('speechRate',Number(e.target.value))}/></label><button className="secondary-button" onClick={()=>setPreferences(defaultPreferences)}>{t('恢复默认设置')}</button></div></div></PageShell>
}

export default function App() {
  const [preferences,setPreferenceState] = useState(loadPreferences)
  const setPreferences = (next:AccessibilityPreferences) => { setPreferenceState(next); savePreferences(next) }
  useEffect(()=>{
    const root=document.documentElement
    root.dataset.largeText=String(preferences.largeText); root.dataset.contrast=String(preferences.highContrast); root.dataset.reduceMotion=String(preferences.reduceMotion)
  },[preferences])
  return <HashRouter><Routes><RouterRoute path="/" element={<HomePage/>}/><RouterRoute path="/routes" element={<RoutesPage/>}/><RouterRoute path="/attractions/:id" element={<AttractionPage preferences={preferences}/>}/><RouterRoute path="/facilities" element={<FacilitiesPage/>}/><RouterRoute path="/help" element={<HelpCenterPage/>}/><RouterRoute path="/help/volunteer" element={<VolunteerRequestPage/>}/><RouterRoute path="/help/equipment" element={<EquipmentRequestPage/>}/><RouterRoute path="/help/card" element={<HelpCardPage/>}/><RouterRoute path="/settings" element={<SettingsPage preferences={preferences} setPreferences={setPreferences}/>}/><RouterRoute path="*" element={<HomePage/>}/></Routes></HashRouter>
}

function localeSeparator(t:(text:string)=>string){return t('、')==='、'?'、':', '}

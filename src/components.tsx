import { Accessibility, CircleHelp, Compass, HandHeart, Map, MapPin, Navigation, Route, Settings, Volume2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useI18n } from './i18n'

export function AppHeader() {
  const {locale,setLocale,t}=useI18n()
  return <header className="app-header">
    <NavLink to="/" className="brand" aria-label={t('西湖无碍行')}>
      <span className="brand-mark" aria-hidden="true">湖</span>
      <span><strong>{t('西湖无碍行')}</strong><small>WEST LAKE FOR ALL</small></span>
    </NavLink>
    <div className="header-tools"><button className="language-toggle" onClick={()=>setLocale(locale==='zh'?'en':'zh')} aria-label={locale==='zh'?t('切换到英语'):'Switch to Chinese'}><span className={locale==='zh'?'active':''}>中</span><i>/</i><span className={locale==='en'?'active':''}>EN</span></button><NavLink to="/settings" className="header-action"><Accessibility size={20}/><span>{t('无障碍设置')}</span></NavLink></div>
  </header>
}

const nav = [
  ['/', '地图', Map], ['/routes', '路线', Route], ['/facilities', '设施', MapPin], ['/help', '帮助', HandHeart], ['/settings', '设置', Settings]
] as const

export function BottomNav() {
  const {t}=useI18n()
  return <nav className="bottom-nav" aria-label={t('主要导航')}>{nav.map(([to, label, Icon]) =>
    <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => isActive ? 'active' : ''}>
      <Icon size={22}/><span>{t(label)}</span>
    </NavLink>
  )}</nav>
}

export function PageShell({children}: {children: ReactNode}) {
  return <div className="app-shell"><AppHeader/><main id="main-content">{children}</main><BottomNav/></div>
}

export function StatusBanner({children}: {children: ReactNode}) {
  return <div className="status-banner" role="status"><CircleHelp size={18}/><span>{children}</span></div>
}

export const NeedIcon = ({type}: {type: 'vision'|'hearing'|'mobility'}) => {
  const Icon = type === 'vision' ? Volume2 : type === 'hearing' ? Compass : Navigation
  return <Icon size={18} aria-hidden="true"/>
}

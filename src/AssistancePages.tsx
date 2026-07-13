import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarClock, Check, HandHeart, HelpingHand, PackageCheck, Radio, ShieldAlert, Trash2, TriangleAlert, X } from 'lucide-react'
import { PageShell, StatusBanner } from './components'
import { demoVolunteer, equipmentDeliveryStatuses, equipmentItems, serviceLocations, statusLabels, volunteerStatuses } from './assistanceData'
import { addAssistanceRecord, clearAssistanceRecords, createRecordId, loadAssistanceRecords, updateAssistanceStatus } from './assistanceStore'
import type { AssistanceRecord, AssistanceStatus, EquipmentBooking, VolunteerRequest } from './types'
import { useI18n } from './i18n'

const helpNeeds = ['视障引导', '手语或文字沟通', '轮椅协助', '路线陪同', '设备操作', '其他帮助']
const communicationOptions = ['口头交流', '文字交流', '手语交流', '简单清晰指令']
const sensoryModes = ['听觉增强', '触觉节奏', '视觉字幕']

export function HelpCenterPage() {
  const {t}=useI18n()
  const [records, setRecords] = useState(loadAssistanceRecords)
  const [announcement, setAnnouncement] = useState('')

  const advance = (record: AssistanceRecord) => {
    const sequence = record.kind === 'volunteer' ? volunteerStatuses : equipmentDeliveryStatuses
    const index = sequence.indexOf(record.status)
    if (index < 0 || index === sequence.length - 1) return
    const next = sequence[index + 1]
    setRecords(updateAssistanceStatus(record.id, next))
    setAnnouncement(`${record.id}: ${t(statusLabels[next])}`)
  }
  const cancel = (record: AssistanceRecord) => {
    if (!window.confirm(`${t('确认取消演示请求')} ${record.id}? ${t('记录仍会保留。')}`)) return
    setRecords(updateAssistanceStatus(record.id, 'cancelled'))
    setAnnouncement(`${record.id}: ${t('已取消')}`)
  }
  const clear = () => {
    if (!window.confirm(t('确认清除当前设备上的全部演示服务记录吗？'))) return
    clearAssistanceRecords(); setRecords([]); setAnnouncement(t('本机演示记录已清除'))
  }

  return <PageShell><div className="page-wrap help-page">
    <span className="eyebrow">{t('安心同行 · 演示服务')}</span><h1>{t('需要帮助，')}<br/>{t('我们一起想办法。')}</h1>
    <p className="lead">{t('现场呼叫或提前预约志愿同行，也可以请求辅助设备配送。当前功能不会真正发送请求。')}</p>
    <div className="emergency-note" role="note"><ShieldAlert/><div><strong>{t('这里不是紧急呼叫渠道')}</strong><span>{t('遇到人身安全或医疗紧急情况，请立即拨打 110 或 120。')}</span></div></div>
    <div className="help-actions">
      <Link to="/help/volunteer" className="help-action-card"><span className="action-icon"><HandHeart/></span><small>{t('一对一全程协助')}</small><h2>{t('呼叫或预约志愿者')}</h2><p>{t('视障引导、轮椅路线陪同、文字沟通与设备操作。')}</p><b>{t('开始预约')} <ArrowRight/></b></Link>
      <Link to="/help/equipment" className="help-action-card help-action-card--gold"><span className="action-icon"><PackageCheck/></span><small>{t('服务点配送')}</small><h2>{t('预约辅助设备')}</h2><p>{t('简易便携坡道与多媒体感官导览装置。')}</p><b>{t('查看设备')} <ArrowRight/></b></Link>
      <Link to="/help/card" className="help-action-card help-action-card--compact"><span className="action-icon"><Radio/></span><small>{t('无需说话也能表达')}</small><h2>{t('打开大字求助卡')}</h2><b>{t('立即打开')} <ArrowRight/></b></Link>
    </div>
    <section className="record-section" aria-labelledby="records-title"><div className="record-heading"><div><span className="section-number">{t('记录')}</span><h2 id="records-title">{t('我的演示服务')}</h2></div>{records.length>0&&<button className="danger-link" onClick={clear}><Trash2/>{t('清除记录')}</button>}</div>
      <div className="sr-only" aria-live="polite">{announcement}</div>
      {records.length===0?<div className="empty-record"><HelpingHand/><h3>{t('还没有服务记录')}</h3><p>{t('完成一次志愿者或设备预约后，可以在这里跟踪演示状态。')}</p></div>:<div className="records-list">{records.map(record=><ServiceRecord key={record.id} record={record} onAdvance={()=>advance(record)} onCancel={()=>cancel(record)}/>)}</div>}
    </section>
  </div></PageShell>
}

function ServiceRecord({record,onAdvance,onCancel}:{record:AssistanceRecord;onAdvance:()=>void;onCancel:()=>void}) {
  const {t}=useI18n()
  const sequence = record.kind==='volunteer'?volunteerStatuses:equipmentDeliveryStatuses
  const currentIndex=sequence.indexOf(record.status)
  const finished=record.status==='cancelled'||currentIndex===sequence.length-1
  const title=record.kind==='volunteer'?'志愿同行服务':equipmentItems.find(i=>i.id===record.equipmentId)?.name??'辅助设备'
  return <article className="service-record"><div className="record-top"><div><small>{record.id} · {t('演示记录')}</small><h3>{t(title)}</h3></div><span className={`status-pill status-${record.status}`}>{t(statusLabels[record.status])}</span></div>
    <div className="status-track" aria-label={`${t('当前状态：')}${t(statusLabels[record.status])}`}>{sequence.map((status,index)=><span key={status} className={currentIndex>=index?'done':''}><i>{currentIndex>index?<Check/>:index+1}</i><small>{t(statusLabels[status])}</small></span>)}</div>
    {record.kind==='volunteer'&&record.volunteer&&record.status!=='cancelled'&&<div className="volunteer-match"><BadgeCheck/><div><small>{t('模拟匹配志愿者')}</small><strong>{t(record.volunteer.displayName)} · {record.volunteer.id}</strong><span>{t(record.volunteer.organization)}</span><b>{t('会面核验码：')}{t(record.volunteer.verificationCode)}</b></div></div>}
    <div className="record-actions">{!finished&&<button className="primary-button dark" onClick={onAdvance}>{t('模拟推进状态')} <ArrowRight/></button>}{!finished&&<button className="plain-button" onClick={onCancel}>{t('取消请求')}</button>}</div>
  </article>
}

export function VolunteerRequestPage() {
  const {t}=useI18n()
  const navigate=useNavigate(); const [step,setStep]=useState(1); const [error,setError]=useState('')
  const [form,setForm]=useState({timing:'now' as 'now'|'scheduled',meetingPoint:'曲院风荷游客服务中心',scheduledAt:'',duration:'2 小时',needs:[] as string[],communication:'文字交流',notes:''})
  const toggleNeed=(need:string)=>setForm({...form,needs:form.needs.includes(need)?form.needs.filter(n=>n!==need):[...form.needs,need]})
  const next=(event:FormEvent)=>{event.preventDefault();if(!form.meetingPoint||form.needs.length===0||(form.timing==='scheduled'&&!form.scheduledAt)){setError('请填写会面地点、时间并至少选择一种帮助需求。');return}setError('');setStep(2);window.scrollTo({top:0})}
  const submit=()=>{const request:VolunteerRequest={id:createRecordId('VOL'),kind:'volunteer',...form,status:'submitted',createdAt:new Date().toISOString(),volunteer:demoVolunteer};addAssistanceRecord(request);navigate('/help')}
  return <PageShell><WizardHeader back="/help" eyebrow="志愿同行" title="预约一位同行者" step={step}/>{step===1?<form className="service-form" onSubmit={next}>
    <fieldset><legend>{t('你什么时候需要帮助？')}</legend><div className="choice-grid choice-grid--two"><Choice checked={form.timing==='now'} onChange={()=>setForm({...form,timing:'now'})} title="现在需要" detail="模拟现场快速匹配"/><Choice checked={form.timing==='scheduled'} onChange={()=>setForm({...form,timing:'scheduled'})} title="提前预约" detail="选择未来日期与时段"/></div></fieldset>
    <label>{t('会面地点')}<select value={form.meetingPoint} onChange={e=>setForm({...form,meetingPoint:e.target.value})}>{serviceLocations.map(l=><option key={l.id} value={l.name}>{t(l.name)}</option>)}</select></label>
    {form.timing==='scheduled'&&<label>{t('预约日期与时间')}<input type="datetime-local" value={form.scheduledAt} onChange={e=>setForm({...form,scheduledAt:e.target.value})} required/></label>}
    <label>{t('预计陪同时长')}<select value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}>{['1 小时','2 小时','半天','全天'].map(v=><option key={v} value={v}>{t(v)}</option>)}</select></label>
    <fieldset><legend>{t('需要哪些帮助？')}</legend><p className="field-hint">{t('可多选')}</p><div className="check-grid">{helpNeeds.map(need=><CheckChoice key={need} checked={form.needs.includes(need)} onChange={()=>toggleNeed(need)} label={need}/>)}</div></fieldset>
    <label>{t('沟通方式')}<select value={form.communication} onChange={e=>setForm({...form,communication:e.target.value})}>{communicationOptions.map(option=><option key={option} value={option}>{t(option)}</option>)}</select></label>
    <label>{t('补充说明（选填）')}<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder={t('例如：使用手动轮椅，希望避开拥挤路段')}/></label>
    {error&&<p className="form-error" role="alert">{t(error)}</p>}<button className="form-next" type="submit">{t('查看预约摘要')} <ArrowRight/></button>
  </form>:<Confirmation title="请确认志愿同行需求" rows={[['服务时间',form.timing==='now'?'现在需要':form.scheduledAt],['会面地点',form.meetingPoint],['预计时长',form.duration],['帮助需求',form.needs.map(t).join(t('、'))],['沟通方式',form.communication]]} onBack={()=>setStep(1)} onSubmit={submit} submitLabel="提交演示请求"/>}</PageShell>
}

export function EquipmentRequestPage() {
  const {t}=useI18n()
  const navigate=useNavigate(); const [params]=useSearchParams(); const preset=params.get('location')
  const [step,setStep]=useState(1); const [error,setError]=useState('')
  const [form,setForm]=useState({equipmentId:'sensory-guide',locationId:serviceLocations.some(l=>l.id===preset)?preset!:serviceLocations[0].id,returnLocationId:serviceLocations[0].id,scheduledAt:'',quantity:1,modes:['触觉节奏'] as string[],stepCount:1,obstacleLocation:'',notes:''})
  const equipment=equipmentItems.find(i=>i.id===form.equipmentId)!
  const available=serviceLocations.find(l=>l.id===form.locationId)?.availableEquipment.includes(form.equipmentId)??false
  const toggleMode=(mode:string)=>setForm({...form,modes:form.modes.includes(mode)?form.modes.filter(m=>m!==mode):[...form.modes,mode]})
  const next=(event:FormEvent)=>{event.preventDefault();if(!form.scheduledAt||!available||form.quantity>equipment.stock||(form.equipmentId==='ramp'&&!form.obstacleLocation)||(form.equipmentId==='sensory-guide'&&form.modes.length===0)){setError(!available?'该服务点暂无此设备，请选择建议的其他服务点。':'请完成时间、位置和使用需求。');return}setError('');setStep(2);window.scrollTo({top:0})}
  const submit=()=>{const booking:EquipmentBooking={id:createRecordId('EQP'),kind:'equipment',...form,status:'reserved',createdAt:new Date().toISOString()};addAssistanceRecord(booking);navigate('/help')}
  return <PageShell><WizardHeader back="/help" eyebrow="辅助设备" title="预约配送或领取" step={step}/>{step===1?<form className="service-form" onSubmit={next}>
    <fieldset><legend>{t('选择辅助设备')}</legend><div className="equipment-options">{equipmentItems.map(item=><label key={item.id} className={form.equipmentId===item.id?'selected':''}><input type="radio" name="equipment" value={item.id} checked={form.equipmentId===item.id} onChange={()=>setForm({...form,equipmentId:item.id})}/><PackageCheck/><span><strong>{t(item.name)}</strong><small>{t('模拟库存')} {item.stock} {t('件')}</small><p>{t(item.description)}</p></span></label>)}</div></fieldset>
    <StatusBanner>{t(equipment.safetyNote)}</StatusBanner>
    <label>{t('配送或领取服务点')}<select value={form.locationId} onChange={e=>setForm({...form,locationId:e.target.value})}>{serviceLocations.map(l=><option value={l.id} key={l.id}>{t(l.name)}{l.availableEquipment.includes(form.equipmentId)?'':` (${t('暂无')})`}</option>)}</select></label>
    {!available&&<p className="availability-warning"><TriangleAlert/>{t('建议改选：')}{t(serviceLocations.find(l=>l.availableEquipment.includes(form.equipmentId))?.name??'')}</p>}
    <label>{t('使用日期与时间')}<input type="datetime-local" value={form.scheduledAt} onChange={e=>setForm({...form,scheduledAt:e.target.value})} required/></label>
    <label>{t('数量')}<input type="number" min="1" max={equipment.stock} value={form.quantity} onChange={e=>setForm({...form,quantity:Number(e.target.value)})}/><small className="field-hint">{t('当前模拟库存')} {equipment.stock} {t('件')}</small></label>
    {form.equipmentId==='ramp'?<><label>{t('障碍位置')}<input value={form.obstacleLocation} onChange={e=>setForm({...form,obstacleLocation:e.target.value})} placeholder={t('例如：孤山路西泠桥东侧台阶')} required/></label><label>{t('台阶数量')}<input type="number" min="1" max="12" value={form.stepCount} onChange={e=>setForm({...form,stepCount:Number(e.target.value)})}/></label></>:<fieldset><legend>{t('需要哪些感官模式？')}</legend><div className="check-grid">{sensoryModes.map(mode=><CheckChoice key={mode} checked={form.modes.includes(mode)} onChange={()=>toggleMode(mode)} label={mode}/>)}</div></fieldset>}
    <label>{t('归还点')}<select value={form.returnLocationId} onChange={e=>setForm({...form,returnLocationId:e.target.value})}>{serviceLocations.map(l=><option value={l.id} key={l.id}>{t(l.name)}</option>)}</select></label>
    <label>{t('现场备注（选填）')}<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
    {error&&<p className="form-error" role="alert">{t(error)}</p>}<button className="form-next" type="submit">{t('查看预约摘要')} <ArrowRight/></button>
  </form>:<Confirmation title="请确认设备预约" rows={[['设备',equipment.name],['服务点',serviceLocations.find(l=>l.id===form.locationId)!.name],['使用时间',form.scheduledAt],['数量',`${form.quantity} ${t('件')}`],['体验模式',form.equipmentId==='ramp'?`${t('现场评估')} · ${form.stepCount} ${t('级台阶')}`:form.modes.map(t).join(t('、'))]]} onBack={()=>setStep(1)} onSubmit={submit} submitLabel="提交演示预约"/>}</PageShell>
}

export function HelpCardPage(){const {t}=useI18n();const [message,setMessage]=useState('我需要引导，请告诉我前方的方向。');const options=['我需要引导，请告诉我前方的方向。','请用文字和我交流，谢谢。','请帮我联系最近的无障碍服务点。','这里有台阶，请协助我安全通过。'];return <PageShell><div className="help-card-page"><Link to="/help" className="help-card-close"><X/>{t('关闭求助卡')}</Link><span>{t('向身边的人展示下面这句话')}</span><div className="help-card-message" role="status" aria-live="polite">{t(message)}</div><div className="help-card-options" role="group" aria-label={t('选择求助内容')}>{options.map(option=><button key={option} aria-pressed={message===option} onClick={()=>setMessage(option)}>{t(option)}</button>)}</div><p>{t('紧急情况请拨打 110 或 120')}</p></div></PageShell>}

function WizardHeader({back,eyebrow,title,step}:{back:string;eyebrow:string;title:string;step:number}){const {locale,t}=useI18n();return <div className="wizard-header"><Link to={back}><ArrowLeft/>{t('返回帮助中心')}</Link><span className="eyebrow">{t(eyebrow)} · {locale==='zh'?`第 ${step} / 2 步`:`Step ${step} of 2`}</span><h1>{t(title)}</h1><div className="wizard-progress"><i className="active"/><i className={step===2?'active':''}/></div><p>{t('此为交互演示，不会向真实组织发送请求。')}</p></div>}
function Choice({checked,onChange,title,detail}:{checked:boolean;onChange:()=>void;title:string;detail:string}){const {t}=useI18n();return <label className={checked?'selected':''}><input type="radio" checked={checked} onChange={onChange}/><CalendarClock/><span><strong>{t(title)}</strong><small>{t(detail)}</small></span></label>}
function CheckChoice({checked,onChange,label}:{checked:boolean;onChange:()=>void;label:string}){const {t}=useI18n();return <label className={checked?'selected':''}><input type="checkbox" checked={checked} onChange={onChange}/><i>{checked&&<Check/>}</i><span>{t(label)}</span></label>}
function Confirmation({title,rows,onBack,onSubmit,submitLabel}:{title:string;rows:string[][];onBack:()=>void;onSubmit:()=>void;submitLabel:string}){const {t}=useI18n();return <div className="confirmation"><BadgeCheck/><span className="eyebrow">{t('提交前确认')}</span><h2>{t(title)}</h2><dl>{rows.map(([term,value])=><div key={term}><dt>{t(term)}</dt><dd>{t(value||'现在')}</dd></div>)}</dl><StatusBanner>{t('提交后将生成模拟记录，你可以在帮助中心推进状态或取消。')}</StatusBanner><div><button className="plain-button" onClick={onBack}><ArrowLeft/>{t('返回修改')}</button><button className="form-next" onClick={onSubmit}>{t(submitLabel)}<ArrowRight/></button></div></div>}

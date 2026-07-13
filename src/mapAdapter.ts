import AMapLoader from '@amap/amap-jsapi-loader'
import type { Coordinate } from './types'

export interface MapMarker { id: string; label: string; coordinate: Coordinate; kind: 'attraction' | 'facility' }
export interface MapAdapter {
  initialize(container: HTMLElement): Promise<'live' | 'mock'>
  renderMarkers(markers: MapMarker[]): void
  focus(coordinate: Coordinate): void
  destroy(): void
}

interface AMapInstance { setCenter(center: Coordinate): void; clearMap(): void; add(items: unknown[]): void; resize(): void; destroy(): void }
interface AMapApi {
  Map: new (container: HTMLElement, options: object) => AMapInstance
  Marker: new (options: object) => unknown
}

export class WestLakeMapAdapter implements MapAdapter {
  private map?: AMapInstance
  private mockContainer?: HTMLElement
  private resizeObserver?: ResizeObserver
  private markers: MapMarker[] = []
  private generation = 0

  async initialize(container: HTMLElement): Promise<'live' | 'mock'> {
    const generation = ++this.generation
    const key = import.meta.env.VITE_AMAP_KEY as string | undefined
    const security = import.meta.env.VITE_AMAP_SECURITY_CODE as string | undefined
    if (!key || !navigator.onLine) return this.initializeMock(container)
    try {
      if (security) {
        const globalWindow = window as typeof window & { _AMapSecurityConfig?: { securityJsCode: string } }
        globalWindow._AMapSecurityConfig = { securityJsCode: security }
      }
      const api = await AMapLoader.load({ key, version: '2.0' }) as unknown as AMapApi
      if (generation !== this.generation) return 'mock'
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      if (generation !== this.generation) return 'mock'

      const map = new api.Map(container, {
        center: [120.146, 30.251], zoom: 13, viewMode: '2D', resizeEnable: true
      })
      this.map = map
      ;(map as AMapInstance & { __api?: AMapApi }).__api = api
      this.resizeObserver = new ResizeObserver(() => map.resize())
      this.resizeObserver.observe(container)
      requestAnimationFrame(() => {
        if (this.map === map) {
          map.resize()
          this.renderMarkers(this.markers)
        }
      })
      return 'live'
    } catch {
      if (generation !== this.generation) return 'mock'
      return this.initializeMock(container)
    }
  }

  renderMarkers(markers: MapMarker[]) {
    this.markers = markers
    if (this.map) {
      const api = (this.map as AMapInstance & { __api?: AMapApi }).__api
      if (!api) return
      this.map.clearMap()
      this.map.add(markers.map((marker) => new api.Marker({ position: marker.coordinate, title: marker.label })))
      return
    }
    if (!this.mockContainer) return
    this.mockContainer.querySelectorAll('[data-map-marker]').forEach((node) => node.remove())
    markers.forEach((marker, index) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = `mock-marker mock-marker--${marker.kind}`
      button.dataset.mapMarker = marker.id
      button.setAttribute('aria-label', marker.label)
      button.title = marker.label
      button.style.left = `${18 + ((index * 27) % 68)}%`
      button.style.top = `${21 + ((index * 19) % 58)}%`
      button.textContent = marker.kind === 'attraction' ? '景' : '助'
      this.mockContainer?.appendChild(button)
    })
  }

  focus(coordinate: Coordinate) { this.map?.setCenter(coordinate) }
  destroy() {
    this.generation += 1
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
    this.map?.destroy()
    this.map = undefined
    this.mockContainer = undefined
  }

  private initializeMock(container: HTMLElement): 'mock' {
    this.map?.destroy()
    this.map = undefined
    this.mockContainer = container
    container.classList.add('mock-map')
    container.innerHTML = '<div class="mock-lake" aria-hidden="true"></div><span class="mock-label">WEST LAKE · 西湖</span>'
    this.renderMarkers(this.markers)
    return 'mock'
  }
}

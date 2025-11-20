import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const DEFAULT_CENTER = [77.5946, 12.9716] // Bengaluru, IN

function MapPreview() {
    const containerRef = useRef(null)
    const mapRef = useRef(null)
    const [status, setStatus] = useState('')

    useEffect(() => {
        const token = process.env.REACT_APP_MAPBOX_API_KEY
        if (!token) {
            setStatus('Add your REACT_APP_MAPBOX_API_KEY to show the live map preview.')
            return
        }

        mapboxgl.accessToken = token
        const map = new mapboxgl.Map({
            container: containerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: DEFAULT_CENTER,
            zoom: 11,
        })

        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
        new mapboxgl.Marker({ color: '#34e1eb' }).setLngLat(DEFAULT_CENTER).addTo(map)
        setStatus('Showing Bengaluru for demonstration — plug in your own coordinates.')

        mapRef.current = map
        return () => map.remove()
    }, [])

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className="text-sm font-semibold text-slate-700">Live preview</p>
                        <p className="text-xs text-slate-500">Uses Mapbox GL — runs only when an API key is present.</p>
                    </div>
                    <span className="rounded-full bg-balanced/60 px-3 py-1 text-xs font-semibold text-leap">Demo</span>
                </div>
                <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-slate-100">
                    <div ref={containerRef} className="h-full w-full" />
                </div>
            </div>
            <p className="text-sm text-slate-600">{status || 'Loading preview…'}</p>
        </div>
    )
}

export default MapPreview

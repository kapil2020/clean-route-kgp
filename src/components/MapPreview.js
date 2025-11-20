import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const DEFAULT_CENTER = [77.5946, 12.9716] // Bengaluru, IN

const ROUTES = {
    clean: {
        id: 'clean',
        label: 'Lowest pollution',
        accent: 'bg-emerald-100 text-emerald-800',
        distanceKm: 24.8,
        timeMin: 52,
        pollutionIndex: 0.27,
        description: 'Avoids the ring-road diesel corridor and leans on tree-covered streets.',
        path: [
            [77.571, 12.9776],
            [77.582, 12.9879],
            [77.5928, 12.9965],
            [77.6045, 13.0026],
            [77.6185, 13.017],
        ],
        notes: 'Uses smaller arterials with tree cover and fewer freight vehicles.',
    },
    fast: {
        id: 'fast',
        label: 'Fastest ETA',
        accent: 'bg-sky-100 text-sky-800',
        distanceKm: 22.5,
        timeMin: 46,
        pollutionIndex: 0.42,
        description: 'Prioritizes expressways to shorten drive time.',
        path: [
            [77.571, 12.9776],
            [77.58, 12.98],
            [77.61, 12.99],
            [77.63, 13.01],
            [77.644, 13.02],
        ],
        notes: 'Joins the outer ring road quickly to minimize signals.',
    },
    scenic: {
        id: 'scenic',
        label: 'Green corridor',
        accent: 'bg-lime-100 text-lime-800',
        distanceKm: 27.4,
        timeMin: 58,
        pollutionIndex: 0.31,
        description: 'Passes through Cubbon Park and Lalbagh for greener air.',
        path: [
            [77.571, 12.9776],
            [77.59, 12.97],
            [77.595, 12.96],
            [77.601, 12.95],
            [77.612, 12.952],
            [77.626, 12.96],
        ],
        notes: 'Adds a few minutes but follows park-adjacent stretches with better AQI.',
    },
    bike: {
        id: 'bike',
        label: 'Bike-friendly',
        accent: 'bg-amber-100 text-amber-800',
        distanceKm: 21.3,
        timeMin: 64,
        pollutionIndex: 0.36,
        description: 'Calmer turns and protected lanes where available.',
        path: [
            [77.571, 12.9776],
            [77.568, 12.989],
            [77.57, 13.0],
            [77.582, 13.012],
            [77.6, 13.018],
            [77.6185, 13.017],
        ],
        notes: 'Keeps speeds lower and skirts heavy-traffic flyovers.',
    },
}

function MapPreview() {
    const containerRef = useRef(null)
    const mapRef = useRef(null)
    const startMarkerRef = useRef(null)
    const endMarkerRef = useRef(null)
    const [status, setStatus] = useState('')
    const [mapReady, setMapReady] = useState(false)
    const [routeType, setRouteType] = useState('clean')
    const [origin, setOrigin] = useState('Majestic Bus Station, Bengaluru')
    const [destination, setDestination] = useState('HAL Airport Road, Bengaluru')

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
            zoom: 12,
        })

        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
        map.on('load', () => setMapReady(true))

        mapRef.current = map
        return () => map.remove()
    }, [])

    useEffect(() => {
        const map = mapRef.current
        if (!mapReady || !map) return

        const route = ROUTES[routeType]
        if (!route) return

        const geojson = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: route.path,
            },
            properties: {},
        }

        if (map.getSource('active-route')) {
            map.getSource('active-route').setData(geojson)
        } else {
            map.addSource('active-route', {
                type: 'geojson',
                data: geojson,
            })
            map.addLayer({
                id: 'active-route-line',
                type: 'line',
                source: 'active-route',
                paint: {
                    'line-color': '#34e1eb',
                    'line-width': 5,
                    'line-opacity': 0.9,
                },
            })
        }

        const bounds = route.path.reduce(
            (b, coord) => b.extend(coord),
            new mapboxgl.LngLatBounds(route.path[0], route.path[0])
        )
        map.fitBounds(bounds, { padding: 60, duration: 600 })

        const startMarker = new mapboxgl.Marker({ color: '#0ea5e9' }).setLngLat(route.path[0]).addTo(map)
        const endMarker = new mapboxgl.Marker({ color: '#10b981' }).setLngLat(route.path[route.path.length - 1]).addTo(map)

        if (startMarkerRef.current) startMarkerRef.current.remove()
        if (endMarkerRef.current) endMarkerRef.current.remove()
        startMarkerRef.current = startMarker
        endMarkerRef.current = endMarker

        setStatus(
            `Showing ${route.label.toLowerCase()} route between your stops. Adjust type to compare pollution and ETA tradeoffs.`
        )
    }, [routeType, mapReady])

    const selectedRoute = ROUTES[routeType]
    const routeList = Object.values(ROUTES)

    const handleSubmit = (event) => {
        event.preventDefault()
        setStatus(`Routes refreshed for ${origin} → ${destination}. Pick an option below to preview.`)
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-slate-700">Route planner</p>
                        <p className="text-xs text-slate-500">Enter the stops and compare four variants.</p>
                    </div>
                    <span className="rounded-full bg-balanced/60 px-3 py-1 text-xs font-semibold text-leap">Demo</span>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="space-y-1 text-sm">
                            <span className="font-medium text-slate-700">Origin</span>
                            <input
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-balanced focus:outline-none focus:ring-2 focus:ring-balanced/60"
                                placeholder="Where are you starting?"
                            />
                        </label>
                        <label className="space-y-1 text-sm">
                            <span className="font-medium text-slate-700">Destination</span>
                            <input
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-balanced focus:outline-none focus:ring-2 focus:ring-balanced/60"
                                placeholder="Where do you want to go?"
                            />
                        </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {routeList.map((route) => (
                            <button
                                key={route.id}
                                type="button"
                                onClick={() => setRouteType(route.id)}
                                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition hover:-translate-y-px hover:shadow-md ${
                                    routeType === route.id
                                        ? 'border-balanced bg-balanced text-slate-900'
                                        : 'border-slate-200 bg-slate-100 text-slate-700'
                                }`}
                            >
                                <span className={`h-2 w-2 rounded-full ${routeType === route.id ? 'bg-leap' : 'bg-slate-400'}`} />
                                {route.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">AQ index</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">ETA</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">Distance</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                            <p className="font-semibold">{selectedRoute.label}</p>
                            <p className="text-xs text-slate-500">{selectedRoute.description}</p>
                            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-800">
                                <div className="rounded-lg bg-white p-2 shadow-sm">
                                    <p className="text-[10px] uppercase text-slate-500">AQ index</p>
                                    <p className="text-base">{selectedRoute.pollutionIndex.toFixed(2)}</p>
                                </div>
                                <div className="rounded-lg bg-white p-2 shadow-sm">
                                    <p className="text-[10px] uppercase text-slate-500">ETA</p>
                                    <p className="text-base">{selectedRoute.timeMin} min</p>
                                </div>
                                <div className="rounded-lg bg-white p-2 shadow-sm">
                                    <p className="text-[10px] uppercase text-slate-500">Distance</p>
                                    <p className="text-base">{selectedRoute.distanceKm} km</p>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-slate-500">{selectedRoute.notes}</p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                            <p className="font-semibold">Compare options</p>
                            <ul className="mt-2 space-y-1 text-xs text-slate-600">
                                {routeList.map((route) => (
                                    <li key={route.id} className="flex items-center justify-between rounded-md bg-white px-2 py-1 shadow-sm">
                                        <span className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${routeType === route.id ? 'bg-leap' : 'bg-slate-300'}`} />
                                            {route.label}
                                        </span>
                                        <span className="flex items-center gap-3 text-[11px] font-semibold text-slate-700">
                                            <span>{route.distanceKm} km</span>
                                            <span>{route.timeMin} min</span>
                                            <span
                                                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ${route.accent}`}
                                            >
                                                AQ {route.pollutionIndex.toFixed(2)}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                        <p>{status || 'Loading preview…'}</p>
                        <button
                            type="submit"
                            className="rounded-full bg-balanced px-4 py-2 text-xs font-semibold text-slate-900 shadow transition hover:-translate-y-px hover:shadow-md"
                        >
                            Refresh routes
                        </button>
                    </div>
                </form>

                <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-slate-100">
                    <div ref={containerRef} className="h-full w-full" />
                    {!mapRef.current && (
                        <div className="flex h-full flex-col items-center justify-center space-y-2 bg-slate-50 text-center text-sm text-slate-600">
                            <p className="font-semibold text-slate-700">Map preview</p>
                            <p>Set REACT_APP_MAPBOX_API_KEY to enable the interactive view.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MapPreview

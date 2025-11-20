import MapPreview from './components/MapPreview'
import './App.css'

const callouts = [
    {
        title: 'Pick cleaner paths',
        body: 'Compare low-pollution, fast, green-corridor, and bike-friendly options side by side.',
    },
    {
        title: 'Mapbox + Tailwind',
        body: 'Built with Create React App, TailwindCSS, and Mapbox GL so it deploys cleanly on Vercel.',
    },
    {
        title: 'API-key ready',
        body: 'Add your Mapbox token as REACT_APP_MAPBOX_API_KEY and the live map comes online instantly.',
    },
]

function App() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-balanced text-leap font-bold shadow-sm">
                            CR
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Clean Route</p>
                            <p className="text-sm text-slate-500">Air-aware routing prototype</p>
                        </div>
                    </div>
                    <a
                        className="rounded-lg bg-balanced px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:translate-y-px hover:shadow-md"
                        href="https://www.mapbox.com/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Powered by Mapbox
                    </a>
                </div>
            </header>

            <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 lg:flex-row">
                <section className="flex-1 space-y-6">
                    <div className="space-y-3">
                        <p className="inline-flex items-center rounded-full bg-balanced/40 px-3 py-1 text-xs font-semibold text-leap">
                            Ready for Vercel
                        </p>
                        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                            Route around pollution and arrive feeling better
                        </h1>
                        <p className="max-w-2xl text-lg text-slate-600">
                            Enter an origin, destination, and the type of route you want—then preview cleaner alternatives on the
                            map. The project ships with a CRA build pipeline so hosting works out of the box.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {callouts.map((item) => (
                            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="text-base font-semibold">{item.title}</p>
                                <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm space-y-1">
                        <p className="font-semibold">Deployment notes</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Set <code>REACT_APP_MAPBOX_API_KEY</code> as an environment variable for the live map.</li>
                            <li>Optional: extend the scoring logic with your own air-quality or traffic data provider.</li>
                            <li>Run <code>yarn build</code> locally to confirm the Vercel build step succeeds.</li>
                        </ul>
                    </div>
                </section>

                <section className="flex-1">
                    <MapPreview />
                </section>
            </main>
        </div>
    )
}

export default App

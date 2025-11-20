import MapPreview from './components/MapPreview'
import './App.css'

const callouts = [
    {
        title: 'Cleaner trips',
        body: 'Compare multiple routes and choose the path with lower estimated air pollution.',
    },
    {
        title: 'Familiar stack',
        body: 'Built with Create React App, Tailwind CSS, and Mapbox GL so it deploys cleanly on Vercel.',
    },
    {
        title: 'Configurable',
        body: 'Bring your own API keys via environment variables without touching the code.',
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
                            <p className="text-sm text-slate-500">Air-aware navigation prototype</p>
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
                            Find routes that cut your exposure to air pollution
                        </h1>
                        <p className="max-w-2xl text-lg text-slate-600">
                            Drop in your Mapbox and air-quality keys, deploy to Vercel, and start comparing safer routes. The
                            project now includes the standard React build pipeline so hosting works out of the box.
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

                    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
                        <p className="font-semibold">Deployment notes</p>
                        <ul className="list-disc pl-5">
                            <li>Set <code>REACT_APP_MAPBOX_API_KEY</code> as an environment variable for the live map.</li>
                            <li>Optional: add your air-quality provider keys if you expand the prototype.</li>
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

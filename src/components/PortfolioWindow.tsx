import { motion, AnimatePresence } from 'framer-motion';
import { PlanetData } from '../data/portfolio';

interface PortfolioWindowProps {
    planet: PlanetData | null;
}

export function PortfolioWindow({ planet }: PortfolioWindowProps) {
    return (
        <AnimatePresence>
            {planet && (
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute top-1/2 right-10 -translate-y-1/2 w-96 p-6 
                             bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl
                             shadow-2xl shadow-black/50 overflow-hidden z-10 text-right"
                    style={{
                        boxShadow: `0 0 40px ${planet.color}20` // Subtle colored glow
                    }}
                >
                    {/* Decorative colored line top */}
                    <div
                        className="absolute top-0 right-0 w-full h-1"
                        style={{ backgroundColor: planet.color }}
                    />

                    <div className="flex flex-col gap-4 items-end">
                        {/* Header */}
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-1 justify-end">
                                <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
                                    ID: {String(planet.id).padStart(2, '0')}
                                </span>
                                <span
                                    className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full text-black"
                                    style={{ backgroundColor: planet.color }}
                                >
                                    {planet.type}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight text-right">
                                {planet.name}
                            </h2>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/20" />

                        {/* Content */}
                        <div className="space-y-4 text-right">
                            <p className="text-white leading-relaxed text-sm">
                                {planet.description}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                                <div className="bg-white/10 p-3 rounded-lg border border-white/10 flex flex-col items-end">
                                    <div className="text-xs text-white uppercase tracking-wider mb-1">Orbit Distance</div>
                                    <div className="text-white font-mono font-bold">{planet.distance} AU</div>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg border border-white/10 flex flex-col items-end">
                                    <div className="text-xs text-white uppercase tracking-wider mb-1">Orbital Speed</div>
                                    <div className="text-white font-mono font-bold">{planet.speed} km/s</div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action (Future proofing) */}
                        <button
                            className="mt-2 w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all
                                     hover:brightness-110 active:scale-[0.98]"
                            style={{
                                backgroundColor: `${planet.color}20`,
                                color: planet.color,
                                border: `1px solid ${planet.color}40`
                            }}
                        >
                            View Details
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

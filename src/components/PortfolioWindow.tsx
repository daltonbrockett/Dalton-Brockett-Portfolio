import { motion, AnimatePresence } from 'framer-motion';
import { PlanetData } from '../data/portfolio';

interface PortfolioWindowProps {
    planet: PlanetData | null;
    onViewMore: () => void;
}

export function PortfolioWindow({ planet, onViewMore }: PortfolioWindowProps) {
    return (
        <AnimatePresence>
            {planet && (
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] p-8 
                             bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl
                             shadow-2xl shadow-black/50 overflow-hidden z-10 text-right"
                    style={{
                        boxShadow: `0 0 60px ${planet.color}20` // Subtle colored glow
                    }}
                >
                    {/* Decorative colored line top */}
                    <div
                        className="absolute top-0 right-0 w-full h-1 z-20"
                        style={{ backgroundColor: planet.color }}
                    />

                    {/* Hero Image */}
                    {planet.details?.heroImage && (
                        <div className="absolute top-0 left-0 w-full h-48 z-0">
                            <img
                                src={planet.details.heroImage}
                                alt={planet.role}
                                className="w-full h-full object-cover opacity-60 mask-image-gradient"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
                        </div>
                    )}

                    <div className={`flex flex-col gap-6 items-end relative z-10 ${planet.details?.heroImage ? 'mt-32' : ''}`}>
                        {/* Header */}
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-3 mb-2 justify-end">
                                <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
                                    ID: {String(planet.id).padStart(2, '0')}
                                </span>
                                <span
                                    className="px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full text-black"
                                    style={{ backgroundColor: planet.color }}
                                >
                                    {planet.type}
                                </span>
                            </div>
                            <h2 className="text-5xl font-bold text-white tracking-tight text-right leading-tight">
                                {planet.role} - {planet.organization}
                            </h2>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/20" />

                        {/* Content */}
                        <div className="space-y-4 text-right w-full">
                            <p className="text-white/90 leading-relaxed text-lg">
                                {planet.description}
                            </p>
                        </div>

                        {/* Footer Action (Future proofing) */}
                        <button
                            onClick={onViewMore}
                            className="mt-2 w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all
                                     hover:brightness-110 active:scale-[0.98]"
                            style={{
                                backgroundColor: `${planet.color}20`,
                                color: planet.color,
                                border: `1px solid ${planet.color}40`
                            }}
                        >
                            View More Details
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

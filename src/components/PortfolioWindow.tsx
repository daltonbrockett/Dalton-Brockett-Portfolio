import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioNodeData } from '../data/portfolio';

interface PortfolioWindowProps {
    node: PortfolioNodeData | null;
    onViewMore: () => void;
    onClose: () => void;
}

export function PortfolioWindow({ node, onViewMore, onClose }: PortfolioWindowProps) {
    return (
        <AnimatePresence>
            {node && (
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute top-1/2 right-4 md:right-10 -translate-y-1/2 w-[90vw] md:w-[500px] p-6 md:p-8 
                             bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl
                             shadow-2xl shadow-black/50 overflow-hidden z-10 text-right"
                    style={{
                        boxShadow: `0 0 60px ${node.color}20` // Subtle colored glow
                    }}
                >
                    {/* Decorative colored line top */}
                    <div
                        className="absolute top-0 right-0 w-full h-1 z-20"
                        style={{ backgroundColor: node.color }}
                    />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-white/20 text-white/70 hover:text-white transition-all z-30"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Hero Image */}
                    {node.details?.heroImage && (
                        <div className="absolute top-0 left-0 w-full h-32 md:h-48 z-0">
                            <img
                                src={node.details.heroImage}
                                alt={node.role}
                                className="w-full h-full object-cover opacity-60 mask-image-gradient"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
                        </div>
                    )}

                    <div className={`flex flex-col gap-4 md:gap-6 items-end relative z-10 ${node.details?.heroImage ? 'mt-24 md:mt-32' : ''}`}>
                        {/* Header */}
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-3 mb-2 justify-end">
                                {/* REMOVED ID DISPLAY */}
                                <span
                                    className="px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs uppercase tracking-wider font-bold rounded-full text-black"
                                    style={{ backgroundColor: node.color }}
                                >
                                    {node.type}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight text-right leading-tight">
                                {node.role}
                                <span className="block text-xl md:text-3xl text-white/80 mt-1">{node.organization}</span>
                            </h2>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/20" />

                        {/* Content */}
                        <div className="space-y-4 text-right w-full">
                            <p className="text-white/90 leading-relaxed text-lg">
                                {node.description}
                            </p>
                        </div>

                        {/* Footer Action (Future proofing) */}
                        <button
                            onClick={onViewMore}
                            className="mt-2 w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all
                                     hover:brightness-110 active:scale-[0.98]"
                            style={{
                                backgroundColor: `${node.color}20`,
                                color: node.color,
                                border: `1px solid ${node.color}40`
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

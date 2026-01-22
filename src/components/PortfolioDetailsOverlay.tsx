import { motion, AnimatePresence } from 'framer-motion';
import { PlanetData } from '../data/portfolio';
import ReactMarkdown from 'react-markdown';

interface PortfolioDetailsOverlayProps {
    planet: PlanetData;
    onClose: () => void;
}

export function PortfolioDetailsOverlay({ planet, onClose }: PortfolioDetailsOverlayProps) {
    if (!planet.details) return null;

    const { details } = planet;

    // Helper to determine if a string is a video URL (basic check)
    const isVideo = (url: string) => {
        return url.match(/\.(mp4|webm|ogg)$/i) || url.includes("youtube.com") || url.includes("vimeo.com");
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl overflow-y-auto"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="fixed top-6 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 group"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white group-hover:scale-110 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="w-full h-full max-w-7xl mx-auto p-8 relative flex flex-col"
                >
                    {/* Hero Section */}
                    {details.heroImage && (
                        <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-8 relative shrink-0">
                            <img
                                src={details.heroImage}
                                alt={`${planet.role} Hero`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-8 left-8">
                                <span
                                    className="px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full text-black mb-4 inline-block"
                                    style={{ backgroundColor: planet.color }}
                                >
                                    {planet.type}
                                </span>
                                <h1 className="text-5xl font-bold text-white mb-2">{planet.role} - {planet.organization}</h1>
                                <p className="text-xl text-gray-300 font-mono">{details.location} <span className="mx-2 text-white/30">|</span> {details.timeline}</p>
                            </div>
                        </div>
                    )}

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
                        {/* Left Column: Description & Tech */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Markdown Description */}
                            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                                <ReactMarkdown>{details.longDescription}</ReactMarkdown>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-white rounded-full" />
                                    Technology Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {details.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-mono text-gray-300 hover:border-white/30 transition-colors"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Links */}
                            {details.links.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-white rounded-full" />
                                        Links & Resources
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {details.links.map((link) => (
                                            <a
                                                key={link.url}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2"
                                            >
                                                {link.label}
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Gallery */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6">Gallery</h3>
                                <div className="grid gap-6">
                                    {/* Videos First */}
                                    {details.videos && details.videos.map((vid, idx) => (
                                        <div key={`vid-${idx}`} className="aspect-video rounded-xl overflow-hidden border border-white/10 relative bg-black">
                                            <video
                                                controls
                                                className="w-full h-full object-cover"
                                                src={vid}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    ))}

                                    {/* Images */}
                                    {details.images && details.images.map((img, idx) => (
                                        <div key={`img-${idx}`} className="aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-zoom-in relative">
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10" />
                                            <img
                                                src={img}
                                                alt={`Gallery ${idx}`}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

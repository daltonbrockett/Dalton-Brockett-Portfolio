import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioNodeData } from '../data/portfolio';
import ReactMarkdown from 'react-markdown';

interface PortfolioDetailsOverlayProps {
    node: PortfolioNodeData;
    onClose: () => void;
}

export function PortfolioDetailsOverlay({ node, onClose }: PortfolioDetailsOverlayProps) {
    if (!node.details) return null;

    const { details } = node;


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
                    className="w-full h-full max-w-7xl mx-auto p-4 md:p-8 relative flex flex-col"
                >
                    {/* Hero Section */}
                    {details.heroImage && (
                        <div className="w-full h-48 md:h-96 rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8 relative shrink-0">
                            <img
                                src={details.heroImage}
                                alt={`${node.role} Hero`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 right-4">
                                <span
                                    className="px-2 py-1 md:px-3 text-[10px] md:text-xs uppercase tracking-wider font-bold rounded-full text-black mb-2 md:mb-4 inline-block"
                                    style={{ backgroundColor: node.color }}
                                >
                                    {node.type}
                                </span>
                                <h1 className="text-2xl md:text-5xl font-bold text-white mb-1 md:mb-2 leading-tight">{node.role}</h1>
                                <h2 className="text-xl md:text-3xl text-white/80 mb-2">{node.organization}</h2>
                                <p className="text-sm md:text-xl text-gray-300 font-mono">{details.location} <span className="mx-2 text-white/30">|</span> {details.timeline}</p>
                            </div>
                        </div>
                    )}

                    {/* Content Container - Flex Col */}
                    <div className="pb-20 flex flex-col gap-8 md:gap-16">
                        {/* Top: Description, Tech, Links */}
                        <div className="w-full space-y-8 md:space-y-12">
                            {/* Markdown Description */}
                            <div className="prose prose-invert prose-sm md:prose-lg max-w-none text-gray-300">
                                <ReactMarkdown>{details.longDescription}</ReactMarkdown>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-white rounded-full" />
                                    Technology Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {details.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 rounded-lg text-xs md:text-sm font-mono text-gray-300 hover:border-white/30 transition-colors"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Photos - Styled like other sections */}
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-white rounded-full" />
                                    Photos & Videos
                                </h3>
                                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent snap-x snap-mandatory">
                                    {/* Videos First */}
                                    {details.videos && details.videos.map((vid, idx) => (
                                        <div key={`vid-${idx}`} className="w-[85vw] md:w-[600px] shrink-0 aspect-video rounded-xl overflow-hidden border border-white/10 relative bg-black snap-center shadow-2xl">
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
                                        <div key={`img-${idx}`} className="w-[85vw] md:w-[600px] shrink-0 aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-zoom-in relative snap-center shadow-2xl">
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10" />
                                            <img
                                                src={img}
                                                alt={`Gallery ${idx}`}
                                                loading="lazy"
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Links */}
                            {details.links.length > 0 && (
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
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
                                                className="px-4 py-3 md:px-6 bg-white text-black font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2 text-sm md:text-base"
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

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

interface LandingPageProps {
    onStarted: () => void;
}

export function LandingPage({ onStarted }: LandingPageProps) {
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
            <h1 className="text-4xl font-bold mb-8">Welcome to my portfolio!</h1>

            <div className="flex flex-col items-center gap-2 text-gray-400 text-sm">
                <p><span className="text-purple-400 font-semibold">Drag</span> to rotate</p>
                <p><span className="text-purple-400 font-semibold">Scroll</span> to zoom</p>
                <p><span className="text-purple-400 font-semibold">Click</span> orbiting items to explore more!</p>
            </div>

            <button
                onClick={onStarted}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors cursor-pointer mt-12"
            >
                Enter
            </button>
        </div>
    );
}

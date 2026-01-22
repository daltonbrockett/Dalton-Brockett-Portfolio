export interface PlanetData {
    id: number;
    role: string;
    organization: string;
    type: "project" | "job" | "hackathon";
    description: string;
    distance: number;
    speed: number;
    size: number;
    color: string;
    details?: {
        heroImage?: string;
        images: string[];
        videos: string[]; // YouTube/Vimeo links or direct URLs
        techStack: string[];
        location: string;
        timeline: string;
        longDescription: string;
        links: { label: string; url: string }[];
    };
}

export const APPS_DATA: PlanetData[] = [
    {
        id: 1,
        role: "Mixed Reality Engineer",
        organization: "Distance Tech",
        type: "job",
        description: "Built a vehicle-digital-twin simulator in Unity (C#) interacting with ROS 2 (LiDAR, RGB, IR). Developed a sensor-fusion pipeline for an XR Night Vision system.",
        distance: 10,
        speed: 0.2,
        size: 1.2,
        color: "#3b82f6",
        details: {
            heroImage: "/assets/portfolio/Distance.png",
            images: [
                "/assets/portfolio/Vehicle-Twin-Sim.jpeg",
                "/assets/portfolio/IMG_9899.PNG",
                "/assets/portfolio/IMG_0081.jpeg",
                "/assets/portfolio/Distance-Movies.PNG",
                "assets/portfolio/IMG_9824.PNG",
                "assets/portfolio/Awe.PNG",
                "assets/portfolio/Noah.jpeg",
                "assets/portfolio/SibNElv.jpeg",
                "assets/portfolio/Take.jpeg"
            ],
            videos: [
                "assets/portfolio/Sompafest.MOV"
            ],
            techStack: ["Unity", "C#", "C++", "ROS 2", "LiDAR", "IR", "Sensor Fusion", "Computer Vision", "OpenXR"],
            location: "Helsinki, Finland",
            timeline: "June 2025 - Sept 2025",
            longDescription: `

In the summer of 2025, I had the unique opportunity to work abroad in Helsinki, Finland! Contributing to cutting-edge mixed reality technology at Distance Technologies Oy. 
My core focus was building and integrating a high fidelity vehicle digital twin simulator to test our platform's capabilities.
Using Unity, I further developed a comprehensive simulator that generated and published ROS 2 topics, mimicking real world sensor outputs. 
I then designed C++ ROS 2 subscribers into our Distance stack to be highly modular, allowing the system to work between simulated data and the real physical sensors without code changes.
The optimized end-to-end system updated in real time with a negligible latency overhead of just ~0.01ms.  


In my free time, I had a great time exploring Europe, meeting lots of new people, playing lots of music, and sauna'ing! I ended up traveling almost every weekend to different countries in Europe(thank you Alaskan Airline miles lol).
In total I went to 9 different countries including: Estonia, Sweden, Denmark, UK, Austria, Czechia, Ireland(Mom and Dad met up with me :D), Netherlands, and of course Finland. Really excited
to make my way back to that side of the Atlantic and explore some more.  


Can't forget to mention the sauna culture! The Finns really know what they're doing. I went to sauna as much as I could, whether it be at my apartment, or my favorite community
sauna, Sompasauna. I'd go with some of my coworkers and play guitar and sing for the other sauna-goers. Those were some special days I'll remember for a long time.
            `,
            links: [
                { label: "Company Website", url: "https://distance.tech" }
            ]
        }
    },
    {
        id: 2,
        role: "Gaze Groove",
        organization: "MIT Reality Hack",
        type: "hackathon",
        description: "Winner: Best Use of STYLY. Apple Vision Pro app enabling musicians to practice with a virtual ensemble using gaze tracking & spatial audio.",
        distance: 15,
        speed: 0.25,
        size: 1.0,
        color: "#ec4899",
        details: {
            heroImage: "/assets/portfolio/Gaze-Groove.jpeg",
            images: [
                "/assets/portfolio/Winner-MIT.jpeg",
                "/assets/portfolio/Visual-Scripting.jpeg",
                "/assets/portfolio/Snowy-MIT.jpeg",
                "/assets/portfolio/VisionPro-Interaction.jpeg",
                "/assets/portfolio/Plane-Boston.jpeg",
                "/assets/portfolio/Dom.jpeg",
            ],
            videos: [],
            techStack: ["Unity", "C#", "STYLY", "Apple Vision Pro", "Gaze Tracking", "Spatial Audio"],
            location: "MIT",
            timeline: "January 2025",
            longDescription: `
# Gaze Groove at MIT Reality Hack

At **MIT Reality Hack**, I developed an 
            `,
            links: [{ label: "Devpost", url: "https://devpost.com/software/gaze-groove?_gl=1*1wwr9p6*_gcl_au*NDkxMDk1MjIxLjE3NjkwNTQ2NjE.*_ga*MTY1ODIzNTIyMS4xNzY5MDU0NjYx*_ga_0YHJK3Y10M*czE3NjkwNTQ2NjEkbzEkZzAkdDE3NjkwNTQ2NjEkajYwJGwwJGgw" }]
        }
    },
    {
        id: 3,
        role: "Software Engineering Intern",
        organization: "Boeing",
        type: "job",
        description: "Developed HoloLens 2 CAD viewer tools using Unity/C#. Implemented game controller functionality for CAD software in Python.",
        distance: 20,
        speed: 0.15,
        size: 1.1,
        color: "#0ea5e9"
    },
    {
        id: 4,
        role: "Augmented Reality Headset",
        organization: "Hardware Project",
        type: "project",
        description: "Built a fully functional AR headset from scratch. Created custom vertex processors/shaders (Three.js, GLSL) and integrated hardware/IMU.",
        distance: 25,
        speed: 0.18,
        size: 0.9,
        color: "#22c55e"
    },
    {
        id: 5,
        role: "VR Integration Intern",
        organization: "Boeing",
        type: "job",
        description: "Evaluated aircraft designs in IC.IDO VR for ergonomic improvements. Created immersive training resources for manufacturing workflows.",
        distance: 30,
        speed: 0.12,
        size: 1.1,
        color: "#6366f1"
    },
    {
        id: 6,
        role: "StoryboardXR",
        organization: "UW",
        type: "project",
        description: "Designed a native 3D mixed-reality storyboarding app for Apple Vision Pro. Implemented hand-joint-based gesture recognition.",
        distance: 35,
        speed: 0.1,
        size: 0.95,
        color: "#a855f7"
    }
];

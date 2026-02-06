export interface PortfolioNodeData {
    id: number;
    role: string;
    organization: string;
    type: "project" | "job" | "hackathon";
    description: string;
    distance: number;
    speed: number;
    size: number;
    color: string;
    visualType: 'sphere' | 'model' | 'flag';
    texture?: string;
    modelPath?: string; // Path to .glb/.gltf file
    modelScale?: number; // Scale of the imported model
    rotationOffset?: number; // Offset in radians for the model rotation (Y-axis / Yaw)
    pitchOffset?: number; // Offset in radians for X-axis rotation (Pitch)
    rollOffset?: number; // Offset in radians for Z-axis rotation (Roll)
    spinSpeed?: number; // Speed of auto-rotation around Y-axis
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

export const APPS_DATA: PortfolioNodeData[] = [
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
        visualType: 'flag',
        texture: "/assets/textures/finland_archipelago_v2.png",
        modelScale: 0.5,
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
        visualType: 'model',
        modelPath: "/assets/models/apple_vision_pro.glb",
        modelScale: 5,
        spinSpeed: 0.5,
        details: {
            heroImage: "/assets/portfolio/Snowy-MIT.jpeg",
            images: [
                "/assets/portfolio/Winner-MIT.jpeg",
                "/assets/portfolio/VisionPro-Interaction.jpeg",
                "/assets/portfolio/Gaze-Groove.jpeg",
                "/assets/portfolio/Plane-Boston.jpeg",
                "/assets/portfolio/Dom.jpeg",
                "/assets/portfolio/Visual-Scripting.jpeg",
            ],
            videos: [],
            techStack: ["Unity", "C# Visual Scripting", "STYLY", "Apple Vision Pro", "Gaze Tracking", "Spatial Audio", "Interaction Design"],
            location: "MIT",
            timeline: "January 2025",
            longDescription: `
At **MIT Reality Hack**, my team and I won the **Best Use of STYLY** award!

We built an XR tool on Apple Vision Pro that lets musicians rehearse with a virtual ensemble. My primary focus was on interaction design and the user's sense of agency. 
I was responsible for scripting the gaze tracking and scene interaction mechanics, creating a system where a musician could control the ensemble simply by looking at the
musician they wanted to cue in and then tapping their fingers together to play. 
I also architected the overall app flow and audio logic to ensure a seamless practice session. 
The experience was brought to life by a teammate who composed an original Latin Jazz score in under 24 hours!

This was my first time in Boston and I absolutely loved it. The city is beautiful and the people are great. I took the trip from Seattle with one of
best friends, Dom, who is also a developer. Dom and I had just come off another hackathon win at Stanford's "Immerse the Bay", where we actually got our
invite to Reality Hack. I'm really glad we ended up going, it was a great time! I could definitely see myself going back to Boston in the future, might 
have to get over Super Bowl XLIX first though lol... 
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
        color: "#0ea5e9",
        visualType: 'model',
        modelPath: "public/assets/models/boeing_787-9.glb",
        modelScale: .1,
        rotationOffset: -Math.PI / 20,
        pitchOffset: -Math.PI / 1000,
        rollOffset: Math.PI / 8,
        details: {
            heroImage: "/assets/portfolio/777-9.jpg",
            images: [
                "/assets/portfolio/HoloLens.jpeg",
                "/assets/portfolio/Planes.jpeg",
                "/assets/portfolio/Relaxing.jpeg",
                "/assets/portfolio/Backpacking.jpeg",
                "/assets/portfolio/Beautiful-Guitar.jpeg",
            ],
            videos: [],
            techStack: ["Unity", "C#", "HoloLens 2", "CAD", "Python"],
            location: "Everett, WA",
            timeline: "June 2024 - September 2024",
            longDescription: `


            `,
            links: [{ label: "Boeing Website", url: "https://www.boeing.com" }]
        }
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
        color: "#22c55e",
        visualType: 'sphere'
    },
    {
        id: 5,
        role: "Virtual Reality Integration Intern",
        organization: "Boeing",
        type: "job",
        description: "Evaluated aircraft designs in IC.IDO VR for ergonomic improvements. Created immersive training resources for manufacturing workflows.",
        distance: 30,
        speed: 0.12,
        size: 1.1,
        color: "#6366f1",
        visualType: 'model',
        modelPath: "/assets/models/boeing_747-8i.glb",
        modelScale: .18, // Adjusted estimated scale, user can tune
        rotationOffset: 0, // Yaw correction
        pitchOffset: -Math.PI / 100,
        rollOffset: Math.PI / 7,
        details: {
            heroImage: "/assets/portfolio/Everett.jpg",
            images: [
                "/assets/portfolio/Wow-747.jpeg",
                "/assets/portfolio/VRing.jpeg",
                "/assets/portfolio/Dubs.jpeg",
                "/assets/portfolio/Vives.jpeg",
                "/assets/portfolio/Seattle-Night.jpeg",
            ],
            videos: [],
            techStack: ["IC.IDO", "VR", "CAD", "Ergonomic Evaluation & Design"],
            location: "Everett, WA",
            timeline: "June 2024 - September 2024",
            longDescription: `
My journey into immersive technology began during my freshman year when I was selected for the Boeing ALVA program, 
a collaboration with the University of Washington(I was also part of the 25th cohort :D). Working within a specialized VR lab at Boeing, 
I served as a bridge between XR development and industrial application by developing high fidelity simulations for ergonomic evaluations and immersive design reviews.

My primary project involved using IC.IDO to analyze and relay the ergonomic impact of manufacturing processes on the Everett factory floor. 
By creating immersive scenes, I enabled engineers and mechanics to visualize workflows and identify physical stressors in a risk-free virtual environment. 
To ensure the long term utility of these tools, I also authored a suite of internal training resources and videos, 
streamlining the onboarding process for Boeing employees and expanding the reach of the VR lab's capabilities.

After my internship concluded, I received a return offer from my team to join Boeing the next summer as a Software Engineering Intern!`,
            //TODO: Add link from Software Engineering Intern to the actual SWE internship page
            links: [{ label: "Boeing Website", url: "https://www.boeing.com" }]
        }
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
        color: "#a855f7",
        visualType: 'sphere'
    }
];

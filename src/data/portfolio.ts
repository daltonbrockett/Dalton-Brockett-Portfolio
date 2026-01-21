export interface PlanetData {
    id: number;
    name: string;
    type: "project" | "job";
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
        role: string;
        timeline: string;
        longDescription: string;
        links: { label: string; url: string }[];
    };
}

export const APPS_DATA: PlanetData[] = [
    {
        id: 1,
        name: "Mixed Reality Engineer - Distance Tech",
        type: "job",
        description: "Built a vehicle-digital-twin simulator in Unity (C#) interacting with ROS 2 (LiDAR, RGB, IR). Developed a sensor-fusion pipeline for an XR Night Vision system.",
        distance: 10,
        speed: 0.2,
        size: 1.2,
        color: "#3b82f6",
        details: {
            heroImage: "/assets/portfolio/Vehicle-Twin-Sim.jpeg", // Placeholder
            images: [
                "/assets/portfolio/IMG_9899.PNG",
                "/assets/portfolio/IMG_0081.jpeg",
                "assets/portfolio/IMG_9824.PNG"
            ],
            videos: [],
            techStack: ["Unity", "C#", "C++", "ROS2", "LiDAR", "IR", "Sensor Fusion", "Computer Vision", "XR"],
            role: "Mixed Reality Engineer",
            timeline: "June 2025 - Sept 2025",
            longDescription: `
# Digital Twin Simulator & XR Sensor Fusion

At **Distance Technologies Oy**, I worked on cutting-edge mixed reality tech for automotive applications. 

## Key Achievements
*   **Vehicle Digital Twin**: Built a comprehensive simulator in Unity interacting with ROS 2 topics.
*   **Sensor Fusion**: Developed a pipeline combining LiDAR, RGB, and IR data for a glasses-free 3D display.
*   **Performance**: Optimized rendering techniques to maintain <0.01ms latency overhead.
            `,
            links: [
                { label: "Company Website", url: "https://distance.tech" }
            ]
        }
    },
    {
        id: 2,
        name: "Gaze Groove - MIT Reality Hack",
        type: "project",
        description: "Winner: Best Use of STYLY. Apple Vision Pro app enabling musicians to practice with a virtual ensemble using gaze tracking & spatial audio.",
        distance: 15,
        speed: 0.25,
        size: 1.0,
        color: "#ec4899"
    },
    {
        id: 3,
        name: "Software Engineering Intern - Boeing",
        type: "job",
        description: "Developed HoloLens 2 CAD viewer tools using Unity/C#. Implemented game controller functionality for CAD software in Python.",
        distance: 20,
        speed: 0.15,
        size: 1.1,
        color: "#0ea5e9"
    },
    {
        id: 4,
        name: "Augmented Reality Headset",
        type: "project",
        description: "Built a fully functional AR headset from scratch. Created custom vertex processors/shaders (Three.js, GLSL) and integrated hardware/IMU.",
        distance: 25,
        speed: 0.18,
        size: 0.9,
        color: "#22c55e"
    },
    {
        id: 5,
        name: "VR Integration Intern - Boeing",
        type: "job",
        description: "Evaluated aircraft designs in IC.IDO VR for ergonomic improvements. Created immersive training resources for manufacturing workflows.",
        distance: 30,
        speed: 0.12,
        size: 1.1,
        color: "#6366f1"
    },
    {
        id: 6,
        name: "StoryboardXR - UW",
        type: "project",
        description: "Designed a native 3D mixed-reality storyboarding app for Apple Vision Pro. Implemented hand-joint-based gesture recognition.",
        distance: 35,
        speed: 0.1,
        size: 0.95,
        color: "#a855f7"
    }
];

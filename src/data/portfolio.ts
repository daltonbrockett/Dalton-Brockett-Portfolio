export interface PlanetData {
    id: number;
    name: string;
    type: "project" | "job";
    description: string;
    distance: number;
    speed: number;
    size: number;
    color: string;
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
        color: "#3b82f6"
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

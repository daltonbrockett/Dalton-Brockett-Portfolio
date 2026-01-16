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
        name: "Distance Tech",
        type: "job",
        description: "Mixed Reality Engineer. Built vehicle digital-twins & XR sensor fusion.",
        distance: 10,
        speed: 0.4,
        size: 1.2,
        color: "#3b82f6"
    },
    {
        id: 2,
        name: "Gaze Groove",
        type: "project",
        description: "MIT Reality Hack Winner. AVP app with gaze tracking & spatial audio.",
        distance: 15,
        speed: 0.5,
        size: 1.0,
        color: "#ec4899"
    },
    {
        id: 3,
        name: "Boeing SWE",
        type: "job",
        description: "Developed HoloLens 2 CAD viewer & pose mapping tools.",
        distance: 20,
        speed: 0.3,
        size: 1.1,
        color: "#0ea5e9"
    },
    {
        id: 4,
        name: "AR Headset",
        type: "project",
        description: "Custom AR headset: hardware + Three.js/GLSL software stack.",
        distance: 25,
        speed: 0.35,
        size: 0.9,
        color: "#22c55e"
    },
    {
        id: 5,
        name: "Boeing VR",
        type: "job",
        description: "VR Integration Intern. Evaluated aircraft designs in IC.IDO.",
        distance: 30,
        speed: 0.25,
        size: 1.1,
        color: "#6366f1"
    },
    {
        id: 6,
        name: "StoryboardXR",
        type: "project",
        description: "Immersive storyboarding for Vision Pro w/ hand gestures.",
        distance: 35,
        speed: 0.2,
        size: 0.95,
        color: "#a855f7"
    }
];

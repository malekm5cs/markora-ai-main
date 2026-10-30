import alain from "@/assets/work-alain.jpg";
import chef from "@/assets/work-chef.jpg";
import hybrid from "@/assets/work-hybrid.jpg";
import eightba from "@/assets/work-8ba.jpg";
import siemens from "@/assets/work-siemens.jpg";
import coffee from "@/assets/work-coffee.jpg";
import darkdoor from "@/assets/work-darkdoor.jpg";
import alainVid from "@/assets/Alain_Class_Motors.mp4";
import chefVid from "@/assets/Chef_Eyad.mp4";
import hybridVid from "@/assets/Hybrid_Xperience.mp4";
import eightbaVid from "@/assets/8BA_Motors.mp4";
import coffeeVideoAsset from "@/assets/Coffee_Matters.mp4.asset.json";
import darkdoorVid from "@/assets/Dark_Door.mp4";
import siemensVideoAsset from "@/assets/Siemens_Energy.mp4.asset.json";

export type Project = {
  index: string;
  title: string;
  discipline: string;
  year: string;
  image: string;
  video?: string;
  idea: string;
  direction: string;
  experience: string;
  approach: string[];
};

export const projects: Project[] = [
  {
    index: "01",
    title: "Alain Class Motors",
    discipline: "Automotive",
    year: "2024",
    image: alain,
    video: alainVid,
    idea: "A cinematic automotive experience focused on speed, precision, and visual storytelling.",
    direction: "Performance translated into digital movement, visual rhythm, and interaction.",
    experience: "A premium digital environment designed around automotive emotion.",
    approach: [
      "Cinematic visual direction",
      "Automotive storytelling",
      "Motion design",
      "Premium interaction design",
    ],
  },
  {
    index: "02",
    title: "Chef Eyad",
    discipline: "Brand Experience",
    year: "2024",
    image: chef,
    video: chefVid,
    idea: "Craft made visible — a chef's discipline expressed as a digital ritual.",
    direction: "Low light, single sources, patience. Restraint as luxury.",
    experience: "An intimate environment where each dish arrives as a scene.",
    approach: ["Brand narrative", "Food art direction", "Editorial layout", "Slow motion language"],
  },
  {
    index: "03",
    title: "Hybrid Xperience",
    discipline: "Creative Direction",
    year: "2023",
    image: hybrid,
    video: hybridVid,
    idea: "An expedition brand built around the moment the landscape goes quiet.",
    direction: "Night, distance, and a single point of warmth in cold terrain.",
    experience: "A journey structured as chapters rather than pages.",
    approach: ["Concept development", "Campaign direction", "Environmental design", "Digital film"],
  },
  {
    index: "04",
    title: "8BA Motors",
    discipline: "Automotive",
    year: "2023",
    image: eightba,
    video: eightbaVid,
    idea: "Engineering as identity — detail photographed like architecture.",
    direction: "Matte surfaces, cold light, absolute black. Nothing decorative.",
    experience: "A configurator-like environment that rewards close attention.",
    approach: ["Visual identity", "Product storytelling", "Macro art direction", "Interface design"],
  },
  {
    index: "05",
    title: "Siemens Energy",
    discipline: "Energy",
    year: "2024",
    image: siemens,
    video: siemensVideoAsset.url,
    idea: "Infrastructure at monumental scale, rendered with human clarity.",
    direction: "Industrial silhouettes, atmospheric haze, restrained blue energy.",
    experience: "Complex systems explained through composition, not diagrams.",
    approach: ["Information design", "Corporate storytelling", "Photography direction", "Systems thinking"],
  },
  {
    index: "06",
    title: "Coffee Matters",
    discipline: "Brand Experience",
    year: "2022",
    image: coffee,
    video: coffeeVideoAsset.url,
    idea: "A ritual brand where the pour is the entire piece of communication.",
    direction: "Darkness, steam, a single highlight. Sensory minimalism.",
    experience: "A retail world that reads as calm before it reads as commerce.",
    approach: ["Brand experience", "Packaging direction", "Digital identity", "Micro-interaction"],
  },
  {
    index: "07",
    title: "Dark Door",
    discipline: "Creative Direction",
    year: "2025",
    image: darkdoor,
    video: darkdoorVid,
    idea: "An invitation-only concept built entirely on curiosity.",
    direction: "Withholding information as an art direction strategy.",
    experience: "A site that reveals itself only to those who keep going.",
    approach: ["Concept", "Interaction design", "Sound-led pacing", "Progressive reveal"],
  },
];

export const capabilities = [
  {
    word: "Social Media",
    line: "Media Management",
    body: "Full ownership of your channels — bilingual content calendars in English and Arabic, community engagement, and platform strategy that keeps one consistent brand voice online.",
  },
  {
    word: "Content Creation",
    line: "Shoots & Production",
    body: "In-house photography and video production. Studio, on-location and event coverage, delivered as polished assets ready for campaigns, listings and communications.",
  },
  {
    word: "Paid Ads",
    line: "Social Advertising",
    body: "Performance campaigns built to convert, not to impress. Audience architecture, creative testing, and budget discipline that turns spend into qualified leads.",
  },
  {
    word: "Marketing Strategy",
    line: "& Launch Control",
    body: "Positioning, funnel design and launch sequencing. Every engagement is built around what the business actually needs to grow — never an off-the-shelf package.",
  },
  {
    word: "Event Planning",
    line: "Planning",
    body: "Planning and on-ground execution for corporate and brand events — logistics, scheduling and coverage — as delivered for Siemens Energy Technology Day.",
  },
  {
    word: "Web Development",
    line: "Development",
    body: "High-converting websites and digital infrastructure. Fast, accessible, bilingual by default, and engineered so marketing and product move as one system.",
  },
  {
    word: "Mobile Apps",
    line: "App Development",
    body: "Native-feeling applications from concept to store. Product thinking, interface craft and engineering handled by the same team that builds the brand around it.",
  },
  {
    word: "AI Systems",
    line: "Systems",
    body: "Applied intelligence inside the funnel — automation, generative content pipelines and adaptive tools that extend a marketing team instead of replacing it.",
  },
];


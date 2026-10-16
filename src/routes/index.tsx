import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { About } from "@/components/markora/About";
import { AIExperience } from "@/components/markora/AIExperience";
import { Capabilities } from "@/components/markora/Capabilities";
import { Contact } from "@/components/markora/Contact";
import { Cursor } from "@/components/markora/Cursor";
import { ExperienceIntro } from "@/components/markora/ExperienceIntro";
import { Footer } from "@/components/markora/Footer";
import { Grain } from "@/components/markora/Grain";
import { Hero } from "@/components/markora/Hero";
import { HorizontalGallery } from "@/components/markora/HorizontalGallery";
import { HorizontalReel } from "@/components/markora/HorizontalReel";
import { LoadingExperience } from "@/components/markora/LoadingExperience";
import { Navigation } from "@/components/markora/Navigation";
import { OrbitalSculpture } from "@/components/markora/OrbitalSculpture";
import { RobotCompanion } from "@/components/markora/RobotCompanion";
import { OraPlayground } from "@/components/markora/OraPlayground";
import { ScrollMorph3D } from "@/components/markora/ScrollMorph3D";
import { Philosophy } from "@/components/markora/Philosophy";
import { ScrollProgress } from "@/components/markora/ScrollProgress";
import { Work } from "@/components/markora/Work";
import { useGlobalSounds } from "@/components/markora/sound";

const title = "MarkOra — We build what comes next";
const description =
  "MarkOra is a creative technology studio building digital experiences across design, AI, brand and product. Not websites — environments.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);
  useGlobalSounds();

  return (
    <>
      <LoadingExperience onDone={() => setReady(true)} />
      <ScrollProgress />
      <Cursor />
      <Grain />
      <Navigation />
      <main className="relative z-10">
        <Hero ready={ready} />
        <HorizontalReel />
        <ExperienceIntro />
        <OrbitalSculpture />
        <Capabilities />
        <ScrollMorph3D />
        <AIExperience />
        <OraPlayground />
        <Work />
        <HorizontalGallery />
        <Philosophy />
        <About />
        <Contact />
      </main>
      <Footer />
      <RobotCompanion />
    </>
  );
}

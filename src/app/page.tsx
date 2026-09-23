import { SiteHeader } from "../components/navigation/SiteHeader";
import { SiteFooter } from "../components/navigation/SiteFooter";
import { HomeHero } from "../components/home/HomeHero";
import { WestLondon } from "../components/home/WestLondon";
import { InteriorSection } from "../components/home/InteriorSection";
import { PropertyLab } from "../components/home/PropertyLab";
import { LifecycleJourney } from "../components/home/LifecycleJourney";
import { PropertyLifecycle } from "../components/home/PropertyLifecycle";
import { FeaturedEditorial } from "../components/home/FeaturedEditorial";
import { Finale } from "../components/home/Finale";

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-[#0B0B0A]">
      <SiteHeader />
      <HomeHero />
      <WestLondon />
      <InteriorSection />
      <PropertyLab />
      <LifecycleJourney />
      <PropertyLifecycle />
      <FeaturedEditorial />
      <Finale />
      <SiteFooter />
    </main>
  );
}

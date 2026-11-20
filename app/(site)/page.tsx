import { getSession } from "@/lib/session";
import Hero from "@/components/home/hero";
import FeaturedSection from "@/components/home/featured-section";
import CategoriesSection from "@/components/home/categories-section";
import { WhyChoose, HowItWorks, CtaBand } from "@/components/home/info-sections";

export default async function HomePage() {
  const session = await getSession();

  return (
    <>
      <Hero />
      <FeaturedSection />
      <CategoriesSection />
      <WhyChoose />
      <HowItWorks />
      <CtaBand loggedIn={!!session} />
    </>
  );
}
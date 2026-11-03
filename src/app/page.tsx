import HeroSlider from "@/components/home/HeroSlider";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import Categories from "@/components/home/Categories";
import HowItWorks from "@/components/home/HowItWorks";
import HostGuarantee from "@/components/home/HostGuarantee";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <Categories />
      <HowItWorks />
      <HostGuarantee />
    </>
  );
}

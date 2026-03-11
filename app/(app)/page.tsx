import CinematicTextSlider from "@/components/AnimatedTextSlider"
import CategoryHighlight from "@/components/categoryHighlights"
import FeaturedProducts from "@/components/featuredProducts"
import HeroCrousal from "@/components/heroCrousal"


export default async function HomePage(
  ){
  return (
    <div>
  <HeroCrousal/>
  <CinematicTextSlider/>
  <FeaturedProducts/>
  <CategoryHighlight/>
  <FeaturedProducts/>

    </div>
  )
}
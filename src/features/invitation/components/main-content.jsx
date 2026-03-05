import Hero from "@/features/invitation/components/hero";
import { Program } from "@/features/program";
import { Location } from "@/features/location";
import { Wishes } from "@/features/wishes";

// Main Invitation Content
export default function MainContent() {
  return (
    <>
      <Hero />
      <Program />
      <Location />
      <Wishes />
    </>
  );
}

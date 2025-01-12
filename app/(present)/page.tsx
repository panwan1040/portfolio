import { FeedWrapper } from "@/components/feed-wrapper";
import Header from "./header";
import Section1 from "@/components/sections/section1";
import Section2 from "@/components/sections/section2";

export default function Home() {
  return (
    <div className="flex  gap-[48px] px-6">
      <FeedWrapper >
        <Section1 />
        <Section2 />
      </FeedWrapper>
    </div>
  );
}

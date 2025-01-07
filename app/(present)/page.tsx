import { FeedWrapper } from "@/components/feed-wrapper";
import Header from "./header";
import Section1 from "@/components/sections/Section1";

export default function Home() {
  return (
    <div className="flex  gap-[48px] px-6">
      <FeedWrapper >
        <Section1 />
      </FeedWrapper>
    </div>
  );
}

import type { Metadata } from "next";
import AtlasProcessDeck from "./AtlasProcessDeck";

export const metadata: Metadata = {
  title: "Atlas — How the Research Loop Works",
  description:
    "An interactive presentation explaining how Atlas turns a market question into a defendable fact bank, a live market model, and explicit residual risks.",
};

export default function AtlasProcessPage() {
  return <AtlasProcessDeck />;
}

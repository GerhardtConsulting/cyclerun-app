import CycleRunApp from "@/components/CycleRunApp";
import { JsonLd, schemas, homepageFaqs } from "@/app/seo-config";

export default function Home() {
  return (
    <>
      <JsonLd data={schemas.faqPage(homepageFaqs)} />
      <CycleRunApp />
    </>
  );
}

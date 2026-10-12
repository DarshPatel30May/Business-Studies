import { Network } from "lucide-react";
import { Callout, Card, PageHeader, SectionHeading } from "../components/ui";
import { DecisionRipple, InterdependenceMap } from "../components/visuals/Interdependence";

export default function InterdependencePage() {
  return (
    <div className="space-y-8">
      <PageHeader icon={<Network className="h-6 w-6" />} title="Interdependence of key business functions" subtitle="Operations, Marketing, Finance and Human Resources depend on each other. A decision in one function affects all the others — and the HSC rewards answers that show these links." />
      <Card className="p-5">
        <SectionHeading title="Four functions, six connections" intro="Select any connection (line, midpoint dot or button) to see how the two functions depend on each other." />
        <div className="mt-4">
          <InterdependenceMap />
        </div>
      </Card>
      <Card className="p-5">
        <SectionHeading title="One decision, four functions" intro="Choose a business decision to see how it ripples through every key business function at once." />
        <div className="mt-4">
          <DecisionRipple />
        </div>
      </Card>
      <Callout tone="exam" title="Using interdependence in HSC answers">
        Business reports score well when they recognise that solving one problem affects other functions — e.g. “Introducing automation (operations) requires long-term finance (finance) and retraining (HR), and lower unit costs allow more competitive pricing (marketing).” The syllabus asks you to assess the relationship between operations and other key business functions, and to explain interdependence in every topic.
      </Callout>
    </div>
  );
}

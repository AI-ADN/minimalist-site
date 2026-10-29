import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { ExperienceProvider } from "@/components/ExperienceProvider";
import { ServiceNav } from "@/components/ServiceNav";
import { ServiceSection } from "@/components/ServiceSection";
import { SiteHeader } from "@/components/SiteHeader";
import { toServiceView } from "@/content/selectors";
import { services } from "@/content/services";

export default function Home() {
  const views = services.map(toServiceView);
  const navItems = services.map((s) => ({ id: s.id, name: s.name, icon: s.icon }));
  const meta = services.map((s) => ({ id: s.id, name: s.name, stepCount: s.steps.length }));

  return (
    <ExperienceProvider services={meta}>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="shell">
        <div className="canvas">
          <SiteHeader firstServiceId={services[0].id}>
            <ServiceNav items={navItems} variant="bar" />
          </SiteHeader>
          <div className="canvas__body">
            <ServiceNav items={navItems} variant="rail" />
            <main id="contenido">
              <h1 className="sr-only">Talleres Unidos (TUNSA): servicios metalmecánicos</h1>
              {views.map((view) => (
                <ServiceSection key={view.id} service={view} />
              ))}
              <AboutSection />
              <ContactSection />
            </main>
          </div>
        </div>
      </div>
    </ExperienceProvider>
  );
}

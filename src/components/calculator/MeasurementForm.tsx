import { useState } from 'react';
import { Accordion } from '../common/Accordion';
import { SectionConstruction } from './SectionConstruction';
import { SectionGates } from './SectionGates';
import { SectionModifiers } from './SectionModifiers';
import { SectionPerimeter } from './SectionPerimeter';
import { SectionSheeting } from './SectionSheeting';

export function MeasurementForm() {
  const [openSections, setOpenSections] = useState({
    perimeter: true,
    construction: false,
    sheeting: false,
    gates: false,
    modifiers: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  return (
    <section className="space-y-3">
      <h2 className="px-1 text-base font-semibold text-[var(--tg-theme-text-color,#111827)]">
        Параметры замера
      </h2>

      <Accordion
        title="Периметр и высота"
        open={openSections.perimeter}
        onToggle={() => toggleSection('perimeter')}
      >
        <SectionPerimeter />
      </Accordion>

      <Accordion
        title="Столбы, лаги, фундамент"
        open={openSections.construction}
        onToggle={() => toggleSection('construction')}
      >
        <SectionConstruction />
      </Accordion>

      <Accordion
        title="Полотно забора"
        open={openSections.sheeting}
        onToggle={() => toggleSection('sheeting')}
      >
        <SectionSheeting />
      </Accordion>

      <Accordion
        title="Ворота и калитки"
        open={openSections.gates}
        onToggle={() => toggleSection('gates')}
      >
        <SectionGates />
      </Accordion>

      <Accordion
        title="Усложняющие факторы"
        open={openSections.modifiers}
        onToggle={() => toggleSection('modifiers')}
      >
        <SectionModifiers />
      </Accordion>
    </section>
  );
}

import { expect, test } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-fixture"

test("passive schSize controls pin spacing for md and numeric distances", () => {
  const { circuit } = getTestFixture()

  circuit.add(
    <board width="20mm" height="10mm">
      <resistor name="R_MD" resistance="1k" schSize="md" footprint="0402" />
      <resistor
        name="R_DIST"
        resistance="1k"
        schSize="1.2mm"
        footprint="0402"
      />
      <capacitor name="C_MD" capacitance="1uF" schSize="md" footprint="0402" />
      <capacitor
        name="C_DIST"
        capacitance="1uF"
        schSize="0.8mm"
        footprint="0402"
      />
    </board>,
  )

  circuit.render()

  const getPortSpacing = (componentName: string) => {
    const sourceComponent = circuit.db.source_component
      .list()
      .find((c) => c.name === componentName)
    const schematicComponent = circuit.db.schematic_component
      .list()
      .find(
        (c) => c.source_component_id === sourceComponent?.source_component_id,
      )
    const ports = circuit.db.schematic_port
      .list()
      .filter(
        (p) =>
          p.schematic_component_id ===
          schematicComponent?.schematic_component_id,
      )
    expect(ports).toHaveLength(2)
    return Math.hypot(
      ports[0].center.x - ports[1].center.x,
      ports[0].center.y - ports[1].center.y,
    )
  }

  expect(getPortSpacing("R_MD")).toBeCloseTo(1, 3)
  expect(getPortSpacing("R_DIST")).toBeCloseTo(1.2, 3)
  expect(getPortSpacing("C_MD")).toBeCloseTo(1, 3)
  expect(getPortSpacing("C_DIST")).toBeCloseTo(0.8, 3)

  expect(circuit).toMatchSchematicSnapshot(import.meta.path)
})

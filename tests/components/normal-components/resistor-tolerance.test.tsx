import { expect, test } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-fixture"

test("resistor tolerance is emitted on the source component", () => {
  const { project } = getTestFixture()

  project.add(
    <board width="10mm" height="10mm">
      <resistor
        name="R1"
        resistance="10k"
        tolerance="5%"
        footprint="0402"
        pcbX={0}
        pcbY={0}
      />
    </board>,
  )

  project.render()

  const resistors = project.db.source_component.list({
    ftype: "simple_resistor",
  }) as Array<{
    ftype: "simple_resistor"
    resistance: number
    tolerance?: number
  }>

  expect(resistors).toHaveLength(1)
  expect(resistors[0].tolerance).toBe(0.05)

  expect(project).toMatchSchematicSnapshot(import.meta.path)
})

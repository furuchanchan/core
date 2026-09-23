import { expect, test } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-fixture"

test("autorouted vias inherit board defaultViaTenting", async () => {
  const { circuit } = getTestFixture()

  circuit.add(
    <board width="20mm" height="20mm" defaultViaTenting="both_sides">
      <resistor name="R1" resistance="1k" footprint="0402" pcbX={-5} />
      <resistor
        name="R2"
        resistance="1k"
        footprint="0402"
        pcbX={5}
        layer="bottom"
      />
      <trace from=".R1 > .pin1" to=".R2 > .pin1" />
    </board>,
  )
  await circuit.renderUntilSettled()

  const board = circuit.db.pcb_board.list()[0]
  expect(board.default_via_tented_on_top).toBe(true)
  expect(board.default_via_tented_on_bottom).toBe(true)

  const vias = circuit.db.pcb_via.list()
  expect(vias.length).toBeGreaterThan(0)
  for (const via of vias) {
    expect(via.tented_on_top).toBe(true)
    expect(via.tented_on_bottom).toBe(true)
  }

  expect(circuit).toMatchPcbSnapshot(import.meta.path)
})

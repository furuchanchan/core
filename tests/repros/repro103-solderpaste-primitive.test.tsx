import { expect, test } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-fixture"

test("solderpaste primitive emits pcb_solder_paste elements", async () => {
  const { circuit } = getTestFixture()

  circuit.add(
    <board width="30mm" height="20mm">
      <smtpad
        shape="rect"
        width="20mm"
        height="10mm"
        portHints={["pin1"]}
        layer="top"
        pcbX={0}
        pcbY={0}
      />
      <solderpaste shape="rect" width="4mm" height="8mm" pcbX={-6} pcbY={0} />
      <solderpaste shape="rect" width="4mm" height="8mm" pcbX={0} pcbY={0} />
      <solderpaste shape="rect" width="4mm" height="8mm" pcbX={6} pcbY={0} />
      <solderpaste shape="circle" radius="1mm" pcbX={10} pcbY={5} />
    </board>,
  )
  await circuit.renderUntilSettled()

  const solderPastes = circuit.db.pcb_solder_paste.list()
  // 1 auto-generated from the smtpad + 4 explicit <solderpaste> primitives
  expect(solderPastes.length).toBe(5)

  const explicitRects: any[] = solderPastes.filter(
    (sp: any) => sp.shape === "rect" && sp.width === 4,
  )
  expect(
    explicitRects.map((sp: any) => sp.x).sort((a: number, b: number) => a - b),
  ).toEqual([-6, 0, 6])
  for (const sp of explicitRects) {
    expect(sp.y).toBe(0)
    expect(sp.height).toBe(8)
    expect(sp.layer).toBe("top")
  }

  const explicitCircles: any[] = solderPastes.filter(
    (sp: any) => sp.shape === "circle" && sp.x === 10,
  )
  expect(explicitCircles.length).toBe(1)
  expect(explicitCircles[0].radius).toBe(1)
  expect(explicitCircles[0].y).toBe(5)

  await expect(circuit).toMatchPcbSnapshot(import.meta.path)
})

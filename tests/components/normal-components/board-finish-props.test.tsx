import { expect, test } from "bun:test"
import { getTestFixture } from "tests/fixtures/get-test-fixture"

test("board per-side finish and assembly props reach pcb_board", () => {
  const { project } = getTestFixture()

  project.add(
    <board
      name="B1"
      width="10mm"
      height="10mm"
      topSolderMaskColor="red"
      bottomSolderMaskColor="blue"
      topSilkscreenColor="white"
      bottomSilkscreenColor="yellow"
      doubleSidedAssembly
    />,
  )

  project.render()

  const boards = project.db.pcb_board.list() as Array<{
    top_solder_mask_color?: string
    bottom_solder_mask_color?: string
    top_silkscreen_color?: string
    bottom_silkscreen_color?: string
    double_sided_assembly?: boolean
  }>
  expect(boards).toHaveLength(1)
  expect(boards[0].top_solder_mask_color).toBe("red")
  expect(boards[0].bottom_solder_mask_color).toBe("blue")
  expect(boards[0].top_silkscreen_color).toBe("white")
  expect(boards[0].bottom_silkscreen_color).toBe("yellow")
  expect(boards[0].double_sided_assembly).toBe(true)

  expect(project).toMatchPcbSnapshot(import.meta.path)
})

import { PrimitiveComponent } from "../base-components/PrimitiveComponent"
import { solderPasteProps } from "@tscircuit/props"

export class SolderPaste extends PrimitiveComponent<typeof solderPasteProps> {
  pcb_solder_paste_id: string | null = null
  isPcbPrimitive = true

  get config() {
    return {
      componentName: "SolderPaste",
      zodProps: solderPasteProps,
    }
  }

  doInitialPcbPrimitiveRender(): void {
    if (this.root?.pcbDisabled) return
    const { db } = this.root!
    const { _parsedProps: props } = this
    const position = this._getGlobalPcbPositionBeforeLayout()
    const { maybeFlipLayer } = this._getPcbPrimitiveFlippedHelpers()
    const layer = maybeFlipLayer(props.layer ?? "top")

    if (layer !== "top" && layer !== "bottom") {
      throw new Error(
        `Invalid layer "${layer}" for SolderPaste. Must be "top" or "bottom".`,
      )
    }

    const subcircuit = this.getSubcircuit()

    const pcb_component_id =
      this.parent?.pcb_component_id ??
      this.getPrimitiveContainer()?.pcb_component_id

    if (props.shape === "circle") {
      const pcb_solder_paste = db.pcb_solder_paste.insert({
        shape: "circle",
        pcb_component_id: pcb_component_id ?? undefined,
        layer,
        x: position.x,
        y: position.y,
        radius: props.radius,
        subcircuit_id: subcircuit?.subcircuit_id ?? undefined,
      })
      this.pcb_solder_paste_id = pcb_solder_paste.pcb_solder_paste_id
    } else if (props.shape === "rect") {
      const pcb_solder_paste = db.pcb_solder_paste.insert({
        shape: "rect",
        pcb_component_id: pcb_component_id ?? undefined,
        layer,
        x: position.x,
        y: position.y,
        width: props.width,
        height: props.height,
        subcircuit_id: subcircuit?.subcircuit_id ?? undefined,
      })
      this.pcb_solder_paste_id = pcb_solder_paste.pcb_solder_paste_id
    }
  }

  getPcbSize(): { width: number; height: number } {
    const { _parsedProps: props } = this
    if (props.shape === "circle") {
      const diameter = props.radius * 2
      return { width: diameter, height: diameter }
    }
    return { width: props.width, height: props.height }
  }

  _moveCircuitJsonElements({
    deltaX,
    deltaY,
  }: { deltaX: number; deltaY: number }) {
    if (this.root?.pcbDisabled) return
    const { db } = this.root!
    if (!this.pcb_solder_paste_id) return

    const solderPaste = db.pcb_solder_paste.get(this.pcb_solder_paste_id)
    if (solderPaste) {
      db.pcb_solder_paste.update(this.pcb_solder_paste_id, {
        x: solderPaste.x + deltaX,
        y: solderPaste.y + deltaY,
      })
    }
  }
}

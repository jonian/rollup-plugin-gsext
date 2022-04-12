import { main as Main } from '#ui'

class RollupExtension {
  enable() {
    Main.panel.hide()
  }

  disable() {
    Main.panel.show()
  }
}

let extension = null

export function enable() {
  extension = new RollupExtension()
  extension.enable()
}

export function disable() {
  extension.disable()
  extension = null
}

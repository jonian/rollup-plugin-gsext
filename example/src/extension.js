import { main as Main } from '#ui'

import { moduleFunction } from '#me/module'
import { inlineFunction } from '#me/inline'

class RollupExtension {
  enable() {
    this.type = moduleFunction()
    Main.panel.hide()
  }

  disable() {
    this.type = inlineFunction()
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

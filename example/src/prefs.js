import { GObject, Gtk } from '#gi'
import { extensionUtils as ExtensionUtils } from '#misc'

class RollupExtensionPrefs extends Gtk.Box {
  static {
    GObject.registerClass(this)
  }

  constructor(params) {
    super(params)

    const label = new Gtk.Label({
      label: 'Hello World'
    })

    this.append(label)
  }
}

export function init() {
  ExtensionUtils.initTranslations()
}

export function buildPrefsWidget() {
  return new RollupExtensionPrefs()
}

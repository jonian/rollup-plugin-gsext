import fs from 'fs'
import path from 'path'
import chp from 'child_process'

const resolveImport = source =>
  source.replace('#', 'imports.').replace(/\//g, '.')

const replaceImports = code =>
  code.replace(/import (.*) from '(imports\..*)';/g, 'const $1 = $2;')

const stripExports = code =>
  code.replace(/\n?export .*;/, '')

const toSlug = string =>
  string.replace(/[\s_]/g, '-')
    .replace(/\B([A-Z])/g, '-$1')
    .toLowerCase()

const toName = string =>
  string.replace(/[-_]/g, ' ')
    .replace(/\B([A-Z])/g, ' $1')
    .replace(/\b(\w)/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/\s+/g, ' ')

export default function plugin(config = {}) {
  let pkgData  = JSON.parse(fs.readFileSync('package.json'))
  let metaPath = 'src/metadata.json'

  const slug = toSlug(pkgData.name)
  const name = toName(pkgData.name)

  let metaData = {
    'shell-version': ['42'],
    'uuid': `${slug}@rollup.ext`,
    'url': pkgData.repository,
    'settings-schema': `org.gnome.shell.extensions.${slug}`,
    'gettext-domain': slug,
    'version': -1,
    'name': name,
    'description': pkgData.description
  }

  const mergeMeta = data => data && Object.keys(data).forEach(key => {
    metaData[key] = data[key]
  })

  const filePath = fileName =>
    metaPath.replace('metadata.json', fileName)

  const fileChunk = fileName => ({
    type: 'chunk',
    id: filePath(fileName),
    fileName
  })

  mergeMeta(pkgData.extension)
  mergeMeta(config.metadata)

  return {
    name: 'gnome-shell-extension',
    options(options) {
      if (typeof options.input == 'string' && options.input.match('metadata.json')) {
        metaPath = options.input
        mergeMeta(JSON.parse(fs.readFileSync(metaPath)))

        return { ...options, input: null }
      }
      return options
    },
    buildStart() {
      const entry = fileChunk('extension.js')
      const prefs = fileChunk('prefs.js')

      if (fs.existsSync(entry.id)) {
        this.emitFile(entry)
      } else {
        throw new Error('Entry file extension.js not found in source folder!')
      }

      if (fs.existsSync(prefs.id)) {
        this.emitFile(prefs)
      }

      const schema = filePath('settings.xml')

      if (fs.existsSync(schema)) {
        const name = metaData['settings-schema']
        const path = name.replace(/\./g, '/')

        const data = fs.readFileSync(schema, { encoding:'utf8' })
          .replace(/{schemaName}/g, name)
          .replace(/{schemaPath}/g, path)

        this.emitFile({
          type: 'asset',
          fileName: `schemas/${name}.gschema.xml`,
          source: data
        })
      }

      this.emitFile({
        type: 'asset',
        fileName: 'metadata.json',
        source: JSON.stringify(metaData, null, '  ')
      })
    },
    generateBundle({ dir }) {
      if (dir && fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true })
      }
    },
    writeBundle({ dir }) {
      if (dir && fs.existsSync(dir)) {
        chp.exec('glib-compile-schemas schemas', { cwd: dir })
      }
    },
    resolveId(source, importer, options) {
      if (source.startsWith('#')) {
        return { id: resolveImport(source), external: true }
      }
      return null
    },
    renderChunk(code, chunk, rollupOptions) {
      code = replaceImports(code)
      code = stripExports(code)

      return { code, map: null }
    }
  }
}

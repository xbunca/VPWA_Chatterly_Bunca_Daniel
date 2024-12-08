/*
|--------------------------------------------------------------------------
| HTTP server entrypoint
|--------------------------------------------------------------------------
|
| The "server.ts" file is the entrypoint for starting the AdonisJS HTTP
| server. Either you can run this file directly or use the "serve"
| command to run this file and monitor file changes
|
*/

import 'reflect-metadata'
import { join } from 'node:path'
import { Ignitor, prettyPrintError } from '@adonisjs/core'
import { readFileSync } from 'node:fs'
import { createServer as createHttpServer } from 'node:http'
import { createServer as createHttpsServer } from 'node:https'
import Env from '#start/env'

/**
 * URL to the application root. AdonisJS need it to resolve
 * paths to file and directories for scaffolding commands
 */
const APP_ROOT = new URL('../', import.meta.url)

/**
 * The importer is used to import files in context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

const sslKeyPath = Env.get('SSL_KEY_PATH')
const sslCertPath = Env.get('SSL_CERT_PATH')

if (!sslKeyPath || !sslCertPath) {
  console.error('SSL key or certificate path is missing in .env')
}

const privateKey = readFileSync(sslKeyPath, 'utf8')
const certificate = readFileSync(sslCertPath, 'utf8')
const credentials = { key: privateKey, cert: certificate }

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')
    })
    app.listen('SIGTERM', () => app.terminate())
    app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
  })
  .httpServer()
  .start((handle) => {
    if (Env.get('SSL_KEY') && Env.get('SSL_CERT')) {
      return createHttpsServer(credentials, handle)
    } else {
      return createHttpServer(handle)
    }
  })
  .catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
  })

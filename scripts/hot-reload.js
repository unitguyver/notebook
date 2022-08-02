#!/usr/bin/env node
'use strict'
const chokidar = require('chokidar')
const WebSocket = require('ws')
const debounce = require('lodash/debounce')

const port = '20227'
const FileChange = 'file-change'
const directory = 'dist'
const exclude = []
const quiet = !!process.env.QUIET

const wss = new WebSocket.Server({ port })

wss.on('listening', () => {
  console.log('\nhot reload server is listening...\n')
})

wss.on('close', () => {
  console.log('\nhot reload server closed.\n')
})

wss.on('connection', (ws) => {
  const watcher = chokidar.watch(directory, {
    ignoreInitial: true,
  })

  watcher.on(
    'all',
    debounce((_, path) => {
      if (!exclude.includes(path)) {
        if (!quiet) {
          console.log(`File change detected. Path: ${path}`)
        }
        ws.send(FileChange)
      }
    }, 500)
  )

  ws.on('close', () => {
    watcher.close()
  })
})

exports.port = port

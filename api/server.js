const express = require("express")
const helmet = require("helmet")
const cors = require("cors")

const server = express()

server.use(helmet())
server.use(cors())

module.exports = server

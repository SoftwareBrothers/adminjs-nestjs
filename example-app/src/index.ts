import express from 'express'
import AdminBro from '@admin-bro/core'
import { buildRouter } from '@admin-bro/express'

const PORT = 3000

const run = async () => {
  const app = express()
  const admin = new AdminBro()
  const router = buildRouter(admin)

  app.use(admin.options.rootPath, router)

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${PORT}`)
  })
}

run()

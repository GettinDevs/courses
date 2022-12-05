import express from 'express'

import * as controller from '@controllers/users'

const routes = express.Router()

routes.get('/', (_req, res) => {
  res.send('Hello World!');
})

routes.post('/login', controller.login)
routes.get('/users/:userId/notifications', controller.getUserNotifications)
routes.get('/users/:userId/enrollments', controller.getUserEnrollments)
routes.get('/courses/:courseId', controller.getCourse)

export { routes }
import express from 'express'

import * as controller from '../controllers/users'

const routes = express.Router()

routes.get('/', (_req, res) => {
  res.send('Hello World!');
})

routes.post('/login', controller.login)
routes.get('/users/:userId/notifications', controller.getUserNotifications)
routes.get('/users/:userId/enrollments', controller.getUserEnrollments)
routes.get('/users/:userId/enrollments/:enrollmentId', controller.getUserEnrollment)
routes.get('/courses', controller.getCourses)
routes.get('/courses/:courseId', controller.getCourse)
routes.get('/sessions/:sessionId', controller.getSession)
routes.post('/sessions/:sessionId/complete', controller.completeSession)
routes.post('/sessions/:sessionId/uncomplete', controller.uncompleteSession)

// Admin routes
routes.post('/courses', controller.addCourse)
routes.post('/sessions', controller.addSession)
routes.put('/courses/:courseId', controller.updateCourse)
routes.put('/sessions/:sessionId', controller.updateSession)
routes.delete('/courses/:courseId', controller.deleteCourse)
routes.delete('/sessions/:sessionId', controller.deleteSession)

// Activities routes
routes.get('/activities', controller.getActivities)
routes.post('/activities', controller.addActivity)
routes.put('/activities/:activityId', controller.editActivity)

export { routes }
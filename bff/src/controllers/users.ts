// import { pool } from '@/db/pool'
import { pool } from '@pool';
import { asyncHandler } from '@/utils/asyncHandlers'
import { config } from '@config'

const ADMIN_USER = 'tomas'
const ADMIN_PASSWORD = config.app.adminPassword

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (username === ADMIN_USER) {
    if (password !== ADMIN_PASSWORD) {
      res.status(401).json({
        message: 'Invalid password',
      })
      return
    }
  }

  const { rows } = await pool.query(
    'SELECT * FROM courses.app_user WHERE username = $1',
    [username]
  )
  if (rows.length === 0) {
    res.status(401).json({
      message: 'Invalid username',
    })
    return
  }
  const user = rows[0]

  res.json({
    userId: user.user_id,
    username: user.username,
    role: user.user_role
  })
})

export const getUserNotifications = asyncHandler(async (req, res) => {
  const { userId } = req.params

  const { rows } = await pool.query(
    'SELECT * FROM courses.notification WHERE user_id = $1',
    [userId]
  )

  res.json(rows)
})

export const getUserEnrollments = asyncHandler(async (req, res) => {
  const { userId } = req.params

  const { rows } = await pool.query(
    `SELECT *
    FROM courses.enrollment e
    LEFT JOIN (
      SELECT *, ARRAY(
        SELECT
          json_build_object(
            'sessionId', s.session_id,
            'title', s.title,
            'rank', s.rank,
            'type', s.session_type,
            'isMandatory', s.is_mandatory,
            'user_progress', CASE WHEN sp.is_completed IS NULL THEN NULL ELSE json_build_object(
              'isCompleted', sp.is_completed,
              'status', sp.progress_status
            ) END
          )
        FROM courses.session s
        LEFT JOIN courses.session_progress sp ON s.session_id = sp.session_id AND sp.user_id = $1
        WHERE s.course_id = c.course_id
        GROUP BY s.session_id, sp.is_completed, sp.progress_status, s.rank ORDER BY s.rank
      ) AS sessions FROM courses.course c
    ) c ON e.course_id = c.course_id
    WHERE e.user_id = $1`,
    [userId]
  )

  res.json(rows)
})

export const getUserEnrollment = asyncHandler(async (req, res) => {
  const { userId, enrollmentId } = req.params

  const { rows: enrollments } = await pool.query(
    `SELECT *
    FROM courses.enrollment e
    LEFT JOIN (
      SELECT *, ARRAY(
        SELECT
          json_build_object(
            'sessionId', s.session_id,
            'title', s.title,
            'rank', s.rank,
            'type', s.session_type,
            'isMandatory', s.is_mandatory,
            'user_progress', CASE WHEN sp.is_completed IS NULL THEN NULL ELSE json_build_object(
              'isCompleted', sp.is_completed,
              'status', sp.progress_status
            ) END
          )
        FROM courses.session s
        LEFT JOIN courses.session_progress sp ON s.session_id = sp.session_id AND sp.user_id = $1
        WHERE s.course_id = c.course_id
        GROUP BY s.session_id, sp.is_completed, sp.progress_status, s.rank ORDER BY s.rank
      ) AS sessions FROM courses.course c
    ) c ON e.course_id = c.course_id
    WHERE e.user_id = $1 AND e.enrollment_id = $2`,
    [userId, enrollmentId]
  )

  const enrollment = enrollments[0]

  res.json(enrollment)
})

export const getCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params

  const { rows: courses } = await pool.query(
    `SELECT 
      c.course_id as "courseId",
      c.title,
      c.depends_on as "dependsOn",
      ARRAY(
        SELECT
          json_build_object(
            'sessionId', s.session_id,
            'title', s.title,
            'rank', s.rank,
            'type', s.session_type,
            'isMandatory', s.is_mandatory
          )
        FROM courses.session s
        WHERE s.course_id = $1
        GROUP BY s.session_id, s.rank ORDER BY s.rank
      ) AS sessions
    FROM courses.course c
    WHERE c.course_id = $1`,
    [courseId]
  )
  const course = courses[0]

  res.json(course)
})

export const getSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params

  const { rows: sessions } = await pool.query(`
    SELECT
      s.session_id as "sessionId",
      s.title,
      s.session_type as "type",
      s.is_mandatory as "isMandatory",
      s.rank,
      s.course_id as "courseId",
      s.content
    FROM courses.session s WHERE s.session_id = $1
  `, [sessionId])

  const session = sessions[0]
  res.json(session)
})

\c postgres;

DROP SCHEMA IF EXISTS courses CASCADE;
CREATE SCHEMA IF NOT EXISTS courses;
SET search_path TO courses;

DROP TYPE IF EXISTS roles CASCADE;
DROP TYPE IF EXISTS session_type CASCADE;
DROP TYPE IF EXISTS session_progress_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

CREATE TYPE roles AS ENUM('USER', 'ADMIN');
CREATE TYPE session_type AS ENUM('LECTURE', 'ACTIVITY', 'NOTE');
CREATE TYPE session_progress_status AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'WAITING_APPROVAL');
CREATE TYPE notification_type AS ENUM('SUCCESS', 'WARNING', 'ERROR', 'GENERAL');

/* AppUser */
CREATE TABLE IF NOT EXISTS app_user (
  user_id serial PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  user_role roles DEFAULT 'USER'
);

/* Course */
CREATE TABLE IF NOT EXISTS course (
  course_id serial PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  depends_on INT REFERENCES course(course_id)
);

/* Session */
CREATE TABLE IF NOT EXISTS session (
  session_id serial PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  content TEXT NOT NULL,
  session_type session_type DEFAULT 'LECTURE',
  is_mandatory BOOLEAN NOT NULL,
  rank INT NOT NULL,
  course_id INT NOT NULL REFERENCES course(course_id)
);

/* SessionProgress */
CREATE TABLE IF NOT EXISTS session_progress (
  session_progress_id serial PRIMARY KEY,
  session_id INT NOT NULL REFERENCES session(session_id),
  user_id INT NOT NULL REFERENCES app_user(user_id),
  is_completed BOOLEAN DEFAULT FALSE,
  progress_status session_progress_status DEFAULT 'NOT_STARTED'
);

/* Enrollment */
CREATE TABLE IF NOT EXISTS enrollment (
  enrollment_id serial PRIMARY KEY,
  course_id INT NOT NULL REFERENCES course(course_id),
  user_id INT NOT NULL REFERENCES app_user(user_id),
  is_completed BOOLEAN DEFAULT FALSE
);

/* Notification */
CREATE TABLE IF NOT EXISTS notification (
  user_id INT NOT NULL REFERENCES app_user(user_id),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  notification_type notification_type NOT NULL
);

\c postgres;
SET search_path TO courses;

INSERT INTO app_user(username, user_role) VALUES ('tomas', 'ADMIN');
INSERT INTO app_user(username) VALUES ('willi');
INSERT INTO app_user(username) VALUES ('tiago');
INSERT INTO app_user(username) VALUES ('anda');

INSERT INTO course(title) VALUES('HTML and CSS');
INSERT INTO course(title) VALUES('JavaScript Essentials');
INSERT INTO course(title, depends_on) VALUES('API', 2);
INSERT INTO course(title, depends_on) VALUES('NodeJS', 2);

INSERT INTO session(title, content, is_mandatory, rank, course_id)
VALUES (
	'Introduction',
	'This is your lecture about HTML and CSS',
	TRUE,
	0,
	1
);
INSERT INTO session(title, content, is_mandatory, rank, course_id)
VALUES (
	'Starting with elements',
	'Those are different HTML elements',
	TRUE,
	1,
	1
);


INSERT INTO enrollment(course_id, user_id) VALUES(1, 2);
INSERT INTO enrollment(course_id, user_id) VALUES(2, 2);
INSERT INTO enrollment(course_id, user_id) VALUES(3, 2);

INSERT INTO enrollment(course_id, user_id) VALUES(1, 3);
INSERT INTO enrollment(course_id, user_id) VALUES(2, 3);
INSERT INTO enrollment(course_id, user_id) VALUES(3, 3);

INSERT INTO session_progress(session_id, user_id, is_completed, progress_status) VALUES(1, 2, TRUE, 'COMPLETED');
INSERT INTO session_progress(session_id, user_id, progress_status) VALUES(2, 2, 'IN_PROGRESS');

INSERT INTO session_progress(session_id, user_id, progress_status) VALUES(1, 3, 'IN_PROGRESS');

/* skip Notification */

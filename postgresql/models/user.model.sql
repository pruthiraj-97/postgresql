CREATE TABLE users(
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(255),
	email VARCHAR(255),
	password VARCHAR(255)
)

CREATE TABLE posts(
	post_id SERIAL PRIMARY KEY,
	image TEXT,
	user_id INT,
	likes INT DEFAULT 0,
	dislikes INT DEFAULT 0,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)
CREATE TABLE likes(
	like_id SERIAL PRIMARY KEY,
	post_id INT,
	FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)
	
CREATE TABLE dislikes(
	dislike_id SERIAL PRIMARY KEY,
	post_id INT,
	FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)

CREATE TABLE comment(
	comment_id SERIAL PRIMARY KEY,
	comment TEXT,
	post_id INT,
	FOREIGN KEY (post_id)  REFERENCES posts(post_id),
	user_id INT,
	FOREIGN KEY (user_id)  REFERENCES users(user_id)
)
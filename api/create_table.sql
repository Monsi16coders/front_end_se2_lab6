-- Run this in your MySQL server to create the required table for the lab
CREATE DATABASE IF NOT EXISTS se2_lab6;
USE se2_lab6;

CREATE TABLE IF NOT EXISTS mood_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mood_level TINYINT NOT NULL,
  journal_entry TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

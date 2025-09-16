-- MySQL 8.4 Schema for PNLTRACK
-- Создание базы данных и таблиц

CREATE DATABASE IF NOT EXISTS default_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE default_db;

-- Таблица пользователей (если нужна отдельная таблица)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(255) NOT NULL,
    subcategory VARCHAR(255) NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT NULL,
    client_name VARCHAR(255) NULL,
    contract_amount DECIMAL(12, 2) NULL,
    first_payment DECIMAL(12, 2) NULL,
    installment_period INT NULL,
    lump_sum DECIMAL(12, 2) NULL,
    company VARCHAR(255) DEFAULT 'Спасение',
    contract_status VARCHAR(50) NULL,
    termination_date DATE NULL,
    account_from VARCHAR(255) NULL COMMENT 'Счет списания (для расходов)',
    account_to VARCHAR(255) NULL COMMENT 'Счет поступления (для доходов)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_date (date),
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_account_from (account_from),
    INDEX idx_account_to (account_to),
    INDEX idx_created_at (created_at)
);

-- Создание пользователя для приложения (если нужно)
-- CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON default_db.* TO 'app_user'@'%';
-- FLUSH PRIVILEGES;

-- Sub-Store Management System Database Schema

CREATE DATABASE IF NOT EXISTS store_management;
USE store_management;

-- 1. Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Initial Categories
INSERT INTO categories (name) VALUES ('Cartridges'), ('Toners'), ('Stationaries');

-- 2. Materials Table
CREATE TABLE materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_name VARCHAR(255) NOT NULL,
    material_code VARCHAR(100) NOT NULL UNIQUE,
    category_id INT,
    cost DECIMAL(10, 2) DEFAULT 0.00,
    remaining_qty INT DEFAULT 0,
    supplier_name VARCHAR(255),
    other_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 3. Employees Table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL
);

-- 4. Issued Items Table (Includes snapshot of material details)
CREATE TABLE issued_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT,
    material_name VARCHAR(255) NOT NULL,
    material_code VARCHAR(100) NOT NULL,
    emp_id VARCHAR(50) NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    remarks TEXT,
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL
);

-- 5. Stock Inward Table
CREATE TABLE stock_inward (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT,
    supplier_name VARCHAR(255),
    quantity_added INT NOT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

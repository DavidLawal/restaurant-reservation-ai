IF DB_ID('restaurant_app') IS NULL
   CREATE DATABASE restaurant_app;
GO

USE restaurant_app;
GO

DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS users;



CREATE TABLE users (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE menu_items(
    id INT IDENTITY(1, 1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    available BIT NOT NULL DEFAULT 1
);

CREATE TABLE orders (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_orders_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL, 
    price_each DECIMAL(10, 2) NOT NULL,
    CONSTRAINT FK_order_items_orders FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT FK_order_items_menu_items FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE events (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    capacity INT NOT NULL,
    available_seats INT NOT NULL
);

CREATE TABLE reservations (
    id INT IDENTITY(1, 1) PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    party_size INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    CONSTRAINT FK_reservations_users FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO menu_items (name, description, price, category)
VALUES ('Classic Burger', 'Beef patty with chedder', 14.99, 'Mains');

INSERT INTO menu_items (name, description, price, category)
VALUES ('French Fries', 'Crispy golden fries', 4.50, 'Sides');

INSERT INTO menu_items (name, description, price, category)
VALUES('Chocolate Cake', 'Rich cake with fudge icing', 6.99, 'Desserts');

INSERT INTO menu_items (name, description, price, category)
VALUES('Eba and Egusi soup', 'Traditional Nigerian dish', 12.99, 'Mains');

INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin User', 'admin@example.com', '$2b$10$GwsOSMLxIP/e3nNWaqDh3e7WYravb5Kucu6v9NnWXi3vYNKujQtfm', 'admin');

INSERT INTO users (name, email, password_hash, role)
VALUES ('Jane Customer', 'jane@example.com', '$2b$10$GwsOSMLxIP/e3nNWaqDh3e7WYravb5Kucu6v9NnWXi3vYNKujQtfm', 'customer');

INSERT INTO events (title, description, event_date, capacity, available_seats)
VALUES ('Jazz Night', 'Live music and a special dinner menu', '2026-12-31 19:00', 50, 50);

INSERT INTO reservations (user_id, date, time, party_size)
VALUES (2, '2026-12-05', '19:00', 4);

INSERT INTO reservations (user_id, date, time, party_size)
VALUES (2, '2026-12-10', '18:30', 2);

INSERT INTO orders (user_id, total_price)
VALUES(2, 23.99);

INSERT INTO order_items (order_id, menu_item_id, quantity, price_each)
VALUES(1, 1, 1, 14.99);

INSERT INTO order_items (order_id, menu_item_id, quantity, price_each)
VALUES(1, 2, 2, 4.50);
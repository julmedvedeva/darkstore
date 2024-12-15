-- Создание таблиц
CREATE TABLE goods (
  goodid SERIAL PRIMARY KEY,
  plu VARCHAR(10) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  price NUMERIC(10, 2) NOT NULL,
  stockquantity INTEGER NOT NULL,
  createdat TIMESTAMP NOT NULL DEFAULT now(),
  deletedat TIMESTAMP NULL
);

CREATE TABLE orders (
  orderid SERIAL PRIMARY KEY,
  totalamount NUMERIC(10, 2) NOT NULL,
  createdat TIMESTAMP NOT NULL DEFAULT now(),
  deletedat TIMESTAMP NULL
);
CREATE TABLE ordersgoods (
  ordersgoodsid SERIAL PRIMARY KEY,
  orderid INTEGER NOT NULL,
  goodid INTEGER NOT NULL,
  goodname VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (orderid) REFERENCES orders(orderid),
  FOREIGN KEY (goodid) REFERENCES goods(goodid)
);
-- Заполнение таблиц
INSERT INTO goods (plu, name, description, price, stockquantity) VALUES
('PLU001', 'Apple', 'Fresh red apple', 0.50, 100),
('PLU002', 'Banana', 'Ripe yellow banana', 0.30, 150),
('PLU003', 'Orange', 'Juicy orange', 0.60, 80),
('PLU004', 'Grapes', 'Seedless green grapes', 2.00, 50),
('PLU005', 'Strawberry', 'Fresh strawberries', 1.50, 200),
('PLU006', 'Blueberry', 'Organic blueberries', 3.00, 75),
('PLU007', 'Pineapple', 'Sweet pineapple', 1.20, 30),
('PLU008', 'Mango', 'Ripe mango', 1.80, 60),
('PLU009', 'Watermelon', 'Fresh watermelon', 4.00, 20),
('PLU010', 'Peach', 'Juicy peach', 1.00, 90),
('PLU011', 'Buttermilk', 'Creamy buttermilk for cooking', 2.50, 40),
('PLU012', 'Kiwi', 'Sweet and tangy kiwi', 0.80, 100),
('PLU013', 'Papaya', 'Ripe papaya', 1.50, 60),
('PLU014', 'Pomegranate', 'Fresh pomegranate', 2.50, 30),
('PLU015', 'Coconut', 'Fresh coconut', 3.00, 20),
('PLU016', 'Lemon', 'Sour lemon', 0.40, 150),
('PLU017', 'Lime', 'Fresh lime', 0.30, 120),
('PLU018', 'Cherry', 'Sweet cherries', 2.00, 80),
('PLU019', 'Blackberry', 'Fresh blackberries', 2.20, 70),
('PLU020', 'Raspberry', 'Juicy raspberries', 2.50, 50),
('PLU021', 'Cucumber', 'Fresh cucumber', 0.60, 90),
('PLU022', 'Tomato', 'Ripe tomato', 0.70, 110),
('PLU023', 'Carrot', 'Crunchy carrot', 0.50, 130),
('PLU024', 'Potato', 'Fresh potatoes', 0.40, 200),
('PLU025', 'Onion', 'Sweet onion', 0.30, 150),
('PLU026', 'Garlic', 'Fresh garlic', 0.20, 180),
('PLU027', 'Bell Pepper', 'Colorful bell pepper', 0.90, 75),
('PLU028', 'Spinach', 'Fresh spinach', 1.00, 100),
('PLU029', 'Broccoli', 'Fresh broccoli', 1.20, 60),
('PLU030', 'Cauliflower', 'Fresh cauliflower', 1.50, 50),
('PLU031', 'Zucchini', 'Fresh zucchini', 0.80, 90);

INSERT INTO orders (totalamount) VALUES
(2.50),
(2.90),
(3.70);

INSERT INTO ordersgoods (orderid, goodid, goodname, quantity) VALUES
(1, 1, 'Apple', 2),
(1, 5, 'Strawberry', 1),
(2, 2, 'Banana', 3),
(2, 4, 'Grapes', 1),
(3, 3, 'Orange', 2),
(3, 11, 'Buttermilk', 1);

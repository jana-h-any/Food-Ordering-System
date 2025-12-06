	-- Restaurants
	use FoodOrdering;

INSERT INTO Restaurant (Name, Image, Description) VALUES 
('Burger King', 'assets/restaurants/Burger.jpeg', 'Famous burger chain'),
('Mtamen Italiano', 'assets/restaurants/italiano.png', 'Italian restaurant with authentic pizzas and pastas');


INSERT INTO Menu (RestaurantId, Name) VALUES 
(1, 'Burgers');

INSERT INTO Menu (RestaurantId, Name) VALUES 
(2, 'Pizzas'),
(2, 'Pastas');

-- Burger King - Burgers (MenuId = 1)
INSERT INTO MenuItem (MenuId, Name, Price, Image, Description, Category) VALUES
(1, 'Classic Burger', 150, 'assets/menuItems/B1.jpg', 'Delicious beef burger', 'Burger'),
(1, 'Cheese Burger', 155, 'assets/menuItems/B2.jpg', 'Beef burger with cheese', 'Burger'),
(1, 'Chicken Zinger Burger', 160, 'assets/menuItems/B3.jpg', 'Hot and crispy chicken fillet packed with bold zinger flavor and special sauce.', 'Burger'),
(1, 'Bacon Burger', 152, 'assets/menuItems/B4.jpg', 'Burger with crispy bacon', 'Burger'),
(1, 'Spicy Chicken Burger', 148, 'assets/menuItems/B5.jpg', 'Healthy veggie patty', 'Burger'),
(1, 'Double Burger', 170, 'assets/menuItems/B6.jpg', 'Double beef patty burger', 'Burger'),
(1, 'Crispy Chicken Burger', 158, 'assets/menuItems/B7.jpg', 'Crunchy golden-fried chicken fillet with fresh lettuce and creamy mayo', 'Burger'),
(1, 'Mushroom Burger', 160, 'assets/menuItems/B8.jpg', 'Burger with sautéed mushrooms', 'Burger'),
(1, 'BBQ Burger', 162, 'assets/menuItems/B9.jpg', 'Burger with BBQ sauce', 'Burger'),
(1, 'Grilled Chicken Burger', 175, 'assets/menuItems/B10.jpg', 'Juicy grilled chicken breast served with fresh veggies and a light garlic sauce.', 'Burger');

-- Mtamen Italiano - Pizzas (MenuId = 2)
INSERT INTO MenuItem (MenuId, Name, Price, Image, Description, Category) VALUES
(2, 'Margherita Pizza', 90, 'assets/menuItems/P2.jpg', 'Classic Italian pizza with fresh mozzarella, basil, and rich tomato sauce.', 'Pizza'),
(2, 'Pepperoni Pizza', 110, 'assets/menuItems/P1.jpg', 'Crispy pepperoni slices on a cheesy, flavorful tomato base.', 'Pizza'),
(2, 'BBQ Chicken Pizza', 120, 'assets/menuItems/P3.jpg', 'Tender chicken chunks with smoky BBQ sauce, onions, and melted cheese.', 'Pizza'),
(2, 'Veggie Supreme Pizza', 195, 'assets/menuItems/P4.jpg', 'A colorful mix of fresh vegetables on a perfectly baked cheesy crust.', 'Pizza');

-- Mtamen Italiano - Pastas (MenuId = 3)
INSERT INTO MenuItem (MenuId, Name, Price, Image, Description, Category) VALUES
(3, 'Alfredo Pasta', 85, 'assets/menuItems/Pa1.jpg', 'Creamy Alfredo sauce with parmesan and tender fettuccine noodles.', 'Pasta'),
(3, 'Chicken Pasta', 95, 'assets/menuItems/Pa2.jpg', 'Grilled chicken tossed with pasta in a rich, savory cream sauce.', 'Pasta'),
(3, 'Spaghetti Bolognese', 100, 'assets/menuItems/Pa3.jpg', 'Traditional Italian spaghetti served with slow-cooked beef bolognese.', 'Pasta'),
(3, 'Pesto Pasta', 90, 'assets/menuItems/Pa4.jpg', 'Fresh basil pesto mixed with pasta and topped with parmesan cheese.', 'Pasta'),
(3, 'Shrimp Creamy Pasta', 120, 'assets/menuItems/Pa5.jpg', 'Juicy shrimp cooked in creamy garlic sauce with perfectly cooked pasta.', 'Pasta');

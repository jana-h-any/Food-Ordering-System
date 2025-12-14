USE FoodOrdering;
CREATE TABLE Admin (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255)
);

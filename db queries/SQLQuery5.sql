use FoodOrdering;

ALTER TABLE Restaurant
ADD Password VARCHAR(200);


CREATE TABLE Address (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL FOREIGN KEY REFERENCES [User](Id),
    City VARCHAR(100),
    Street VARCHAR(200),
    Building VARCHAR(50),
    Apartment VARCHAR(50),
    Notes VARCHAR(300)
);


ALTER TABLE Orders
ADD AddressId INT NULL FOREIGN KEY REFERENCES Address(Id);
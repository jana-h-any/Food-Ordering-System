USE FoodOrdering;

ALTER TABLE Restaurant
ADD 
    Status VARCHAR(20) DEFAULT 'pending',
    OwnerEmail VARCHAR(100),
    OwnerPhone VARCHAR(20);

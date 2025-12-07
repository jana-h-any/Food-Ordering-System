//server.js
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors());

const config = {
    user: 'fooduser',     
    password: '12345', 
    server: 'DESKTOP-M4OGUHH',
    database: 'FoodOrdering',
    options: {
        trustServerCertificate: true
    }
};


app.get('/menuitems', async (req, res) => {
  const restaurantId = req.query.restaurantId; 
  try {
      console.log("🔵 Trying to connect to DB...");

      let pool = await sql.connect(config);
      console.log("🟢 Connected to DB successfully!");

     
      let result = await pool.request()
          .input('restaurantId', sql.Int, restaurantId)
          .query(`
              SELECT mi.*
              FROM MenuItem mi
              JOIN Menu m ON mi.MenuId = m.Id
              WHERE m.RestaurantId = @restaurantId
          `);

      console.log("🟢 Query Result:", result.recordset);

      res.json(result.recordset);

  } catch (err) {
      console.log("🔴 ERROR:", err);
      res.status(500).send(err);
  }
});

app.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
      const pool = await sql.connect(config);

      const existing = await pool.request()
          .input('email', sql.VarChar, email)
          .query('SELECT * FROM [User] WHERE Email = @email');

      if(existing.recordset.length > 0){
          return res.status(400).json({ message: "Email already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.request()
          .input('name', sql.VarChar, name)
          .input('email', sql.VarChar, email)
          .input('phone', sql.VarChar, phone)
          .input('password', sql.VarChar, hashedPassword)
          .query(`INSERT INTO [User] (Name, Email, Phone, Password)
                  VALUES (@name, @email, @phone, @password)`);

      res.json({ message: "User registered successfully!" });

  } catch(err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const pool = await sql.connect(config);
  
        const userResult = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM [User] WHERE Email = @email');
  
        if(userResult.recordset.length === 0){
            return res.status(400).json({ message: "Incorrect email or password!" });
        }
  
        const user = userResult.recordset[0];
  
        const isMatch = await bcrypt.compare(password, user.Password);
        if(!isMatch){
            return res.status(400).json({ message: "Incorrect email or password!" });
        }
  
        res.json({ message: "Login successful!", userId: user.Id });
  
    } catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
  });
  
app.get('/restaurants', async (req, res) => {
  try {
      const pool = await sql.connect(config);
      const result = await pool.request().query('SELECT * FROM Restaurant');
      res.json(result.recordset);
  } catch(err){
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
});

app.post("/create-order", async (req, res) => {
    const { userId, restaurantId, items, totalPrice } = req.body;
  
    try {
      const pool = await sql.connect(config);
  
      // Step 1: Add order
      const orderResult = await pool.request()
        .input("UserId", sql.Int, userId)
        .input("RestaurantId", sql.Int, restaurantId)
        .input("TotalPrice", sql.Decimal(10,2), totalPrice)
        .query(`
          INSERT INTO Orders (UserId, RestaurantId, TotalPrice)
          OUTPUT INSERTED.Id
          VALUES (@UserId, @RestaurantId, @TotalPrice)
        `);
  
      const orderId = orderResult.recordset[0].Id;
  
      for(const item of items) {
        await pool.request()
          .input("OrderId", sql.Int, orderId)
          .input("MenuItemId", sql.Int, item.menuItemId)
          .input("Quantity", sql.Int, item.quantity)
          .input("Price", sql.Decimal(10,2), item.price)
          .query(`
            INSERT INTO OrderItem (OrderId, MenuItemId, Quantity, Price)
            VALUES (@OrderId, @MenuItemId, @Quantity, @Price)
          `);
      }
  
      res.json({ success: true, orderId });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: err });
    }
  });
  
  app.get("/user-orders", async (req, res) => {
    const userId = req.query.userId;
    try {
        const pool = await sql.connect(config);

        const ordersResult = await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`
                SELECT o.*, r.Name AS RestaurantName
                FROM Orders o
                JOIN Restaurant r ON o.RestaurantId = r.Id
                WHERE o.UserId = @UserId
                ORDER BY o.Id DESC
            `);

        const orders = ordersResult.recordset;

        for(const order of orders){
            const itemsResult = await pool.request()
                .input("OrderId", sql.Int, order.Id)
                .query(`
                    SELECT oi.*, mi.Name, mi.Image 
                    FROM OrderItem oi 
                    JOIN MenuItem mi ON oi.MenuItemId = mi.Id 
                    WHERE OrderId = @OrderId
                `);
            order.items = itemsResult.recordset;
        }

        res.json({ success: true, orders });

    } catch(err){
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
});


// dashboard 

app.post('/restaurant/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const pool = await sql.connect(config);

        const r = await pool.request()
            .input('name', sql.VarChar, name)
            .query("SELECT * FROM Restaurant WHERE Name=@name");

        if(r.recordset.length === 0)
            return res.status(400).json({ message: "Restaurant not found" });

        const restaurant = r.recordset[0];

        const isMatch = await bcrypt.compare(password, restaurant.Password);
        if(!isMatch)
            return res.status(400).json({ message: "Wrong password!" });

        res.json({ message: "Login successful!", restaurantId: restaurant.Id });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});


app.get('/restaurant-orders', async (req, res) => {
    const restaurantId = req.query.restaurantId;
    try{
        const pool = await sql.connect(config);
        const ordersResult = await pool.request()
            .input('RestaurantId', sql.Int, restaurantId)
            .query(`
                SELECT o.*, u.Name AS CustomerName, u.Phone
                FROM Orders o
                JOIN [User] u ON o.UserId = u.Id
                WHERE o.RestaurantId = @RestaurantId
                ORDER BY o.Id DESC
            `);

        const orders = ordersResult.recordset;

        for(const order of orders){
            const itemsResult = await pool.request()
                .input("OrderId", sql.Int, order.Id)
                .query(`
                    SELECT oi.*, mi.Name AS ItemName 
                    FROM OrderItem oi 
                    JOIN MenuItem mi ON oi.MenuItemId = mi.Id
                    WHERE OrderId=@OrderId
                `);
            order.items = itemsResult.recordset;
        }

        res.json({ success: true, orders });

    } catch(err){
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
});

app.put('/update-order-status', async (req,res)=>{
    const { orderId, status } = req.body;
    try{
        const pool = await sql.connect(config);
        await pool.request()
            .input('OrderId', sql.Int, orderId)
            .input('Status', sql.VarChar, status)
            .query('UPDATE Orders SET Status=@Status WHERE Id=@OrderId');
        res.json({ success: true, message: "Order status updated" });
    } catch(err){
        console.error(err);
        res.status(500).json({ success: false, error: err });
    }
});
app.post('/restaurant/add-menu-item', async (req,res)=>{
    const { restaurantId, name, price, image, category, description } = req.body;

    try{
        const pool = await sql.connect(config);

        // الحصول على الـ Menu الخاصة بالمطعم
        const menuResult = await pool.request()
            .input('RestaurantId', sql.Int, restaurantId)
            .query('SELECT * FROM Menu WHERE RestaurantId=@RestaurantId');

        let menuId;

        if(menuResult.recordset.length === 0){
            const newMenu = await pool.request()
                .input('RestaurantId', sql.Int, restaurantId)
                .input('Name', sql.VarChar, 'Main Menu')
                .query(`
                    INSERT INTO Menu (RestaurantId, Name) 
                    OUTPUT INSERTED.Id 
                    VALUES (@RestaurantId, @Name)
                `);
            menuId = newMenu.recordset[0].Id;
        } 
        else {
            menuId = menuResult.recordset[0].Id;
        }

        // إدراج الـ MenuItem بالقيم الجديدة
        await pool.request()
            .input('MenuId', sql.Int, menuId)
            .input('Name', sql.VarChar, name)
            .input('Price', sql.Decimal(10,2), price)
            .input('Image', sql.VarChar, image)
            .input('Category', sql.VarChar, category || null)
            .input('Description', sql.VarChar, description || null)
            .query(`
                INSERT INTO MenuItem (MenuId, Name, Price, Image, Category, Description)
                VALUES (@MenuId, @Name, @Price, @Image, @Category, @Description)
            `);

        res.json({ success:true, message:"Menu item added" });

    } catch(err){
        console.error(err);
        res.status(500).json({ success:false, error:err });
    }
});

//pass 

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));


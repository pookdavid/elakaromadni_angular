npm install express sequelize mysql2 bcrypt jsonwebtoken
node server.js
---------------------------------------------------------
testdata:|
---------|
INSERT INTO users (username, email, password_hash) 
VALUES ('testuser', 'test@example.com', 'hashed_password');

INSERT INTO ads (title, price, seller_id)
VALUES ('Suzuki Swift', 3500000, 1);

INSERT INTO car_specs (ad_id, brand, model, year)
VALUES (1, 'Suzuki', 'Swift', 2020);
-----------------------------------------------------------
endtest:|
--------|
# Login
curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'

# Get Ads
curl http://localhost:3000/api/ads?brand=Suzuki&minPrice=3000000
-----------------------------------------------------------------
még nincs:
message
review
notification
payment
const mysql = require('mysql2');

console.log('Testing MySQL connection with:');
console.log('Host: localhost');
console.log('Port: 3309');
console.log('User: user');
console.log('Password: 1234');

// First try to connect without database
const adminConnection = mysql.createConnection({
  host: 'localhost',
  port: 3309,
  user: 'user',
  password: '1234'
});

adminConnection.connect((err) => {
  if (err) {
    console.error('❌ Failed to connect to MySQL:', err.message);
    console.error('Error code:', err.code);
    
    // Check common errors
    if (err.code === 'ECONNREFUSED') {
      console.log('\n💡 MySQL might not be running on port 3309.');
      console.log('Check if MySQL is installed and running.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Wrong username/password or user does not exist.');
      console.log('Try: mysql -u root -p (if you have root access)');
    }
    
    process.exit(1);
  } else {
    console.log('✅ Connected to MySQL server successfully!');
    
    // Check if database exists
    adminConnection.query('SHOW DATABASES LIKE "ecommerce"', (err, results) => {
      if (err) {
        console.error('Error checking databases:', err.message);
        adminConnection.end();
        process.exit(1);
      }
      
      if (results.length > 0) {
        console.log('✅ Database "ecommerce" exists!');
        adminConnection.end();
        
        // Now test connection to the database
        const dbConnection = mysql.createConnection({
          host: 'localhost',
          port: 3309,
          user: 'user',
          password: '1234',
          database: 'ecommerce'
        });
        
        dbConnection.connect((dbErr) => {
          if (dbErr) {
            console.error('❌ Cannot connect to ecommerce database:', dbErr.message);
            process.exit(1);
          } else {
            console.log('✅ Successfully connected to ecommerce database!');
            dbConnection.end();
            process.exit(0);
          }
        });
        
      } else {
        console.log('⚠️ Database "ecommerce" does not exist. Creating it...');
        
        adminConnection.query('CREATE DATABASE ecommerce', (createErr) => {
          if (createErr) {
            console.error('❌ Failed to create database:', createErr.message);
            console.log('\n💡 The "user" account might not have CREATE DATABASE permission.');
            console.log('Try creating it manually:');
            console.log('mysql -u root -p -e "CREATE DATABASE ecommerce;"');
            console.log('mysql -u root -p -e "CREATE USER \'user\'@\'localhost\' IDENTIFIED BY \'1234\';"');
            console.log('mysql -u root -p -e "GRANT ALL PRIVILEGES ON ecommerce.* TO \'user\'@\'localhost\';"');
            console.log('mysql -u root -p -e "FLUSH PRIVILEGES;"');
          } else {
            console.log('✅ Database "ecommerce" created successfully!');
          }
          adminConnection.end();
          process.exit(createErr ? 1 : 0);
        });
      }
    });
  }
});
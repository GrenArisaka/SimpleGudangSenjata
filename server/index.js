//Author GrenArisaka (Tristan Suud)
//Backend server for Gudang Senjata.

//imports
/*
express : Node.js web app framework
mariadb : provides connection to the MariaDB database 'manifest_gudang_senjata'
cors : provides HTTP-header based interactions
bodyparser : parses json sent by frontend
*/

const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');
const bodyparser = require('body-parser');

const app = express();
const port = 8081;

app.use(cors());
app.use(bodyparser.json());

//connection pool init
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database:'manifest_gudang_senjata',
    connectionLimit: 5
});


//create route
app.post("/senjata/create", async (req,res)=>{
    //extract data from request body
    const nama = req.body.nama;
    const varian = req.body.varian;
    const amunisi = req.body.amunisi;
    const tahun = req.body.tahun;
    const jumlah =req.body.jumlah;

    //nullcheck everything
    if (!nama){
        return res.status(400).send('Name is required.');
    }
    if (!varian){
        return res.status(400).send('Variant is required.');
    }
    if (!amunisi){
        return res.status(400).send('Ammunition is required.');
    }
    if (!tahun){
        return res.status(400).send('Tahun is required.');
    }
    if (!jumlah){
        return res.status(400).send('Tahun is required.');
    }

    //query
    let connection;
    try {
      connection = await pool.getConnection();
      const rows = await connection.query('INSERT INTO manifest_senjata (nama, varian, amunisi, tahun, jumlah) VALUES (?,?,?,?,?)',[nama, varian, amunisi, tahun, jumlah]);
      console.log('Result:', rows);
      res.send("Values Inserted");
    } catch (error) {
      console.error('Error:', error);
    } finally {
      if (connection) {
        connection.end();
      }
    }
});


//get route
app.get('/senjata/get', async (req, res) => {
    try {
      // Logic Implementation the logic to retrieve data from the database
      const data = await getDataFromDatabase();

      res.json(data);
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Update route
app.put('/senjata/put/:varian', async(req,res) =>{
    const { varian } = req.params;
    const updatedData = req.body;
  
    //query
    try {
      // Logic Implementation to update the record based on 'varian'
      const result = await updateDataInDatabase(varian, updatedData);
      res.json({ success: true, message: 'Record updated successfully' });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
})

//delete route
app.delete('/senjata/deleteData/:varian', async (req, res) => {
    const { varian } = req.params;
  
    try {
      // Logic Implementation to delete the record based on the name
      const result = await deleteDataFromDatabase(varian);
  
      res.json({ success: true, message: 'Record deleted successfully'});
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  const deleteDataFromDatabase = async (varian) => {
    //obtain connection
    const connection = await pool.getConnection();
    //query
    try {
      const result = await connection.query('DELETE FROM manifest_senjata WHERE varian = ?', [varian]);
      return result;
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  };

const updateDataInDatabase = async (varian, updatedData) => {
    //setClause would be the data to be updated, a string then provided into the mysql query.
    const setClause = Object.entries(updatedData)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(', ');
    console.log(setClause);
    const connection = await pool.getConnection();
    const result = await connection.query('UPDATE manifest_senjata SET '+setClause+' WHERE varian = ?', [varian]);
    console.log(result);
    connection.end();
    return result;
  };

const getDataFromDatabase = async () => {
    const connection = await pool.getConnection();
    const result = await connection.query('SELECT * FROM manifest_senjata');
    
    connection.end();
    
    return result;
  };


//unused function to test connection to database
async function runQuery() {
    let connection;
    try {
      connection = await pool.getConnection();
      const rows = await connection.query('SELECT * FROM manifest_senjata');
      console.log('Result:', rows);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      if (connection) {
        connection.end();
      }
    }
  }



//establish server
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
//Author: GrenArisaka (Tristan Suud)
//Frontend ReactJS

import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import axios from 'axios';
import './App.css';

function App() {
  const [nama, setNama] = useState('');
  const [varian, setVarian] = useState('');
  const [tahun, setTahun] = useState('');
  const [amunisi, setAmunisi] = useState('');
  const [jumlah, setJumlah] = useState(0);
  const [varian2, setVarian2] = useState('');
  const [senjataData, setSenjataData] = useState([]);


  //Function to handle post request.
  const handleSenjataCreate = async () =>{
    try{
      const response = await axios.post('http://localhost:8081/senjata/create', {
        nama: nama,
        varian: varian,
        tahun: tahun,
        amunisi : amunisi,
        jumlah: jumlah
      }).then(()=>{console.log("success")});
      
    } catch (error){
      console.log("whoops, ada error: "+error.message);
    }
  }
  //Function to handle put request.
  const handleSenjataEdit = async () => {
    try {
      const varianToUpdate = varian;
      const updateData = {tahun, amunisi, jumlah};

      const response = await axios.put(`http://localhost:8081/senjata/put/${varianToUpdate}`, updateData);
      console.log('Update response:', response.data);
    } catch (error)
    {
      console.log("whoops, ada error: "+error.message);
    }

  }
  //Function to handle delete request.
  const handleSenjataDelete = async ()=>{
    const varianToDelete = varian2; // Replace with the actual name you want to delete

    try {
      const response = await axios.delete(`http://localhost:8081/senjata/deleteData/${varianToDelete}`);
      console.log('Delete response:', response.data);
      // Optionally, handle UI updates or fetch updated data
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  }
  //Function to handle getting the data.
  const handleSenjataGet = async ()=>{
    try{
      const response = await axios.get('http://localhost:8081/senjata/get');
      setSenjataData(response.data);
      console.log('Response Data:', response.data);
    } catch (error){
      console.log("whoops, ada error di get: "+error.message);
    }
  }
//ReactJS design
  return (
    <div className="App">
      <h1>Manifest Gudang Senjata</h1>
      <div className="container">
        <div className="form">
          <h2>Masukkan Item Baru pada tabel senjata.</h2>
          <label>Nama: </label>
          <input type="text" onChange={(e)=>{setNama(e.target.value);}}></input>
          <label>Varian: </label>
          <input type="text" onChange={(e)=>{setVarian(e.target.value);}}></input>
          <label>Amunisi: </label>
          <input type="text" onChange={(e)=>{setAmunisi(e.target.value);}}></input>
          <label>Tahun: </label>
          <input type="text" onChange={(e)=>{setTahun(e.target.value);}}></input>
          <label>Jumlah: </label>
          <input type="number" onChange={(e)=>{setJumlah(e.target.value);}}></input>
          <button onClick={handleSenjataCreate}>Add New</button>
          <p>Edit data, data dicari berdasarkan varian.</p>
          <button onClick={handleSenjataEdit}>Edit Data</button>
          <div className='deleteForm'>
            <p>Delete sebuah record berdasarkan varian. Hati-hati.</p>
            <label>Varian: </label>
            <input type="text" onChange={(e)=>{setVarian2(e.target.value);}}></input>
            <button onClick={handleSenjataDelete}>Delete</button>
          </div>
        </div>
        <div className="dataholder">
          <button onClick={handleSenjataGet}>Refresh</button>
          <h2>Data Gudang Senjata</h2>
          {senjataData !== null && senjataData.length > 0 ? (
        <DataTable data={senjataData} />
          ) : (
          <p></p>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default App;

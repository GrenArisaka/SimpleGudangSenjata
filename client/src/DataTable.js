import React from 'react'
import './App.css';
const DataTable = ({ data }) => {
    return (
      <table>
        <thead>
          <tr>
            {/* Render table headers based on keys of the first data item */}
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render table rows based on data */}
          {data.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  

export default DataTable
import Input from './componants/input';
import { useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({
    fileName: '',
    contentType: ''
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = () => {
    console.log(`${process.env.REACT_APP_API_URL}/jobs`);
    
    fetch(`${process.env.REACT_APP_API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log('Success:', result);
    })
    .then(() => {
      setData({
        fileName: '',
        contentType: ''
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  
  return (
    <div className="App">
      <Input label="File Name" type="text" name="fileName" value={data.fileName} onChange={handleChange} />
      <Input label="Content Type" type="text" name="contentType" value={data.contentType} onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;

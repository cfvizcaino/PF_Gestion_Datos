import { useState } from 'react';
import axios from 'axios';

const TestPing = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handlePing = async () => {
    try {
      setError(null);
      const resp = await axios.get(`${process.env.REACT_APP_API_URL}/personas/ping`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Ping response:', resp.data); // Para debug
      setResponse(resp.data);
    } catch (error) {
      console.error('Ping error:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <button onClick={handlePing}>Test Personas Ping</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {response && (
        <pre style={{marginTop: '10px', padding: '10px', background: '#f5f5f5'}}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default TestPing;


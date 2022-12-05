import { useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000/api';

function login(username: string) {
  return axios.post('/login', { username });
}

function App() {
  useEffect(() => {
    login('willi')
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, [])

  return (
    <div>
      <h1>hello</h1>
    </div>
  );
}

export default App;

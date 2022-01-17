import { useState } from 'react';
import './App.css';
import { Login } from './components/Login';
import { Profile } from './components/Profile';


function App() {
  const [isLogin, setLogin] = useState(false);
  
  return (
    <div>
      {!isLogin  && <Login login={(value)=>{setLogin(value)}}/>}
      {isLogin && <Profile/>}
    </div>
  );
}

export default App;

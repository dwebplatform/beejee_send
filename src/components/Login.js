//@ts-nocheck
import { useState } from "react"

export const Login=({login})=>{
  const [user, setUser] = useState({
    login:"",
    password:""
  });

  const [error, setError] = useState(null);
  
  const handleChange=(e)=>{
    const keyName = e.target.name;

    setUser((prevUser)=>{
    return {
      ...prevUser,
      [keyName]:e.target.value
    }  
    })
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();

    if(user.login ==="admin" && user.password==="123"){

      const formData = new FormData();
      formData.append('username',user.login);
      formData.append('password',user.password);
      try{
        const response = await fetch('https://uxcandy.com/~shapoval/test-task-backend/v2/login/?developer=admin',{
          method:"POST",
          body: formData
        });
        const data = await response.json();
        if(data.status === "ok"){
          localStorage.setItem("accessToken", data.message.token);
          login(true);
        }
      } catch(err){
        setError({msg:"Не удалось войти"})
      }

    } else {
     
      login(false)
      setError({msg:"Не удалось войти"})
    }

  }
  return (<form 
  onSubmit={handleSubmit}
  style={{width:"100%", maxWidth:"600px", margin:"0 auto", paddingTop:"6rem"}}>
    {error && (<article class="message is-danger">
  <div class="message-body">
    {error.msg}
  </div>
</article>)}
    <div className="field">
      <div style={{display:'flex'}}>
      <label className="label">Login</label>
      </div>
      <div className="control">
      <input className="input" name="login" value={user.login} 
      onChange={handleChange}
      type="text"/>
      </div>
    </div>
    <div className="field">
    <div style={{display:'flex'}}>
      <label className="label">Password</label>
      </div>
      <div className="control">
      <input className="input" type="password"
      name="password" value={user.password} 
      onChange={handleChange}
      />
      </div>
    </div>
    <div className="field">
    <div className="control">
      <div style={{display:'flex'}}>
      <button className="button is-link">Submit</button>
      </div>
  </div>
    </div>
  </form>)
}
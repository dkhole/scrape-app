import { useState } from "react";
import { useHistory } from "react-router-dom";

export const Login = () => {
  const [password, setPassword]  = useState<string>('');
  const [error, setError] = useState<string>('');
  const history = useHistory();

  //verify password
  const login = async() => {

		const res = await fetch(`api/auth`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({password}),
		});
    //if res status is 200 then redirect
    if(res.status === 200) {
      history.push('/api');
    }
    else {
      setError('Incorrect password');
    }
  }


  return (
    <div className="login">
      LOGIN
      <div>
          <span>Password</span>
          <input type="text" value={password} onChange={(e) => {setPassword(e.target.value)}}></input>
          <button onClick={login}>Enter</button>
          <span>{error}</span>
      </div>
    </div>
  );
}

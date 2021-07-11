import { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  const [password, setPassword]  = useState<string>('');

  //if login is successful let server know and recieve jwt token

  return (
    <div className="login">
      LOGIN
      <div>
        Password <input type="text" value={password} onChange={(e) => {setPassword(e.target.value)}}></input>
          <Link to="/api">main dashboard</Link>
      </div>
    </div>
  );
}

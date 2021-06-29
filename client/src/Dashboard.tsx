import {
    Link,
  } from "react-router-dom";

const Dashboard = () => {

  return (
    <div className="dashboard">
      Dashboard
      <div>
          <Link to="/app">App</Link>
      </div>
    </div>
  );
}

export default Dashboard;
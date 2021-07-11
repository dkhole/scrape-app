import { Link, useRouteMatch } from "react-router-dom";

const Dashboard = () => {
  let match = useRouteMatch();

  return (
    <div className="dashboard">
      Dashboard
      <div>
          <Link to={`${match.path}/scrape`}>Gum Scraper</Link>
      </div>
    </div>
  );
}

export default Dashboard;
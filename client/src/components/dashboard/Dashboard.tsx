import { Link, useRouteMatch } from "react-router-dom";

export const Dashboard = () => {
  let match = useRouteMatch();

  return (
    <div className="dashboard">
      Dashboard
      <div>
          <Link to={`${match.path}/scrape`}>Gum Scraper</Link>
      </div>
      <div>
          <Link to={`${match.path}/auto-msg`}>Auto-Msg</Link>
      </div>
    </div>
  );
}
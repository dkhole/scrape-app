import React, {useState} from 'react';
import './App.css';

type Entry = {
  name: string;
  location: string;
  category: string;
  category_mapped: string;
  price: string;
  url: string;
  profile_url: string;
  has_number: string;
};

function App() {
  const [data, setData] = useState<Entry[]>();
  const [scraping, setScraping] = useState<boolean>(false);

  const startScrape = async(mode: string) => {
    setScraping(true);
    const resp = await fetch(`/start-${mode}`);
    const data = await resp.json();
    setData(JSON.parse(data));
    setScraping(false);
  }

  const startSmall = async() => {
    startScrape('small');
  }

  const startToday = async() => {
    startScrape('today');
  }

  const startFull = async() => {
    startScrape('full');
  }
  
  return (
    <div className="App">
      {scraping ? <div>Scraping...</div> : <div>Ready to scrape</div>}
      <button onClick={startSmall}>Start Small</button>
      <button onClick={startToday}>Start Today</button>
      <button onClick={startFull}>Start Full</button>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>location</th> 
            <th>category</th>
            <th>category_mapped</th>
            <th>price</th>
            <th>url</th>
            <th>profile_url</th>
            <th>has_number</th>
          </tr>
        </thead>
        <tbody>
        {
            data ?
            data.map((entry: Entry, index: number) => {
              return (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.location}</td>
                  <td>{entry.category}</td>
                  <td>{entry.category_mapped}</td>
                  <td>{entry.price}</td>
                  <td>{entry.url}</td>
                  <td>{entry.profile_url}</td>
                  <td>{entry.has_number ? 'true' : 'false'}</td>
                </tr>
                );
            }) : <tr><td>no data, scrape first</td></tr>
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;

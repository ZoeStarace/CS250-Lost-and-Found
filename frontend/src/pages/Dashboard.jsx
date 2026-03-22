import './Dashboard.css'
export default function Dashboard() {
    return (
        <div className='dashboard-container'>
            <h1 className="header-box">Dashboard</h1>
            <a className="color-box box-one" href="/Search">Search Item</a>
            <a className="color-box box-two" href="/Report">Report Item</a>
            <a className="color-box box-three" href="https://library2.sdsu.edu/wayfinder/">SDSU Map</a>
            <a className="color-box box-four" href="/">Chat System</a>
        </div>
    );
}
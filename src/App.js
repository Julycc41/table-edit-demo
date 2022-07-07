import { MapApiLoaderHOC } from 'react-bmapgl';
import "react-chinese-city-selector/dist/index.css";
import SetMapping from './table';
function App() {

  return (
  <div style={{height: '500px', width: '500px'}}>
    {/* <AddReceive></AddReceive> */}
    <SetMapping></SetMapping>
  </div>
  )
}
export default MapApiLoaderHOC({ ak: '1XjLLEhZhQNUzd93EjU5nOGQ' })(App)

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './views/components/navbar';
import HomePage from './views/pages/Home';
import Listings from './views/pages/Listing';
import HouseDetails from './views/pages/HouseDetail';
import HousePricePredictor from './views/pages/PricePredictor';
import HistoricalRates from './views/pages/HistoricalRates';
import Profile from './views/pages/Profile';
import UserProfile from './views/pages/Profile';

function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<Listings />} />
<Route path="/house/:id" element={<HouseDetails />} />  
<Route 
          path='/predict' 
          element={
            <HousePricePredictor
              // setIsLoggedIn={setIsLoggedIn} 
              // setUserData={setUserData}  
            />
          } 
        />   
        <Route path="//historical-rates" element={<HistoricalRates />} />  
        <Route path="/profile" element={<UserProfile />} /> {/* Baaki routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;


// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Dashboard from './views/pages/admin/Dashboard'
// import AddProperty from './views/pages/admin/AddProperty'
// import Properties from './views/pages/admin/Listings'
// import EditProperty from './views/pages/admin/EditProperty'
// import Listings from './views/pages/admin/ManageProperties'

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/add-property" element={<AddProperty />} />
//         <Route path="/properties" element={<Properties />} />
//         <Route path="/listings" element={<Listings />} />
//         <Route path="/edit-property/:id" element={<EditProperty />} />
//         <Route path="/market-trends" element={<Dashboard />} />
//         <Route path="/user-management" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   )
// }

// export default App
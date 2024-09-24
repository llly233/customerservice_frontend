import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './privateroute';
import NavApp from './test';
import Component from './component';
import Aiconfig from './aiconfig';

const Router = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={ <PrivateRoute>
                                  <NavApp /> 
                                  </PrivateRoute>} />
        <Route path="/Home" element={
                                    <PrivateRoute>
                                    <NavApp />
                                    </PrivateRoute>} />
        <Route path="/Login" element={<Component />} />
        <Route
          path="/Aiconfig"
          element={
            <PrivateRoute>
              <Aiconfig />
            </PrivateRoute>
          }
        />

      </Routes>

    </div>

  )


}
export default Router;
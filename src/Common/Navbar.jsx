import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MyForm } from '../Components/MyForm';
import { MyComponent } from '../Components/MyComponent';

function Navbar() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={MyComponent}></Route>
          <Route path='/employee/:id?' Component={MyForm}></Route>
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default Navbar

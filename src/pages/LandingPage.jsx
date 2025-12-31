import React from 'react'
import Navbar from '../components/landingPage/Navbar'
import Hero  from '../components/landingPage/Hero';
import  Features  from '../components/landingPage/Features';
import  Pricing  from '../components/landingPage/Pricing';
import  Customers  from '../components/landingPage/Customers';
import  About  from '../components/landingPage/About';
import  Contact  from '../components/landingPage/Contact';
import  Footer  from '../components/landingPage/Footer';

const LandingPage = () => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Customers />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}

export default LandingPage

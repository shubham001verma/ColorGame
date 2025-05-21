import React from 'react'





import GamePage from '../../components/GamePage';
import Navbar from '../../components/Navbar';
import BottomTab from '../../components/BottomTab';
import ImgBanner from '../../components/ImgBanner';
import Category from '../../components/Category';
import OriginalGames from '../../components/OriginalGames';


function Home() {
  return (
    <>
   
   
      <div className="w-screen flex justify-center min-h-screen bg-[#9195a3] ">
    <Navbar/>
    <div className="w-full max-w-[500px]  px-4 pt-[70px]  bg-white">
        <ImgBanner />
        <Category/>
        <GamePage />
        <OriginalGames/>
       
      </div>
       <BottomTab/>
    </div>
    </>
  )
}

export default Home
import React from 'react';
import { ChatState } from '../ChatProvideContext';
import {motion} from 'framer-motion'
import { SiLivechat } from 'react-icons/si';

function StarterPage() {
    const {selectedChat}=ChatState
    const container = {
      hidden: { opacity: 0},
      show: {
          opacity: 1,
          transition: {
            duration:1,
              staggerChildren: .4,
              delayChildren: .3,
          },
      },
  }

  const item = {
      hidden: { opacity: 0 },
      show: { opacity: 1 },
  }

 
  return (
  
    <div className={` bg-emerald-100/20 px-4 py-10 md:p-10 h-screen overflow-x-hidden no-scrollbar hidden z-30 md:flex-grow w-full max-w-screen-2xl  md:flex ${selectedChat?"flex":"none"} `}>
    <div className="mx-1 lg:mx-2 p-14 w-full flex justify-center content-center bg-gradient-to-l from-green-400/20 to-lime-400/20 sm:rounded-lg backdrop-blur-lg backdrop-filter bg-clip-padding shadow-lg rounded-3xl">
    <motion.div variants={container} initial='hidden' animate='show'  className=" rounded  w-1/2 h-full my-auto flex flex-col justify-center content-center lg:text-xl   ">
        <h1 className=' flex gap-3'   ><SiLivechat  size={33} className='text-green-600/70 font-sans font-normal '/> HiBye</h1>
            <div className='font-extrabold ' >

                  <motion.h1 variants={item}  >Let's Connect</motion.h1>
                  <motion.h1 variants={item}>with Your Friends</motion.h1>
                  <motion.h1 variants={item}>in Real Time</motion.h1>
            </div>
    </motion.div>
    </div>
  </div>
)
}

export default StarterPage;

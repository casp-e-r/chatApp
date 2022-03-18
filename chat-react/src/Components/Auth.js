import { motion } from 'framer-motion'
import React, { useEffect} from 'react'
import { SiLivechat } from 'react-icons/si'
import { ChatState } from '../ChatProvideContext'
import SignIn from './SignIn'
import Signup from './Signup'

function Auth() {

    const { authState,setAuthState} = ChatState();

    const user = JSON.parse(localStorage.getItem("userInfo"));
    useEffect(() => {
        if (user) {
            return
        }
    }, [user]);
  
    
    return (
        <div className="flex justify-center bg-emerald-100/50 content-center align-middle min-h-1/2 h-screen ">
            <motion.div
            className={`pb-10 rounded-xl w-96 m-auto backdrop-blur-lg ${authState? "bg-green-400/50":'bg-lime-400/50'} bg-green-400/30 backdrop-filter border border-green-400/5 bg-clip-padding shadow-[0px_6px_25px_-0px_rgba(134,239,172,0.5)]  `} initial={{opacity: 0, y: '5rem'}} exit={{opacity: 0, y: '5rem'}} animate={{opacity: 1, y: 0}} layout >
            <div className='py-2.5 m-3  px-5 rounded-xl bg-slate-300/10' >
                <h1 className='flex gap-3 px-2 font-sans bg-white/5'><SiLivechat size={33} className='text-green-600/70'/> HiBye</h1> 
              </div>
           {!authState ?<Signup/> :<SignIn/>} 
            
            
			<p className=" text-center items-center"><span>{authState ? "Don't have an account?" :  'Already have an account?'}{' '}</span><button className='text-emerald-400 font-extrabold' onClick={()=>{setAuthState(!authState)}}>{authState ?'Sign Up Now' :'Sign in Now'}.</button></p>
            
            </motion.div>
        </div>
    )
}

export default Auth

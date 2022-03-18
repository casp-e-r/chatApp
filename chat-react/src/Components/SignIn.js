import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

import { MdVisibility, MdVisibilityOff } from 'react-icons/md';



function SignIn() {
    
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
    const [visToggle, setVisToggle] = useState(false)

    const handleSubmit = async ()=>{
        console.log(email,password);
        if (!email || !password) {
            setError('fill all the fields');
            return
        }
        try{
            const config = {
                headers: {
                  "Content-type": "application/json",
                },
              };
              const {data}=await axios.post('/user/login',{email,password},config)
              localStorage.setItem("userInfo", JSON.stringify(data));
              window.location.reload();
           
        }
        catch(err){
            console.log(err.response.status);
            err.response.status===401 && setError('invalid email or password');
        }
         
     }
     const guestHandle=()=>{
        setEmail('guest@test.com')
        setPassword('guest')
     }
    return (
        <div className=" m-5 grid gap-8 pt-7 pb-5">
			<h3 className='my-1 font-black text-lg text-green-900'>Sign In</h3>
			{error && <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6}}  className="text-red-600 ">{error}</motion.p>}

            <div className="grid">
                <label>Email</label>
                <input type="text" className="outline-none rounded-2xl py-0.5 px-2 bg-green-400/30" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            
            <div className='grid relative'>
                <label>password</label>
                <input type={visToggle ? 'text' : 'password'} className="outline-none relative rounded-2xl py-0.5 px-2 bg-green-400/30" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <div className="absolute right-5 mt-7 cursor-pointer " onClick={()=>setVisToggle(!visToggle)}>
                    {visToggle ? <MdVisibilityOff size={20} className=" "/> :<MdVisibility size={20} className=" "/>}
                </div>
            </div>    
            <button className=' bg-green-500 hover:bg-green-500/70 rounded-3xl py-3 px-5  '
                onClick={handleSubmit}>SignIn</button> 
                <p 
            onClick={guestHandle}
            className=' mx-auto w-1/2 cursor-pointer  hover:bg-red-600/90 bg-red-600 text-white px-4 py-2 rounded-lg text-center '>
                guest Login</p> 
        </div>
    )
}

export default SignIn
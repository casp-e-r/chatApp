import React, { useState } from 'react'
import axios from 'axios'
import { ChatState } from '../ChatProvideContext';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { motion } from 'framer-motion'



function Signup() {
    const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
    const [visToggle, setVisToggle] = useState(false)

    const { authState,setAuthState} = ChatState();



     const handleSubmit = async ()=>{
        console.log(name,email,password);
        if (!name || !email || !password) {
            setError('fill all the fields');

            return
        }
        try{
            const config = {
                headers: {
                  "Content-type": "application/json",
                },
              };
            
            const {data}=await axios.post('/user',{name,email,password},config)
            setAuthState(!authState)
            return console.log(data)
        }
        catch(err){
            console.log(err.response.status);
            err.response.status===400 && setError('user already exist');
        }
         
     }
     
     
    return (
        <div className='m-5 grid gap-9 pt-8 pb-6'>
			<h3 className='my-1 font-black text-lg text-green-900'>Sign Up</h3>
			{error && <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6}} className="text-red-600">{error}</motion.p>}


            <div className='grid'>
            <label>Name</label>
            <input type="text" className="outline-none rounded-2xl py-0.5 px-2 bg-green-400/30" value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>
            
            <div className='grid'>
            <label>Email</label>
            <input type="email" className="outline-none rounded-2xl py-0.5 px-2 bg-green-400/30" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>

            <div className='grid relative'>
            <label>password</label>
            <input type={visToggle ? 'text' : 'password'} className='outline-none relative rounded-2xl py-0.5 px-2 bg-green-400/30' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <div className="absolute right-5 mt-7 cursor-pointer " onClick={()=>setVisToggle(!visToggle)}>
                    {visToggle ? <MdVisibilityOff size={20} className=" "/> :<MdVisibility size={20} className=" "/>}
                </div>
            </div>
            
            <button className='bg-green-500 hover:bg-green-500/70 rounded-3xl py-3 px-5 '
            onClick={handleSubmit}>SignUp</button>
        </div>
    )
}

export default Signup

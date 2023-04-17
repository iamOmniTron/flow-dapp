import {useState,useEffect} from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin,googleLogout } from '@react-oauth/google';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import axios from "axios";

const CLIENT_ID = "894759053387-ol0n2mne9cu5lsmm095h2nbvh521tfqn.apps.googleusercontent.com";


fcl.config({
  "app.detail.title":"Flow Dapp App",
  "accessNode.api":"http://localhost:8888",
  "discovery.wallet":"http://localhost:8701/fcl/authn"
})

export default function Home(){
  const [user,setUser] = useState({addr:""});
  const [googleResponse,setGoogleResponse] = useState({});
  const [profile,setProfile] = useState({});


  const login = (data)=>{
    setGoogleResponse(data);
  }

  const loginWallet = ()=>{
    fcl.authenticate();
  }
  const logout = ()=>{
    googleLogout();
    fcl.unauthenticate();
    setGoogleResponse({});
  }

  useEffect(()=>{
    fcl.currentUser.subscribe(setUser)
    // const fetchUser = async()=>{
    //     const {data} = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleResponse.credential}`,{
    //       headers:{
    //         Authorization: `Bearer ${googleResponse.access_token}`,
    //         Accept: 'application/json'
    //     }
    //     });
    //     console.log(data)
    //     setProfile(data);
    // }
    // fetchUser();
  },[googleResponse,user.addr])


  return(
    <>
    <GoogleOAuthProvider clientId={`${CLIENT_ID}`}>
      <div className="flex justify-center items-center w-full h-screen bg-green-400">
        {/* {
          Object.keys(googleResponse).length < 1 && 
          <GoogleLogin onSuccess={login} onError={()=>alert("Error occured while signing in")}/>
        }
        {
          (Object.keys(googleResponse).length < 1 && user.addr)?
           <p>
         <span className="text-lg font-semibold">
           {user?.addr}
           <button className="bg-blue-200 shadow-sm h-12 w-30 text-lg text-[#3f3f3f] font-bold p-4 rounded-sm flex items-center hover:bg-blue-300" onClick={logout}>
             Logout
           </button>
         </span>
       </p>:
         <span className="text-lg font-semibold">
         <button className="bg-blue-200 h-12 w-30 text-lg text-[#3f3f3f] font-bold p-4 rounded-sm flex items-center hover:bg-blue-300" onClick={loginWallet}>
           Login
         </button>
       </span>
        } */}

        {
          Object.keys(googleResponse).length < 1 &&
          <GoogleLogin onSuccess={login} onError={()=>alert("Error occured while signing in")}/>
        }
        {
           Object.keys(googleResponse).length > 1 &&
           (
            user.addr ?
            <span className="text-lg font-semibold">
           {user?.addr}
           <button className="bg-blue-200 shadow-lg h-12 w-30 text-lg text-[#3f3f3f] font-bold p-4 rounded-sm flex items-center hover:bg-blue-300" onClick={logout}>
             Logout
           </button>
         </span>:
         <span className="text-lg font-semibold">
         <button className="bg-blue-200 shadow-lg h-12 w-30 text-lg text-black font-bold p-4 rounded-sm flex items-center hover:bg-blue-300" onClick={loginWallet}>
           Connect to your wallet to login
         </button>
       </span>
           )
        }
      </div>
    </GoogleOAuthProvider>
    </>
  )
}
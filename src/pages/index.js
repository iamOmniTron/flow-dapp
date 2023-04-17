import {useState,useEffect} from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin,googleLogout } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import Image from "next/image";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import axios from "axios";

const CLIENT_ID = "894759053387-ol0n2mne9cu5lsmm095h2nbvh521tfqn.apps.googleusercontent.com";


// discovery wallet: http://localhost:8701/fcl/authn

fcl.config({
  "app.detail.title":"Flow Dapp App",
  "accessNode.api":"http://localhost:8888",
  "discovery.wallet":"chrome-extension://hpclkefagolihohboafpheddmmgdffjm/popup.html",
  "discovery.wallet.method":"EXT/RPC"
})


const decodeToken = (token)=> jwt_decode(token);

export default function Home(){
  const [user,setUser] = useState({addr:""});
  const [googleResponse,setGoogleResponse] = useState({});
  const [profile,setProfile] = useState({});



  const login = (data)=>{
    console.log(data);
    setGoogleResponse(data);
    const payload = decodeToken(data.credential);
    setProfile(payload);
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
    fcl.currentUser.subscribe(setUser);
  },[googleResponse,user.addr])


  return(
    <>
    <GoogleOAuthProvider clientId={`${CLIENT_ID}`}>
      <div className="flex justify-center items-center w-full h-screen bg-green-400">
        {
          Object.keys(googleResponse).length < 1 &&
          <GoogleLogin onSuccess={login} onError={()=>alert("Error occured while signing in")}/>
        }
        {
           Object.keys(googleResponse).length > 1 &&
           (
            user.addr ?
            <div className="flex flex-col w-full items-center justify-center">
              <div className="w-full mb-8 font-bold text-white text-3xl text-center">
                Welcome, {profile.email}
              </div>
            <span className="text-lg font-semibold">
           {user?.addr}
           <button className="bg-blue-200 shadow-lg h-12 w-30 text-lg text-[#3f3f3f] font-bold p-4 rounded-sm flex items-center hover:bg-blue-300" onClick={logout}>
             Logout
           </button>
         </span>
            </div>:
        <div className="flex flex-col w-full items-center justify-center">
          <div className="w-full mb-8 font-bold text-white text-3xl text-center">
             Welcome, {profile.email}
          </div>
            <div className="text-lg font-semibold flex gap-3">
            <button className="bg-blue-200 shadow-lg h-12 w-30 text-lg text-black font-bold p-4 rounded-sm flex items-center hover:bg-blue-300" onClick={loginWallet}>
              Connect to your wallet to login
            </button>

            <button className="bg-blue-200 shadow-lg h-12 w-30 text-lg text-black font-bold p-4 rounded-sm flex items-center hover:bg-blue-300"  onClick={logout}>
              Logout
            </button>
          </div>
        </div>
           )
        }
      </div>
    </GoogleOAuthProvider>
    </>
  )
}
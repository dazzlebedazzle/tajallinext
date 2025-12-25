'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './Rewards.css';
import bannerimg from '../../../public/assets/reward bg.jpg';
import whatapp from '../../../public/assets/WhatsApp_icon.webp';
import linkicon from '../../../public/assets/linkicon.png';
import refralbonus from '../../../public/assets/icons8-bonus-96.png'

const Page = () => {
  const baseurl = process.env.NEXT_PUBLIC_API_URL;
  const [userdata, setUserdata] = useState(null);
  const [userRefral,setuserRefral] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // or use context if stored there
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const userinfo = await fetch(`${baseurl}/api/user/getuser`,config);
        const data = await userinfo.json();
        setUserdata(data); 
        const refralinfo = await fetch(`${baseurl}/api/user/getReferredUsers`,config)
        const refdata= await refralinfo.json();
        console.log("Referral Data:", refdata);
        setuserRefral(refdata);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [baseurl]);



  const copylink = () => {
    if (userdata?.referralLink) {
      navigator.clipboard.writeText(userdata.referralLink);
      console.log("Copied text:", userdata.referralLink);
    }
    else(
      console.log(userdata)
    )
  };
  const whataaplink=()=>{
    if(userdata?.referralLink){
      const message = `Check this out: ${userdata.referralLink}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
    console.log(whatsappURL)
    }
  }

  return (
    <>
      <div className="banner-box">
        <Image
          width={500}
          height={500}
          className="rewardbanner"
          src={bannerimg}
          alt="tajalli reward banner"
        />
      </div>
      <div className="container refralbox py-3">
      <div className="row py-5 justify-content-center">
          <div className="col-lg-3">
            <div className="refral-box">
              <Image width={50} height={50} src={refralbonus} alt='refral bonus image' />
              <p>Refral Point: <span>{userRefral.totalPoints}</span></p>
            </div>
          </div>
        </div>
        <div className="row gap-3 justify-content-center">
        <div className=" col-lg-3  whatapplink" onClick={whataaplink}  >
          <Image width={50} height={50} src={whatapp} alt="whatsapp icon" />
          <p>SHARE VIA WHATSAPP</p>
        </div>
        <div className=" col-lg-3 sharelink" onClick={copylink}>
          <Image width={50} height={50} src={linkicon} alt="link icon" />
          <p>Tap To Copy Referral Link</p>
        </div>
        </div>
        {userRefral.count != 0 ? 
        <>
          <h2 className='text-center my-5'>Referral History</h2>
        <table className="table my-5">
        <thead>
           <tr>
            <th scope="col">S.No.</th>
            <th scope="col">Name</th>
            <th scope="col">Date</th>
            <th scope="col">Reward</th>
          </tr>
        </thead>
        <tbody>
          {userRefral.users?.map((data , id)=>(
          <tr key={id}>
            <th scope="row" >{id + 1}</th>
            <td>{data.firstname}</td>
            <td>{new Date(data.createdAt).toLocaleDateString()}</td>
            <td>{data.discount}</td>
          </tr>
          ))}
        </tbody>
      </table>
        </>
        :""}
  
        
      </div>
    </>
  );
};

export default Page;

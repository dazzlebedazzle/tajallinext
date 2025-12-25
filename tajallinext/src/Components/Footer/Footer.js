
import Link from "next/link";
import style from "./Footer.module.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHome } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { MdPhoneCallback } from "react-icons/md";
import Image from "next/image"; // Use Next.js Image component
import logo from "../../../public/assets/logo.webp"; // Update the import path
import { FaLocationDot } from "react-icons/fa6";


const Footer = () => {
 

  return (
    <section className={`${style.footer} pt-5 pb-4 px-4`}>
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div className="col-lg-3">
            <Link href="/" passHref className="mylogo">
              <Image
                src={logo}
                alt="logo"
                className={style.logo}
                width={300}
                height={100}
                priority 
              />
            </Link>
            <p className={style.desc}>
              TAJALLI Dry Fruits offers premium Afghan dried fruits, blending luxury with natural
              goodness. Experience rich traditions and exceptional quality in every bite.
            </p>
            <div className={style.social_icon}>
              <Link
              target="blank"
                href="https://www.facebook.com/profile.php?id=100087492111902"
                aria-label="facebook account"
              >
                <FaFacebookF />
              </Link>
              
              <Link target="blank" href="https://x.com/TajalliProduct" aria-label="twitter account">
                  
                <FaTwitter />
              </Link>
              <Link
              target="blank"
                href="https://www.instagram.com/tajallidryfruits/"
                aria-label="instagram account"
              >
                <FaInstagram />
              </Link>
              <Link target="blank" href="#" aria-label="Linkedin account">
                <FaLinkedinIn />
              </Link>
            </div>
          </div>
          <div className="col-lg-2 col-md-6 mt-lg-0 mt-4">
            <h3 className={style.link_title}>Quick Links</h3>
            <ul className={style.link_list}>
              <li> <Link href="/blogs">Blogs</Link> </li>
              <li> <Link href="/Aboutus">About Us</Link></li>
              <li> <Link href="/contact-us">Contact Us</Link> </li>
              <li> <Link href="/My-Order">My order</Link> </li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6 mt-lg-0 mt-4">
            <h3 className={style.link_title}>Account Info</h3>
            <ul className={style.link_list}>
              <li> <Link href="/Login">My Account</Link> </li>
              <li> <Link href="/privacypolicy">Privacy Policy</Link> </li>
              <li> <Link href="/return&refundpolicy">Return Policy</Link> </li>
              <li> <Link href="/termsandconditions">Terms & Conditions</Link> </li>
            </ul>
          </div>
          <div className="col-lg-4 mt-lg-0 mt-4">
            <h3 className={style.link_title}>Contact Details</h3>
            <div className={style.contact_info}>
            <FaLocationDot />
              <p>
                B 253, third floor, Okhla phase -1, Okhla industrial estate, New Delhi, 110020
              </p>
            </div>
            <div className={style.contact_info}>
              <IoIosMail />
              <a href="mailto:info@tajalli.co.in" style={{ textDecoration: 'none', color: 'inherit' }}>
  <p>info@tajalli.co.in</p>
</a>

            </div>
            <div className={style.contact_info}>
              <MdPhoneCallback />
              <a href="tel:+918826069897" style={{ textDecoration: 'none', color: 'inherit' }}>
    <p>+918826069897</p>
  </a>
            </div>
          </div>
          <div className="col-md-12">
            <hr className="my-3" />
            <p className={style.desc}>
              Copyright © 2025 <b>Tajalli Dryfruits</b>. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
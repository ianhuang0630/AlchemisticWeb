import './App.css';

import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from "antd";
import { ConfigProvider } from 'antd';
import { BsJoystick, BsLayoutWtf, BsLightning } from "react-icons/bs";



function Navbar(props) {
  const tabs = props.item2onClick.map(function (d, idx) {
          return (<a onClick={d[1]}> {d[0]} </a>);
  })
  const space_tabs = tabs.map((e, i) => {
      if (i < (tabs.length - 1))
          return [e, <span className="spacer"> | </span>];
      else
          return [e];
  }).flat();

  return <div className="infotext-dark navbar">
      <img className="web-logo" src="assets/logo.svg" alt="logo" />
      {window.innerWidth > 600? <div className="company-name">
        {props.company_name}
      </div> : null}
      <div className="section-tabs" >
          {space_tabs}
      </div>
      </div>
}

const EmailCollectionModal = ({ isVisible, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = () => {
    if (validateEmail(email)) {
      onSubmit(email);
      setEmail('');
      setIsValidEmail(true);
      onClose();
    } else {
      setIsValidEmail(false);
    }
  };

  if (!isVisible) return null;

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '20px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid ' + (isValidEmail ? '#ddd' : 'red')
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  };
  
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        <h2>Request a Demo</h2>
        <p className='longform'>Please enter your email address and we'll get back to you shortly.</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setIsValidEmail(true);
          }}
          style={inputStyle}
        />
        {!isValidEmail && <p style={{color: 'red', margin: '5px 0'}}>Please enter a valid email address</p>}
        <div style={buttonContainerStyle}>
          <WhiteBlackButton text="Cancel" onClick={onClose} />
          <BlackWhiteButton text="Submit" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};


const WhiteBlackButton = ({ text, onClick, disabled }) => {
  const buttonStyle = {
      backgroundColor: 'white',
      color: 'black',
      border: 'none',
      padding: '10px 20px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      borderRadius: '12px',
  };

  return (
      <button 
          style={buttonStyle} 
          onClick={onClick} 
          disabled={disabled}
          className="button-text"
      >
          {text}
      </button>
  );
};



const BlackWhiteButton = ({ text, onClick, disabled }) => {
  const buttonStyle = {
      backgroundColor: 'black',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      borderRadius: '12px',
  };

  return (
      <button 
          style={buttonStyle} 
          onClick={onClick} 
          disabled={disabled}
          className="button-text"
      >
          {text}
      </button>
  );
};



const Typewriter = ({ texts, fixedText, typingSpeed = 150, deletingSpeed = 100, pauseDuration = 1000 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
      const handleTyping = () => {
          const fullText = texts[currentIndex];

          if (isDeleting) {
              // Delete characters
              setCurrentText((prev) => prev.slice(0, -1));

              if (currentText === '') {
                  setIsDeleting(false);
                  setCurrentIndex((prev) => (prev + 1) % texts.length);
              }
          } else {
              // Type characters
              setCurrentText((prev) => fullText.slice(0, prev.length + 1));

              if (currentText === fullText) {
                  setTimeout(() => setIsDeleting(true), pauseDuration);
              }
          }
      };

      const timeout = setTimeout(
          handleTyping,
          isDeleting ? deletingSpeed : typingSpeed
      );

      return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return <div className="typewriter"> {fixedText} {currentText}</div>;
};


function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const playPromiseRef = useRef(null);
  const hasPlayedRef = useRef(false); // Track if video has played
  
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasPlayedRef.current) {
          // Only play if video hasn't played yet
          playPromiseRef.current = videoRef.current.play();
          hasPlayedRef.current = true; // Mark as played
          if (playPromiseRef.current) {
            playPromiseRef.current.catch(() => {
              // Handle any play() errors silently
            });
          }
        } else if (!entry.isIntersecting) {
          // Just pause without resetting time
          if (playPromiseRef.current) {
            playPromiseRef.current.then(() => {
              videoRef.current.pause();
            }).catch(() => {
              // Handle any errors silently
            });
          } else {
            videoRef.current.pause();
          }
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <video 
      ref={videoRef}
      className="video" 
      src={src} 
      width="100%" 
      muted
      playsInline
    />
  );
}

function App() {
  const company_name = "Alchemistic"
  
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDemoRequest = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleEmailSubmit = (email) => {
    // TODO: Handle email submission logic
    console.log("Email submitted:", email);
  };
  
  return (

    <ConfigProvider
    theme={{
      components: {
        Tabs: {
          "itemHoverColor":"#A4B0F5",
          "itemSelectedColor":"#91A0F3",
          "inkBarColor":"#91A0F3"
        },
      },
    }}
    >

    
    <div className="whole">
        <EmailCollectionModal isVisible={isModalVisible} onClose={handleModalClose} onSubmit={handleEmailSubmit} />

        {/* Banner */}
        <div className='center'>
          <Navbar company_name={company_name} item2onClick={[[<BlackWhiteButton text="Request a demo" onClick={handleDemoRequest} />, null]]}/>
        </div>
         

        <div className="main-content">
          <h1> 
          Unlock the infinite possibilities in your 3D assets.
          </h1>
          <h3> 
            {company_name} turns your 3D projects into a server that automatically edits itself to fulfill your requests.
          </h3>
          <BlackWhiteButton text="Request a demo" onClick={handleDemoRequest} />
        </div>
          
        <div className="caption">
          <h2>
            What if every 3D asset is just one of <span className="grad-text"> infinite </span> variations?
          </h2>
        </div>



        <div className="demo-1">
          <div className="video-container" id="shoe-instance-container">
            <div className="video-container-element">
              <VideoPlayer src="assets/nike_ice_0000-0100.mp4" />
            </div>
            <div className="video-container-element">
              <VideoPlayer src="assets/nike_metal_0000-0100.mp4" />
            </div>
            <div className="video-container-element">
              <VideoPlayer src="assets/nike_sun_0000-0100.mp4" />
            </div>
          </div>
        </div>

{/* 
        <div className="demo-1">
          <div class="video-container" id="shoe-instance-container">
            <div class="video-container-element">
              <video class="video" src="assets/nike_ice_0000-0100.mp4" width="100%" autoPlay muted>
              </video>
            </div>
            <div class="video-container-element">
              <video class="video" src="assets/nike_metal_0000-0100.mp4" width="100%" autoPlay muted>
              </video>
            </div>
            <div class="video-container-element">
              <video class="video" src="assets/nike_sun_0000-0100.mp4" width="100%" autoPlay muted>
              </video>
            </div>
          </div>
        </div> */}

        <div className="caption" > 
          <h2>
            ... and they were <span className="grad-text"> all </span> at your fingertips?
          </h2>
        </div>

        
        <div className="caption" style={{"marginTop": "30px"}}>
          <h3>
          {<Typewriter 
              fixedText={"Need to find the right variation for "}
              texts={["games?", "product visualizations?", "animations?"]}
                              typingSpeed={60} 
                              deletingSpeed={60} 
                              pauseDuration={1200} 
              />}
          </h3>
          <h2>
              {company_name} helps you find your needle in the haystack.
          </h2>
        </div>

        <div className="demo-2">
          <div class="video-container">
            <div class="video-container-element">
              <video class="video" src="assets/car_tunnel.mp4" width="100%" autoPlay loop muted>
              </video> 
            </div>
          </div>
        </div>

        <div className="caption">
          <h2>
            Visualize and explore all that your 3D project can be.
          </h2>

          

          <div className="three-tabs"> 
              <div className="benefits">
                <div className="benefit">
                  <h1> <BsJoystick /> </h1>
                  <h2> Controllable </h2>
                  <p className="longform">
                  Control {company_name} with language and reference images.
                  Open up the edited project and continue manually editing.
                  
                  {/* <b> You don't have to put in 100% effort to make the edit 10% better. </b> */}
                  </p>
                </div>

                <div className="benefit">
                  <h1> <BsLayoutWtf /> </h1>
                  <h2> Varied </h2>
                  <p className="longform">
                  {company_name} generates many possible edits at once, giving you more choices to choose from. Who knows? Maybe you'll find something wonderful. 
                  </p>
                </div>

                <div className="benefit">
                  <h1> <BsLightning /></h1>
                  <h2> Fast </h2>  
                  <p className="longform">
                  {company_name} generates edits in a few minutes. 
                  Use any existing open or closed sourced LLM to balance between speed and performance.
                  </p>
                </div>
              </div>
          </div>
      
            <p className="longform">
            {company_name} works by editing a copy of your 3D project using state-of-the-art multi-modal language models. {company_name} handles the complex low-level graphical editing to get it done.
            Go get some coffee as {company_name} generates many variations of edits, for your consideration when you're back!
            </p>
        </div>
            

        <div className="caption" style={{"marginTop":"50px"}}>
          <h2>
            And while you're sipping your coffee, {company_name} is editing...
          </h2>
        </div>

        <div className="demo-3">
          <Tabs defaultActiveKey="1" centered items={
            [
              {
                key: "4",
                label: <h3> Blendshape Animation </h3>,
                children:  <div>
        <div class="video-container">
            <div class="video-container-element">
              <video class="video" src="assets/face_anim.mp4" width="100%" autoPlay loop muted>
              </video> 
            </div>
          </div>
                </div>
              },
              {
                key: '2',
                label: <h3> Lighting </h3>,
                children: <div>
          
          <div class="video-container">
            <div class="video-container-element" >
              <video class="video" src="assets/lighting_lotion.mp4" width="100%" autoPlay loop muted>
              </video> 
            </div>
          </div>   
                </div> 
              },{
                key: '1',
                label: <h3>Materials</h3>,
                children: <div> 
                  
          <div class="video-container">
            <div class="video-container-element">
              <video class="video" src="assets/katanas_animation.mp4" width="100%" autoPlay loop muted>
              </video> 
            </div>
          </div>


                  
                </div>
              },
              
              {
                key: '3',
                label: <h3> Procedural Geometry </h3>,
                children: <div>

        <div class="video-container">
            <div class="video-container-element">
              <video class="video" src="assets/roses_blooming.mp4" width="100%" autoPlay loop muted>
              </video> 
            </div>
          </div>
                </div>
              },
              
            ]
          } onChange={null} 
           />

        </div>
       
        
        <div class="call-action">
            <h2>
              Ready to get more out of your 3D assets?
            </h2>
            <WhiteBlackButton text="Request a demo" onClick={handleDemoRequest}  />
            {/* <img class="floating-image" src="assets/ba.png" alt="3D Asset" /> */}
        </div>
        
        <div class="tail">
            {company_name} © 2024
        </div>
    </div>
    
    </ConfigProvider>
  );
}

export default App;

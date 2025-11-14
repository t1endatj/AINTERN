import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Loader = ({onComplete}) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setShowButton(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

    const handleStartClick = () => {
      if (onComplete) {
        onComplete(); 
      }
  };

  return (
    <StyledBackground>
      <StyledWrapper className={showButton ? 'button-shown' : ''}>
        <div 
          id="load" 
          className={animationComplete ? 'clickable' : ''}
        >
          <div>A</div>
          <div>I</div>
          <div>N</div>
          <div>T</div>
          <div>E</div>
          <div>R</div>
          <div>N</div>
        </div>
        
        {showButton && (
          <div className="button-container">
            <button className="btn" onClick={handleStartClick}>
              Bắt đầu
            </button>
          </div>
        )}
      </StyledWrapper>
    </StyledBackground>
  );
}


const StyledBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);

  &.button-shown {
    transform: translateY(-60px);
  }

  #load {
    position: relative;
    width: 600px;
    height: 36px;
    overflow: visible;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: default;
  }

  #load.clickable {
    cursor: pointer;
  }

  #load.clickable:hover {
    transform: scale(1.05);
    transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  #load.clickable:active {
    transform: scale(0.98);
    transition: transform 0.5s ease-out;
  }

  #load div {
    position: absolute;
    width: 40px;
    height: 36px;
    opacity: 0;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 32px;
    font-weight: bold;
    animation: moveAndSettle 5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    color: #35C4F0;
    text-align: center;
  }

  /* Button Container */
  .button-container {
    margin-top: 3rem;
    animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .btn {
    font-size: 1.2rem;
    padding: 1rem 2.5rem;
    border: none;
    outline: none;
    border-radius: 0.4rem;
    cursor: pointer;
    text-transform: uppercase;
    background-color: rgb(14, 14, 26);
    color: rgb(234, 234, 234);
    font-weight: 700;
    transition: 0.6s;
    box-shadow: 0px 0px 60px #1f4c65;
    -webkit-box-reflect: below 10px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4));
    animation: buttonPulse 2s ease-in-out infinite;
  }

  @keyframes buttonPulse {
    0%, 100% {
      box-shadow: 0px 0px 60px #1f4c65;
    }
    50% {
      box-shadow: 0px 0px 80px #1f4c65, 0px 0px 100px rgba(31, 215, 232, 0.4);
    }
  }

  .btn:active {
    scale: 0.92;
  }

  .btn:hover {
    background: rgb(2,29,78);
    background: linear-gradient(270deg, rgba(2, 29, 78, 0.681) 0%, rgba(31, 215, 232, 0.873) 60%);
    color: rgb(4, 4, 38);
  }

  #load div:nth-child(1) {
    animation-delay: 0s;
  }

  #load div:nth-child(2) {
    animation-delay: 0.1s;
  }

  #load div:nth-child(3) {
    animation-delay: 0.2s;
  }

  #load div:nth-child(4) {
    animation-delay: 0.3s;
  }

  #load div:nth-child(5) {
    animation-delay: 0.4s;
  }

  #load div:nth-child(6) {
    animation-delay: 0.5s;
  }

  #load div:nth-child(7) {
    animation-delay: 0.6s;
  }

  @keyframes moveAndSettle {
    0% {
      left: -100px;
      opacity: 0;
      transform: translateX(0) rotate(-20deg) scale(0.5);
    }
    
    20% {
      opacity: 1;
      transform: translateX(0) rotate(10deg) scale(1.2);
    }
    
    40% {
      left: 50%;
      transform: translateX(-50%) rotate(-5deg) scale(1);
    }
    

    60% {
      left: 50%;
      transform: translateX(-50%) rotate(0deg) scale(1);
    }
    
    80% {
      left: calc(50% + var(--final-position));
      transform: translateX(-50%) rotate(0deg) scale(1.1);
      opacity: 1;
    }
    
  
    100% {
      left: calc(50% + var(--final-position));
      transform: translateX(-50%) rotate(0deg) scale(1);
      opacity: 1;
    }
  }

  #load div:nth-child(1) { --final-position: -120px; }
  #load div:nth-child(2) { --final-position: -80px; } 
  #load div:nth-child(3) { --final-position: -40px; }  
  #load div:nth-child(4) { --final-position: 0px; }  
  #load div:nth-child(5) { --final-position: 40px; } 
  #load div:nth-child(6) { --final-position: 80px; }   
  #load div:nth-child(7) { --final-position: 120px; }  
`;

export default Loader;
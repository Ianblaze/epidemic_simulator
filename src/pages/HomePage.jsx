import React from 'react';
import './HomePage.css';

export default function HomePage({ isEntering, hovered }) {
  return (
     <div className={`immersive-home ${isEntering ? 'entering' : ''}`} style={{ pointerEvents: 'none' }}>
       <div className={`ih-background ${isEntering ? 'fade-out' : ''}`}></div>
       
       <header className={`ih-header ${isEntering ? 'fade-out' : ''}`}>
         <div className="ih-logo">
           <div className="brand-icon" style={{ boxShadow: '0 0 20px rgba(0, 245, 212, 0.5)' }}>
             <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
               <path d="M8 1L14.9282 5V11L8 15L1.07179 11V5L8 1Z" fill="#00f5d4" fillOpacity="0.95"/>
             </svg>
           </div>
           <span className="brand-text" style={{ letterSpacing: '0.3em', fontWeight: 300, color: '#fff' }}>VECTOR</span>
         </div>
       </header>

       <footer className={`ih-footer ${isEntering ? 'fade-out' : ''}`}>
         <span className={`ih-instruction pulse ${hovered ? 'highlight' : ''}`} style={{ letterSpacing: '0.4em', color: '#00f5d4' }}>
            {hovered ? 'INITIATE UPLINK' : 'AWAITING COMMAND'}
         </span>
       </footer>
     </div>
  );
}

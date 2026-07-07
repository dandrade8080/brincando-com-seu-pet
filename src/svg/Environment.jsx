import React from 'react';
import './Environment.css';

export function GrassBackground() {
  return (
    <div className="grass-bg">
      <div className="sky-gradient" />
      <div className="clouds">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
      </div>
      <div className="grass-layer">
        <div className="grass-blade" style={{ left: '5%', animationDelay: '0s' }} />
        <div className="grass-blade" style={{ left: '12%', animationDelay: '0.3s' }} />
        <div className="grass-blade" style={{ left: '20%', animationDelay: '0.6s' }} />
        <div className="grass-blade" style={{ left: '28%', animationDelay: '0.1s' }} />
        <div className="grass-blade" style={{ left: '35%', animationDelay: '0.5s' }} />
        <div className="grass-blade" style={{ left: '42%', animationDelay: '0.8s' }} />
        <div className="grass-blade" style={{ left: '50%', animationDelay: '0.2s' }} />
        <div className="grass-blade" style={{ left: '58%', animationDelay: '0.7s' }} />
        <div className="grass-blade" style={{ left: '66%', animationDelay: '0.4s' }} />
        <div className="grass-blade" style={{ left: '74%', animationDelay: '0.9s' }} />
        <div className="grass-blade" style={{ left: '82%', animationDelay: '0.1s' }} />
        <div className="grass-blade" style={{ left: '90%', animationDelay: '0.6s' }} />
      </div>
      <div className="flowers">
        <div className="flower flower-1" style={{ left: '8%', bottom: '8%' }}>&#127800;</div>
        <div className="flower flower-2" style={{ left: '25%', bottom: '5%' }}>&#127803;</div>
        <div className="flower flower-3" style={{ left: '55%', bottom: '7%' }}>&#127804;</div>
        <div className="flower flower-1" style={{ left: '78%', bottom: '6%' }}>&#127800;</div>
        <div className="flower flower-2" style={{ left: '92%', bottom: '9%' }}>&#127803;</div>
      </div>
      <div className="ground-gradient" />
    </div>
  );
}

export function HeartParticle({ x, y }) {
  return (
    <div className="heart-particle" style={{ left: x, top: y }}>
      &#10084;
    </div>
  );
}

export function SparkleParticle({ x, y, delay = 0 }) {
  return (
    <div className="sparkle-particle" style={{ left: x, top: y, animationDelay: `${delay}s` }}>
      &#10022;
    </div>
  );
}

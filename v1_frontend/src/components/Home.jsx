import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5
      };
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const draw3DInvoice = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, w, h);
      
      time += 0.005;
      rotationRef.current.x = Math.sin(time) * 0.3 + mouseRef.current.y * 0.5;
      rotationRef.current.y = time * 0.5 + mouseRef.current.x * 0.5;

      const centerX = w / 2;
      const centerY = h / 2;
      const docWidth = 280;
      const docHeight = 360;
      const depth = 40;
      
      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;
      
      const cos = Math.cos, sin = Math.sin;
      
      const project = (x, y, z) => {
        const dist = 600;
        const cosRX = cos(rx), sinRX = sin(rx);
        const cosRY = cos(ry), sinRY = sin(ry);
        
        let y1 = y * cosRX - z * sinRX;
        let z1 = y * sinRX + z * cosRX;
        let x1 = x * cosRY + z1 * sinRY;
        let z2 = -x * sinRY + z1 * cosRY;
        
        const scale = dist / (dist + z2);
        return {
          x: centerX + x1 * scale,
          y: centerY + y1 * scale,
          scale: scale
        };
      };

      const corners = [
        { x: -docWidth/2, y: -docHeight/2, z: -depth/2 },
        { x: docWidth/2, y: -docHeight/2, z: -depth/2 },
        { x: docWidth/2, y: docHeight/2, z: -depth/2 },
        { x: -docWidth/2, y: docHeight/2, z: -depth/2 },
        { x: -docWidth/2, y: -docHeight/2, z: depth/2 },
        { x: docWidth/2, y: -docHeight/2, z: depth/2 },
        { x: docWidth/2, y: docHeight/2, z: depth/2 },
        { x: -docWidth/2, y: docHeight/2, z: depth/2 }
      ];

      const projected = corners.map(c => project(c.x, c.y, c.z));

      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      ctx.beginPath();
      ctx.moveTo(projected[4].x, projected[4].y);
      ctx.lineTo(projected[5].x, projected[5].y);
      ctx.lineTo(projected[6].x, projected[6].y);
      ctx.lineTo(projected[7].x, projected[7].y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 2;
      [[0,4], [1,5], [2,6], [3,7]].forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(projected[a].x, projected[a].y);
        ctx.lineTo(projected[b].x, projected[b].y);
        ctx.stroke();
      });

      const gradient = ctx.createLinearGradient(
        projected[0].x, projected[0].y,
        projected[2].x, projected[2].y
      );
      gradient.addColorStop(0, isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)');
      gradient.addColorStop(1, isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.15)');
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(projected[0].x, projected[0].y);
      ctx.lineTo(projected[1].x, projected[1].y);
      ctx.lineTo(projected[2].x, projected[2].y);
      ctx.lineTo(projected[3].x, projected[3].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const lineY = [-120, -80, -40, 0, 40, 80, 120, 160];
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      
      lineY.forEach((offsetY, i) => {
        const start = project(-docWidth/2 + 30, offsetY, -depth/2);
        const end = project(docWidth/2 - 30, offsetY, -depth/2);
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        
        if (i === Math.floor((time * 2) % lineY.length)) {
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
          ctx.lineWidth = 2;
        }
      });

      const scanY = -docHeight/2 + (time * 100) % (docHeight + 100) - 50;
      const scanStart = project(-docWidth/2, scanY, -depth/2 - 5);
      
      const scanGradient = ctx.createLinearGradient(scanStart.x, scanStart.y - 30, scanStart.x, scanStart.y + 30);
      scanGradient.addColorStop(0, isDark ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)');
      scanGradient.addColorStop(0.5, isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)');
      scanGradient.addColorStop(1, isDark ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = scanGradient;
      ctx.fillRect(scanStart.x - 150, scanStart.y - 30, 300, 60);

      for (let i = 0; i < 8; i++) {
        const angle = time + i * Math.PI / 4;
        const radius = 200;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        const pz = Math.sin(time + i) * 50;
        
        const particle = project(px, py, pz);
        const size = 3 * particle.scale;
        
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${0.3 * particle.scale})` : `rgba(0, 0, 0, ${0.3 * particle.scale})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      const boxes = [
        { x: -80, y: -100, w: 140, h: 30, label: 'VENDOR' },
        { x: -80, y: -40, w: 100, h: 25, label: 'AMOUNT' },
        { x: -80, y: 20, w: 120, h: 25, label: 'DATE' }
      ];

      boxes.forEach((box, i) => {
        const opacity = Math.sin(time * 3 + i) * 0.3 + 0.5;
        const tl = project(box.x, box.y, -depth/2 - 10);
        const br = project(box.x + box.w, box.y + box.h, -depth/2 - 10);
        
        ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        
        ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${opacity * 0.6})` : `rgba(0, 0, 0, ${opacity * 0.6})`;
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(box.label, tl.x + 5, tl.y - 5);
      });

      animationFrameId = requestAnimationFrame(draw3DInvoice);
    };

    draw3DInvoice();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-gradient-to-br from-white to-gray-800 rounded-xl flex items-center justify-center shadow-lg cursor-pointer">
                <span className={`font-bold text-xl ${isDark ? 'text-black' : 'text-white'}`}>S</span>
              </div>
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                SpendDock
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2.5 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/10 hover:bg-white/20 cursor-pointer' : 'bg-black/10 hover:bg-black/20 cursor-pointer'} transition border border-white/20`}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <a href="#features" className={`${isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'} transition`}>
                Features
              </a>
              <a href="#pricing" className={`${isDark ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black'} transition`}>
                Pricing
              </a>
              <button
              onClick={() => navigate('/auth')}
              className={`px-6 py-2.5 rounded-xl ${isDark ? 'text-white/80 hover:text-white cursor-pointer' : 'text-black/80 hover:text-black cursor-pointer'} transition`}>
                Sign In
              </button>
              <button 
              onClick={() => navigate('/auth')}
              className={`px-6 py-2.5 rounded-xl ${isDark ? 'bg-white text-black hover:shadow-2xl hover:shadow-white/20 cursor-pointer' : 'bg-black text-white hover:shadow-2xl hover:shadow-black/20 cursor-pointer'} font-medium transition`}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative pt-22 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-20 w-96 h-96 ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-20 right-20 w-96 h-96 ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-full blur-3xl animate-pulse`}></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-xl ${isDark ? 'bg-white/10' : 'bg-black/10'} border ${isDark ? 'border-white/20' : 'border-black/20'} mb-8`}>
                <span className={`w-2 h-2 ${isDark ? 'bg-white' : 'bg-black'} rounded-full animate-pulse`}></span>
                <span className={`text-sm ${isDark ? 'text-white/80' : 'text-black/80'}`}>AI-Powered Invoice Automation</span>
              </div>
              
              <h1 className={`text-7xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-6 leading-tight`}>
                Automate Your
                <br />
                <span className={`bg-gradient-to-r ${isDark ? 'from-white via-gray-300 to-white' : 'from-black via-gray-700 to-black'} bg-clip-text text-transparent`}>
                  Invoice Processing
                </span>
              </h1>
              
              <p className={`text-xl ${isDark ? 'text-white/60' : 'text-black/60'} mb-12 leading-relaxed`}>
                Transform your accounts payable with AI-powered document understanding. 
                Extract, validate, and process invoices with 98% accuracy.
              </p>
              
              <div className="flex space-x-4">
                <button className={`px-8 py-4 rounded-xl ${isDark ? 'bg-white text-black hover:shadow-2xl hover:shadow-white/30 cursor-pointer' : 'bg-black text-white hover:shadow-2xl hover:shadow-black/30 cursor-pointer'} font-medium text-lg transition transform hover:scale-105`}>
                  Start Free Trial
                </button>
                <button className={`px-8 py-4 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer' : 'bg-black/10 hover:bg-black/20 text-black border-black/20 cursor-pointer'} border font-medium text-lg transition`}>
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative">
              <canvas 
                ref={canvasRef}
                className={`w-full h-[600px] rounded-3xl backdrop-blur-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} border ${isDark ? 'border-white/10' : 'border-black/10'} shadow-2xl cursor-move`}
              />
              
              <div className={`absolute top-8 right-8 px-4 py-2 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20'} border`}>
                <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'} flex items-center space-x-2`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>AI Analyzing</span>
                </div>
              </div>

              <div className={`absolute bottom-8 left-8 px-4 py-2 rounded-xl backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20'} border`}>
                <div className={`text-xs ${isDark ? 'text-white/60' : 'text-black/60'} mb-1`}>Detection Accuracy</div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>98.5%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-16">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Process invoices in seconds with our OCR-free AI model' },
              { icon: '🎯', title: '98% Accurate', desc: 'AI-powered extraction with confidence scoring' },
              { icon: '🔒', title: 'Secure & Compliant', desc: 'Enterprise-grade security with full audit trails' }
            ].map((feature, i) => (
              <div key={i} className={`backdrop-blur-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-2xl p-8 border ${isDark ? 'border-white/10' : 'border-black/10'} hover:${isDark ? 'bg-white/10' : 'bg-black/10'} transition transform hover:-translate-y-2`}>
                <div className={`w-14 h-14 ${isDark ? 'bg-white/10' : 'bg-black/10'} rounded-xl flex items-center justify-center mb-6`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-3`}>{feature.title}</h3>
                <p className={`${isDark ? 'text-white/60' : 'text-black/60'} leading-relaxed`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-4`}>
              Everything You Need
            </h2>
            <p className={`text-xl ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Complete B2B invoice automation platform
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {[
              { icon: '📄', title: 'Smart Document Processing', desc: 'Automatically extract vendor names, amounts, dates, and line items from any invoice format', tags: ['PDF', 'Images', 'Scans'] },
              { icon: '🤖', title: 'AI Assistant', desc: 'Ask questions about your invoices in natural language and get instant insights', tags: ['Natural Language', 'Real-time'] },
              { icon: '✓', title: 'Approval Workflows', desc: 'Streamline approvals with confidence scoring and automated routing', tags: ['Smart Routing', 'Notifications'] },
              { icon: '📊', title: 'Real-time Analytics', desc: 'Track spending, monitor trends, and get actionable insights', tags: ['Dashboards', 'Reports'] }
            ].map((feature, i) => (
              <div key={i} className={`backdrop-blur-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-3xl p-10 border ${isDark ? 'border-white/10' : 'border-black/10'}`}>
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 ${isDark ? 'bg-white/10' : 'bg-black/10'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-4xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-3`}>{feature.title}</h3>
                    <p className={`${isDark ? 'text-white/60' : 'text-black/60'} leading-relaxed mb-4`}>{feature.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {feature.tags.map((tag, j) => (
                        <span key={j} className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-white/10 text-white/80' : 'bg-black/10 text-black/80'}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`backdrop-blur-xl ${isDark ? 'bg-white/5' : 'bg-black/5'} rounded-3xl p-16 border ${isDark ? 'border-white/10' : 'border-black/10'} text-center`}>
            <h2 className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-6`}>
              Ready to Get Started?
            </h2>
            <p className={`text-xl ${isDark ? 'text-white/60' : 'text-black/60'} mb-10`}>
              Join hundreds of companies automating their invoice processing
            </p>
            <button className={`px-10 py-5 rounded-xl ${isDark ? 'bg-white text-black hover:shadow-2xl hover:shadow-white/30 cursor-pointer' : 'bg-black text-white hover:shadow-2xl hover:shadow-black/30 cursor-pointer'} font-medium text-lg transition transform hover:scale-105`}>
              Start Free Trial →
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER SECTION*/}
      <footer className={`border-t ${isDark ? 'border-white/10' : 'border-black/10'} py-12 px-6`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className={`${isDark ? 'text-white/40' : 'text-black/40'}`}>
            © 2024 SpendDock. AI-Orchestrated Platform for End-to-End Accounts Payable Automation.
          </p>
        </div>
      </footer>
    </div>
  );
}


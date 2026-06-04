import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, useGLTF, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 1. English Projects Database
const projectsData = {
  backend: {
    title: "Smart E-Wallet System",
    subtitle: "Backend Development",
    color: "#2dd4bf", 
    tags: ["C#", ".NET Core", "OOP Principles", "SQL Constraints", "Entity Framework"],
    features: [
      "Designed the entire system architecture using OOP principles to build a highly flexible and scalable codebase.",
      "Developed secure backend logic for account management and financial transactions to ensure flawless operations.",
      "Optimized relational database schemas, applying solid constraints and efficient data access via Entity Framework Scaffolding."
    ],
    linkText: "View Project on GitHub 💻",
    url: "https://github.com/walidrab27-dev"
  },
  uiux: {
    title: "Stylora - Clothing App",
    subtitle: "UX Research & Case Study",
    color: "#f43f5e", 
    tags: ["UX Strategy", "Star Bursting", "Competitor Analysis", "User Journey", "Wireframing"],
    features: [
      "Conducted extensive competitor analysis on major global fashion brands including Zara, Shein, and H&M.",
      "Applied Star Bursting methodology to map out comprehensive user requirements and solidify design strategy.",
      "Created precise user journeys and structured wireframes to eliminate pain points in virtual apparel shopping."
    ],
    linkText: "Browse Full Case Study 🎨",
    url: "https://behance.net"
  },
  games: {
    title: "Aim Lab Browser Game",
    subtitle: "JavaScript Interaction",
    color: "#eab308", 
    tags: ["HTML5 Canvas", "CSS3 Animation", "Vanilla JavaScript", "Game Loop Logic"],
    features: [
      "Developed a fully interactive aim training web browser game operating smoothly with minimal latency.",
      "Built a custom Game Loop from scratch to manage dynamic random targets and precise timer mechanics.",
      "Relied completely on pure Vanilla JavaScript without external engines to guarantee maximum performance and speed."
    ],
    linkText: "Try Game / View Source Code 🎮",
    url: "https://github.com"
  }
};

// 2. Advanced Keyboard Control Hook
const useKeyboard = () => {
  const [keys, setKeys] = useState({ 
    forward: false, backward: false, left: false, right: false,
    up: false, down: false, boost: false 
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) setKeys((k) => ({ ...k, forward: true }));
      if (['ArrowDown', 's', 'S'].includes(e.key)) setKeys((k) => ({ ...k, backward: true }));
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) setKeys((k) => ({ ...k, left: true }));
      if (['ArrowRight', 'd', 'D'].includes(e.key)) setKeys((k) => ({ ...k, right: true }));
      if ([' '].includes(e.key)) setKeys((k) => ({ ...k, up: true })); 
      if (['Control', 'c', 'C'].includes(e.key)) setKeys((k) => ({ ...k, down: true })); 
      if (['Shift'].includes(e.key)) setKeys((k) => ({ ...k, boost: true })); 
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) setKeys((k) => ({ ...k, forward: false }));
      if (['ArrowDown', 's', 'S'].includes(e.key)) setKeys((k) => ({ ...k, backward: false }));
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) setKeys((k) => ({ ...k, left: false }));
      if (['ArrowRight', 'd', 'D'].includes(e.key)) setKeys((k) => ({ ...k, right: false }));
      if ([' '].includes(e.key)) setKeys((k) => ({ ...k, up: false }));
      if (['Control', 'c', 'C'].includes(e.key)) setKeys((k) => ({ ...k, down: false }));
      if (['Shift'].includes(e.key)) setKeys((k) => ({ ...k, boost: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};

// 3. Premium Airplane Component with Volumetric 3D Plasma Jet & Full Movement
const PlayerAirplane = ({ activeProject }) => {
  const airplaneRef = useRef();
  
  // ريفرنس لطبقات اللهب الـ 3D
  const innerFlameRef = useRef();
  const middleFlameRef = useRef();
  const outerFlameRef = useRef();
  
  const keys = useKeyboard();
  const [isCrashed, setIsCrashed] = useState(false);

  const { scene } = useGLTF('./airplane.glb');

  useFrame((state) => {
    if (!airplaneRef.current || activeProject) return;

    const plane = airplaneRef.current;
    plane.rotation.order = 'YXZ';

    const baseSpeed = 0.12;
    const currentSpeed = keys.boost ? baseSpeed * 2.5 : baseSpeed;

    // 1. الدوران (Yaw)
    const turnSpeed = 0.035;
    if (keys.left) plane.rotation.y += turnSpeed;
    if (keys.right) plane.rotation.y -= turnSpeed;

    // 2. الحركة للأمام والخلف
    let nextX = plane.position.x;
    let nextY = plane.position.y;
    let nextZ = plane.position.z;

    if (keys.forward) {
      nextX -= Math.sin(plane.rotation.y) * currentSpeed;
      nextZ -= Math.cos(plane.rotation.y) * currentSpeed;
    }
    if (keys.backward) {
      nextX += Math.sin(plane.rotation.y) * currentSpeed;
      nextZ += Math.cos(plane.rotation.y) * currentSpeed;
    }
    
    if (keys.up) nextY += currentSpeed * 0.8;
    if (keys.down) nextY -= currentSpeed * 0.8;

    nextY = Math.max(0.2, nextY);

    // نظام التصادم
    const distanceToIslandCenter = Math.sqrt(nextX * nextX + nextZ * nextZ);
    const islandMaxHeight = 3.0; 

    if (distanceToIslandCenter < 2.6 && nextY < islandMaxHeight) {
      setIsCrashed(true);
      const angle = Math.atan2(plane.position.z, plane.position.x);
      plane.position.x = Math.cos(angle) * 2.9;
      plane.position.z = Math.sin(angle) * 2.9;
      setTimeout(() => setIsCrashed(false), 400); 
    } else {
      plane.position.x = nextX;
      plane.position.y = nextY;
      plane.position.z = nextZ;
    }

    // 3. تأثيرات ميكانيكا الطيران البصرية (Roll & Pitch)
    if (keys.left) {
      plane.rotation.z = Math.min(plane.rotation.z + 0.05, 0.4);
    } else if (keys.right) {
      plane.rotation.z = Math.max(plane.rotation.z - 0.05, -0.4);
    } else {
      plane.rotation.z *= 0.85; 
    }

    if (keys.up) {
      plane.rotation.x = Math.min(plane.rotation.x + 0.03, 0.3); 
    } else if (keys.down) {
      plane.rotation.x = Math.max(plane.rotation.x - 0.03, -0.3); 
    } else if (keys.forward) {
      plane.rotation.x = Math.max(plane.rotation.x - 0.02, -0.15); 
    } else if (keys.backward) {
      plane.rotation.x = Math.min(plane.rotation.x + 0.02, 0.15);
    } else {
      plane.rotation.x *= 0.85; 
    }

    // ==========================================================
    // 🔥 4. أنيميشن البلازما التداخلية (التأثير الاحترافي الجديد)
    // ==========================================================
    if (keys.boost) {
      const t = state.clock.getElapsedTime();
      
      // النواة الداخلية: ارتعاش فائق السرعة في الطول والعرض
      if (innerFlameRef.current) {
        innerFlameRef.current.scale.x = 1.0 + Math.sin(t * 70) * 0.15;
        innerFlameRef.current.scale.y = 1.2 + Math.cos(t * 55) * 0.25;
        innerFlameRef.current.scale.z = 1.0 + Math.sin(t * 70) * 0.15;
      }
      // الجسم الأوسط: حركة متموجة متوسطة السرعة
      if (middleFlameRef.current) {
        middleFlameRef.current.scale.x = 1.0 + Math.cos(t * 45) * 0.2;
        middleFlameRef.current.scale.y = 1.4 + Math.sin(t * 35) * 0.35;
        middleFlameRef.current.scale.z = 1.0 + Math.cos(t * 45) * 0.2;
      }
      // الهالة الخارجية: نبض عريض وبطيء ليعطي إحساس وهج الغاز
      if (outerFlameRef.current) {
        outerFlameRef.current.scale.x = 1.1 + Math.sin(t * 30) * 0.25;
        outerFlameRef.current.scale.y = 1.6 + Math.cos(t * 25) * 0.4;
        outerFlameRef.current.scale.z = 1.1 + Math.sin(t * 30) * 0.25;
      }
    }

    // 5. الكاميرا
    const cameraDistance = 6;
    const cameraHeight = 2.5;

    const cameraOffsetX = Math.sin(plane.rotation.y) * cameraDistance;
    const cameraOffsetZ = Math.cos(plane.rotation.y) * cameraDistance;

    const targetCameraPos = new THREE.Vector3(
      plane.position.x + cameraOffsetX,
      plane.position.y + cameraHeight,
      plane.position.z + cameraOffsetZ
    );
    
    state.camera.position.lerp(targetCameraPos, 0.1);

    const lookAtDistance = 10;
    const lookAtTarget = new THREE.Vector3(
      plane.position.x - Math.sin(plane.rotation.y) * lookAtDistance,
      plane.position.y,
      plane.position.z - Math.cos(plane.rotation.y) * lookAtDistance
    );
    state.camera.lookAt(lookAtTarget);
  });

  return (
    <group ref={airplaneRef} position={[0, 0.6, 4.5]}>
      {/* مجسم الطيارة */}
      <primitive object={scene} scale={0.8} rotation={[0, Math.PI / 2, 0]} />

      {/* 🔥 نظام لهب البلازما الطبقي الـ 3D الاحترافي */}
      {keys.boost && (
        <group position={[0, 0, 0.95]} rotation={[-Math.PI / 2, 0, 0]}>
          
          {/* الطبقة 1: النواة البيضاء الساخنة (Inner Core) */}
          <group ref={innerFlameRef}>
            {/* نقل المحاذاة لأعلى المخروط لكي يتمدد من فوهة المحرك للخارج فقط */}
            <mesh position={[0, 0.3, 0]}>
              <coneGeometry args={[0.04, 0.6, 12, 1, true]} />
              <meshBasicMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.95} 
                blending={THREE.AdditiveBlending} 
              />
            </mesh>
          </group>

          {/* الطبقة 2: جسم اللهب المتوهج (Middle Jet) */}
          <group ref={middleFlameRef}>
            <mesh position={[0, 0.5, 0]}>
              <coneGeometry args={[0.09, 1.0, 16, 1, true]} />
              <meshStandardMaterial 
                color="#facc15" 
                emissive="#eab308" 
                emissiveIntensity={5} 
                transparent 
                opacity={0.8} 
                blending={THREE.AdditiveBlending} 
              />
            </mesh>
          </group>

          {/* الطبقة 3: الهالة الحرارية الخارجية (Outer Aura) */}
          <group ref={outerFlameRef}>
            <mesh position={[0, 0.65, 0]}>
              <coneGeometry args={[0.15, 1.3, 16, 1, true]} />
              <meshStandardMaterial 
                color="#f97316" 
                emissive="#ef4444" 
                emissiveIntensity={3} 
                transparent 
                opacity={0.35} 
                blending={THREE.AdditiveBlending} 
                depthWrite={false} 
              />
            </mesh>
          </group>

          {/* ضوء ديناميكي راقص يعكس لهيب النار على أجنحة الطيارة والبيئة المحيطة */}
          <pointLight color="#f97316" intensity={3} distance={4} />
        </group>
      )}

      <pointLight color={isCrashed ? '#ef4444' : '#38bdf8'} intensity={2} distance={3} />
      {isCrashed && (
        <Html center position={[0, 0.8, 0]}>
          <div style={{
            background: '#ef4444', color: 'white', padding: '5px 12px',
            borderRadius: '8px', fontWeight: 'bold', fontSize: '11px',
            whiteSpace: 'nowrap', boxShadow: '0 0 10px rgba(239,68,68,0.5)',
            fontFamily: 'sans-serif'
          }}>
            💥 Collision!
          </div>
        </Html>
      )}
    </group>
  );
};
// 4. Island Component with Floating Animation
const IslandModel = ({ setActiveProject, activeProject }) => {
  const { scene } = useGLTF('./island.glb'); 
  const islandRef = useRef();

  useFrame((state) => {
    if (!islandRef.current) return;
    const elapsedTime = state.clock.getElapsedTime();
    islandRef.current.position.y = Math.sin(elapsedTime * 1.0) * 0.15;
  });
  
  return (
    <group ref={islandRef}>
      <primitive object={scene} scale={0.2} position={[0, -2, 0]} />

      {!activeProject && (
        <>
          <Html position={[-2.3, 0.5, 0.5]} center>
            <div style={labelStyle('#2dd4bf', 'rgba(15, 23, 42, 0.9)')} onClick={() => setActiveProject('backend')}>
              Back-End Development 🚀
            </div>
          </Html>
          <Html position={[1.2, 0.3, 1.2]} center>
            <div style={labelStyle('#f43f5e', 'rgba(15, 23, 42, 0.9)')} onClick={() => setActiveProject('uiux')}>
              UX / UI Design 🎨
            </div>
          </Html>
          <Html position={[-0.5, 2.5, -2.5]} center>
            <div style={labelStyle('#eab308', 'rgba(15, 23, 42, 0.9)')} onClick={() => setActiveProject('games')}>
              JavaScript & Games 🎮
            </div>
          </Html>
        </>
      )}
    </group>
  );
};

// 5. Main App Component
function App() {
  const [activeProject, setActiveProject] = useState(null);
  const currentProject = projectsData[activeProject];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
      
      {/* UI Header & Branding */}
      <div style={{
        position: 'absolute', top: '30px', left: '30px', zIndex: 10, 
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          padding: '20px 26px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          marginBottom: '15px'
        }}>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Walid Rabei
          </h1>
          <p style={{ margin: '4px 0 12px 0', fontSize: '12px', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Backend Developer & UX Researcher
          </p>
          
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.08)',
            padding: '6px 14px', borderRadius: '12px', fontSize: '11px', color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.18)', fontWeight: '700', letterSpacing: '0.2px'
          }}>
            <span>Civil Engineer 🏗️</span>
            <span style={{ color: '#64748b', fontWeight: 'normal' }}>➔</span>
            <span>Software Dev 💻</span>
          </div>
        </div>

        {/* Flight Instructions */}
        {!activeProject && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)', backdropFilter: 'blur(8px)',
            padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex', flexDirection: 'column', gap: '6px', animation: 'pulse 2s infinite',
            color: '#fff', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px'
          }}>
            <div style={{ fontSize: '13px', color: '#38bdf8', marginBottom: '4px' }}>✈️ FLIGHT CONTROLS:</div>
            <div><span style={keyStyle}>W A S D</span> : Fly & Steer</div>
            <div><span style={keyStyle}>SPACE</span> : Fly Up</div>
            <div><span style={keyStyle}>C</span> : Fly Down</div>
            <div><span style={keyStyle}>SHIFT</span> : Speed Boost 🔥</div>
          </div>
        )}
      </div>

      {/* 3D Canvas wrapped with Suspense */}
      <Canvas camera={{ position: [0, 2.6, 10.5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Sky sunPosition={[100, 20, 100]} />
        
        <Suspense fallback={null}>
          <IslandModel setActiveProject={setActiveProject} activeProject={activeProject} />
          <PlayerAirplane activeProject={activeProject} />
        </Suspense>
      </Canvas>

      {/* Modal Popup */}
      {currentProject && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999,
        }}
        onClick={() => setActiveProject(null)}
        >
          <div style={{
            background: 'rgba(30, 41, 59, 0.75)', color: 'white', width: '90%', maxWidth: '550px',
            borderRadius: '24px', padding: '30px', border: `2px solid ${currentProject.color}`,
            boxShadow: `0 0 30px ${currentProject.color}40`, direction: 'ltr',
            fontFamily: 'sans-serif', position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveProject(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }}
            >✕</button>

            <div style={{ marginBottom: '20px', paddingRight: '25px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: currentProject.color, textTransform: 'uppercase', letterSpacing: '1px' }}>{currentProject.subtitle}</span>
              <h2 style={{ fontSize: '26px', margin: '5px 0 15px 0', fontWeight: 'bold' }}>{currentProject.title}</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {currentProject.tags.map((tag, i) => (
                  <span key={i} style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>{tag}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '25px', lineHeight: '1.7', color: '#cbd5e1' }}>
              <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px', fontWeight: 'bold' }}>Key Highlights:</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {currentProject.features.map((feature, i) => (
                  <li key={i} style={{ marginBottom: '10px' }}>{feature}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex' }}>
              <a href={currentProject.url} target="_blank" rel="noreferrer" style={{
                flex: 1, background: currentProject.color, color: '#0f172a', textAlign: 'center', padding: '12px',
                borderRadius: '14px', fontWeight: 'bold', textDecoration: 'none', boxShadow: `0 4px 12px ${currentProject.color}30`, transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'} onMouseOut={(e) => e.target.style.opacity = '1'}
              >{currentProject.linkText}</a>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.02); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
}

// Styles
const labelStyle = (borderColor, bgColor) => ({
  background: bgColor, color: 'white', padding: '10px 20px', borderRadius: '20px',
  fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14px', border: `2px solid ${borderColor}`,
  boxShadow: `0 0 15px ${borderColor}80`, cursor: 'pointer', pointerEvents: 'auto', whiteSpace: 'nowrap', userSelect: 'none',
});

const keyStyle = {
  background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.4)', color: '#38bdf8'
};

export default App;
import { Users, Car, AlertTriangle, Crosshair, Radar } from 'lucide-react';

interface DetectionFeedProps {
  isSimulating: boolean;
}

export default function DetectionFeed({ isSimulating }: DetectionFeedProps) {
  return (
    <div className="flex-1 flex flex-col p-6 bg-[#0a0f1e] text-white">
      <div className="flex items-center gap-3 mb-6">
        <Radar className="w-6 h-6 text-brand-green" />
        <h2 className="text-xl font-sans font-bold tracking-wide">AI VISUAL DETECTION NETWORK</h2>
        <span className="ml-auto flex items-center gap-2 text-xs font-mono bg-white/10 px-3 py-1 rounded">
          MODEL: YOLOv8-TRAFFIC-V2.1
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cam 1 */}
        <div className={`relative bg-black border rounded-xl overflow-hidden aspect-video flex items-center justify-center transition-all duration-500
          ${isSimulating ? 'border-brand-green shadow-[0_0_20px_rgba(0,255,136,0.2)]' : 'border-white/10'}`}>
          {/* Simulated Image Background */}
          <div className="absolute inset-0 bg-gray-900 opacity-50 bg-[url('https://images.unsplash.com/photo-1510443905581-67121650b28e?q=80&w=1080&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity grayscale" />
          
          <div className="absolute top-4 left-4 font-mono text-xs bg-black/60 px-2 py-1 rounded z-10 line-clamp-1">
            CAM-AIIMS-01
          </div>
          
          {isSimulating && (
            <div className="absolute top-4 right-4 bg-brand-green/20 text-brand-green px-3 py-1 rounded border border-brand-green/50 text-xs font-bold font-mono z-10 flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              EMERGENCY DETECTED - 97.3%
            </div>
          )}

          {/* Render Bounding Boxes */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {isSimulating ? (
              // Ambulance Box
              <div className="absolute top-[30%] left-[40%] w-[20%] h-[40%] border-2 border-brand-green bg-brand-green/10 flex flex-col justify-between p-1">
                <div className="bg-brand-green text-black text-[10px] font-bold px-1 self-start font-mono uppercase">
                  AMBULANCE 0.97
                </div>
                <div className="text-brand-green text-[10px] font-mono self-end bg-black/50 px-1">42km/h</div>
              </div>
            ) : (
              // Normal Car Box
              <div className="absolute top-[40%] left-[50%] w-[15%] h-[20%] border border-blue-400 bg-blue-400/10 flex flex-col justify-between p-1">
                <div className="bg-blue-400 text-black text-[8px] font-bold px-1 self-start font-mono">
                  CAR 0.88
                </div>
              </div>
            )}
            
            {/* Bus Box */}
            <div className="absolute top-[20%] left-[20%] w-[25%] h-[35%] border border-blue-400 bg-blue-400/10 flex flex-col justify-between p-1">
              <div className="bg-blue-400 text-black text-[8px] font-bold px-1 self-start font-mono">
                BUS 0.92
              </div>
            </div>
          </div>
          
          {/* Crosshair target overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-10">
            <Crosshair className="w-1/2 h-1/2" />
          </div>
        </div>

        {/* Cam 2 */}
        <div className="relative bg-black border border-white/10 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
          <div className="absolute top-4 left-4 font-mono text-xs bg-black/60 px-2 py-1 rounded z-10">
            CAM-SAFDARJUNG-04
          </div>
          <div className="absolute inset-0 bg-gray-900 opacity-50 bg-[url('https://images.unsplash.com/photo-1510443905581-67121650b28e?q=80&w=1080&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity grayscale contrast-125" />
          
          <div className="absolute inset-0 z-20 pointer-events-none">
             {/* Pedestrian Box */}
             <div className="absolute top-[60%] left-[10%] w-[5%] h-[15%] border border-amber-400 bg-amber-400/10 flex flex-col justify-between p-1">
                <div className="bg-amber-400 text-black text-[8px] font-bold px-1 self-start font-mono">
                  PERSON 0.95
                </div>
             </div>
          </div>
        </div>

        {/* Cam 3 */}
        <div className="relative bg-black border border-white/10 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
          <div className="absolute top-4 left-4 font-mono text-xs bg-black/60 px-2 py-1 rounded z-10">
            CAM-RINGRD-02
          </div>
          <div className="absolute inset-0 bg-gray-900 opacity-50 bg-[url('https://images.unsplash.com/photo-1510443905581-67121650b28e?q=80&w=1080&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity grayscale brightness-50" />
           <div className="absolute inset-0 flex items-center justify-center z-10 text-gray-500 font-mono text-sm">
             NO ABNORMALITIES DETECTED
           </div>
        </div>
      </div>
      
      {/* Bottom Data Strip */}
      <div className="mt-6 grid grid-cols-4 gap-4 h-24">
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col justify-center">
          <div className="text-gray-400 text-xs font-mono mb-1">FPS PROCESSED</div>
          <div className="text-xl font-bold font-mono">60.2</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col justify-center">
          <div className="text-gray-400 text-xs font-mono mb-1"><Car className="w-3 h-3 inline mr-1"/>VEHICLES TRACKED</div>
          <div className="text-xl font-bold font-mono">14,248</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col justify-center">
          <div className="text-gray-400 text-xs font-mono mb-1"><Users className="w-3 h-3 inline mr-1"/>PEDESTRIANS</div>
          <div className="text-xl font-bold font-mono">3,192</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col justify-center">
          <div className="text-gray-400 text-xs font-mono mb-1">LATENCY</div>
          <div className="text-xl font-bold font-mono text-brand-green">12ms</div>
        </div>
      </div>
    </div>
  );
}

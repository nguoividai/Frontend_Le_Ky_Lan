import React from "react";

/**
 * TechBackground: Lớp phủ nền công nghệ hiện đại, tối hơn theo design tham khảo.
 */
const TechBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden bg-gradient-to-br from-[#0a0a23] via-[#181c3a] to-[#1a1a2e] pointer-events-none">
      {/* Overlay tăng độ tối */}
      <div className="absolute inset-0 bg-black opacity-60" />
      {/* Blurred animated circles, giảm opacity */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-cyan-500 opacity-15 rounded-full filter blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-[-120px] right-[-80px] w-[250px] h-[250px] bg-purple-700 opacity-12 rounded-full filter blur-2xl animate-pulse-slower" />
      <div className="absolute top-[30%] left-[60%] w-[180px] h-[180px] bg-pink-700 opacity-10 rounded-full filter blur-2xl animate-pulse" />
      {/* Overlay for subtle grid or lines (optional) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
};

export default TechBackground;

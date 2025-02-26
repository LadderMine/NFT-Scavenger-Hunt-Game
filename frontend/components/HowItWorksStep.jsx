const HowItWorksStep = ({ icon: Icon, title, step, description, delay }) => (
  <div
    className="flex flex-col items-center p-6 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
    style={{
      animation: `fadeInUp 0.6s ease-out ${delay}s both`,
    }}
  >
    <div className="relative mb-4">
      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
      <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20">
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
    <div className="absolute -top-4 -left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
      {step}
    </div>
    <h3 className="text-xl font-bold text-white mb-2 text-center">{title}</h3>
    <p className="text-gray-300 text-center text-sm">{description}</p>
  </div>
);

export default HowItWorksStep;

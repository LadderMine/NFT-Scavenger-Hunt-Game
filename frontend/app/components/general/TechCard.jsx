 const TechCard = ({ title, description }) => {
  return (
    <div className="p-6 bg-white/10 border border-white/20 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default TechCard;  
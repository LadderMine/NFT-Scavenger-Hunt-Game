const TechCard = ({ title, description }) => (
    <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
    </div>
);

export default TechCard;

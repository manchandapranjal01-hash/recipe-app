import { Link } from 'react-router-dom';

export default function RecipeCard({ id, title, time, image, tags }) {
    return (
        <Link to={`/recipe/${id}`} className="block group">
            <div className="bg-surface-container-high rounded-xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-3 left-3 flex gap-2 z-10 flex-wrap">
                    {tags && tags.map((tag, idx) => (
                        <span key={idx} className="bg-surface-container-highest/80 backdrop-blur-md text-tertiary px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
                            {tag}
                        </span>
                    ))}
                </div>
                <img
                    src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'}
                    alt={title}
                    className="w-full h-56 object-cover xl:h-64 object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="p-5">
                    <h3 className="text-xl font-display font-medium text-white mb-2 leading-tight">{title}</h3>
                    <p className="text-sm text-on-surface-variant">{time} Mins</p>
                </div>
            </div>
        </Link>
    );
}

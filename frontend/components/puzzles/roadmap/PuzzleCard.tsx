import Image from 'next/image';
import { format } from 'date-fns';

export default function PuzzleCard({ puzzle }: { puzzle: any }) {
  const { title, description, imageUrl, releaseDate } = puzzle;
  const isUpcoming = new Date(releaseDate) > new Date();

  return (
    <div className="bg-white text-gray-900 rounded-2xl shadow-lg w-[280px] md:w-[320px] p-4 flex flex-col items-center hover:scale-105 transition-transform duration-300">
      <Image
        src={imageUrl}
        alt={title}
        width={280}
        height={160}
        className="rounded-xl object-cover mb-4"
      />
      <h2 className="text-xl font-semibold mb-1 text-center">{title}</h2>
      <p className="text-sm text-center mb-2">{description}</p>
      <div className="text-xs text-gray-600">
        {isUpcoming ? `Coming on ${format(new Date(releaseDate), 'PPP')}` : 'Released'}
      </div>
    </div>
  );
}
import PuzzleCard from './PuzzleCard';

type Puzzle = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  releaseDate: string;
};

type Props = {
  puzzles: Puzzle[];
};

export default function PuzzleTimeline({ puzzles }: Props) {
  return (
    <section className="overflow-x-auto">
      <div className="flex gap-6 snap-x snap-mandatory overflow-x-scroll pb-4 px-2 md:px-0">
        {puzzles.map((puzzle) => (
          <div key={puzzle.id} className="snap-start shrink-0">
            <PuzzleCard puzzle={puzzle} />
          </div>
        ))}
      </div>
    </section>
  );
}

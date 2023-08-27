import Link from 'next/link';

export default function TrickTree() {
    const tricks = [
        "Backside 180",
        "Backside 360",
        "Backside Caballerial",
        "Backside Half Cab",
        "Fakie Ollie",
        "Frontside 180",
        "Frontside 360",
        "Frontside Caballerial",
        "Frontside Half Cab",
        "Kickturn",
        "Nollie",
        "Nollie Backside 180",
        "Nollie Backside 360",
        "Nollie Frontside 180",
        "Nollie Frontside 360",
        "Ollie",
        "Ollie North",
        "Ollie South",
        "Powerslide",
        "Switch Backside 180",
        "Switch Backside 360",
        "Switch Frontside 180",
        "Switch Frontside 360",
        "Switch Ollie",
        "Tic-Tac"
      ];
      
  return (
    <div>
      <h1 className='24px black'>Trick Tree</h1>
      <ul>
        {tricks.map((trick) => (
          <li key={trick}>
            <Link href={`/tricks/${encodeURIComponent(trick)}`}legacyBehavior>
              <a>{trick}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

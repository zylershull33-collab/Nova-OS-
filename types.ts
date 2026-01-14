
export interface Game {
  id: number;
  name: string;
  icon: string;
  link: string;
  background?: string; // Optional custom background for the "Selected" state
}

export interface GameTileProps {
  game: Game;
  isSelected: boolean;
  onHover: (game: Game | null) => void;
}

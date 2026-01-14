
export interface Game {
  id: number;
  name: string;
  icon: string;
  link: string;
  background?: string; // Optional custom background for the "Selected" state
  systemIcon?: string; // Name of the Lucide icon to use instead of an image URL
}

export interface GameTileProps {
  game: Game;
  isSelected: boolean;
  onHover: (game: Game | null) => void;
}

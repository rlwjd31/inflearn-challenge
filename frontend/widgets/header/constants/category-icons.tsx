import {
  LucideIcon,
  Monitor,
  Gamepad2,
  Cpu,
  GraduationCap,
  Brain,
  Palette,
  Shield,
  GanttChartSquare,
  Briefcase,
  Database,
  TrendingUp,
  Layers,
} from "lucide-react";

type IconSlugType =
  | "game-dev-all"
  | "hardware"
  | "academics"
  | "artificial-intelligence"
  | "design"
  | "it"
  | "career"
  | "productivity"
  | "data-science"
  | "it-programming"
  | "business"
  | "default";

export const CATEGORY_ICONS: Record<IconSlugType, LucideIcon> = {
  "game-dev-all": Gamepad2,
  hardware: Cpu,
  academics: GraduationCap,
  "artificial-intelligence": Brain,
  design: Palette,
  it: Shield,
  career: GanttChartSquare,
  productivity: Briefcase,
  "data-science": Database,
  "it-programming": Monitor,
  business: TrendingUp,
  // 기본 아이콘
  default: Layers,
};

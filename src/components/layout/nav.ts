import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Sparkles,
  Bug,
  HelpCircle,
  GraduationCap,
  BarChart3,
  Trophy,
  MessageSquareWarning,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Learning", href: "/subjects", icon: BookOpen },
  { label: "Coding Practice", href: "/practice", icon: Code2 },
  { label: "AI Tutor", href: "/ai-tutor", icon: Sparkles },
  { label: "AI Debugger", href: "/debugger", icon: Bug },
  { label: "Quiz", href: "/quiz", icon: HelpCircle },
  { label: "Exam Preparation", href: "/exam-prep", icon: GraduationCap },
  { label: "Progress & Analytics", href: "/progress", icon: BarChart3 },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "Feedback", href: "/feedback", icon: MessageSquareWarning },
];

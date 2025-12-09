import { AnimatedBackground } from "@/components/ui/glass";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground variant="default" />
      {children}
    </div>
  );
}

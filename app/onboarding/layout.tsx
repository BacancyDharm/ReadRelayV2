import { OnboardingProvider } from "@/context/OnboardingContext";
import { UserProvider } from "@/context/UserContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <UserProvider>{children}</UserProvider>
    </OnboardingProvider>
  );
}

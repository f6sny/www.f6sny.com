"use client"
import { DirectionProvider as RadixDirectionProvider } from '@radix-ui/react-direction';

export default function DirectionProvider({ children }: { children: React.ReactNode }) {
  return (
    <RadixDirectionProvider dir="rtl">
      {children}
    </RadixDirectionProvider>
  );
}

import { type ReactNode } from "react";
import { AI } from "~/app/_actions/serverActions";
import { UserComponentWrapper } from "~/components/userComponentWrapper";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AI>
      <UserComponentWrapper>{children}</UserComponentWrapper>
    </AI>
  );
}

import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <div className="w-full py-2 text-right">
      <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
        <MenuIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}

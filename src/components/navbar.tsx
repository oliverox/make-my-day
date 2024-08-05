import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <div className="w-full py-2 text-right">
      <Button variant="outline" size="icon">
        <MenuIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}

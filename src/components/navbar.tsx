import { Hurricane } from 'next/font/google';
const titleFont = Hurricane({
  weight: "400",
  subsets: ["latin"]
})
export function Navbar() {
  return (
    <div className="w-full py-2 text-right">
      <span className={`text-2xl ${titleFont.className}`}>MMD</span>
    </div>
  );
}

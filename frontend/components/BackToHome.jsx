import { House } from "lucide-react"
import Link from "next/link"

const BackToHome = () => {
  return (
    <Link href={"/"} className="backdrop-blur-lg hover:bg-white/10 text-xs sm:text-sm text-white flex items-center justify-centerhover: gap-2 p-2 rounded-md transition-all duration-300 ease-in-out bg-transparent">
        <House size={14} />
        <span>Back to Home</span>

      
    </Link>
  )
}

export default BackToHome

import { ModeToggle } from "@/components/ui/toggleBtn";

export default function Navbar() {

    return (
        <div className="bg-background text-foreground p-4 rounded-lg">
            This follows theme colors.
            <ModeToggle />
        </div>

    )
}
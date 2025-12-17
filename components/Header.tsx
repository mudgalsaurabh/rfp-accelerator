import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm">
            <div className="container h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        R
                    </div>
                    <span className="font-bold text-xl tracking-tight text-primary">RFPAccelerator</span>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="#" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
                        History
                    </Link>
                    <Link href="#" className="text-sm font-medium text-gray-500 hover:text-foreground transition-colors">
                        Settings
                    </Link>
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                </nav>
            </div>
        </header>
    );
}

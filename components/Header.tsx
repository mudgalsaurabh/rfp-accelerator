import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
            <div className="container h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
                        R
                    </div>
                    <div className="flex items-center text-2xl font-bold tracking-tight">
                        <span className="text-slate-900">RFP</span>
                        <span className="text-primary italic">Accelerator</span>
                    </div>
                </Link>

                <nav className="flex items-center gap-8">
                    <Link href="#" className="text-[15px] font-semibold text-slate-500 hover:text-primary transition-colors">
                        History
                    </Link>
                    <Link href="#" className="text-[15px] font-semibold text-slate-500 hover:text-primary transition-colors">
                        Settings
                    </Link>
                    <div className="h-10 w-10 rounded-full bg-slate-200 border border-slate-100" />
                </nav>
            </div>
        </header>
    );
}

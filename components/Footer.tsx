export default function Footer() {
    return (
        <footer className="border-t border-slate-100 py-10 mt-auto bg-white">
            <div className="container text-center text-sm text-slate-400 font-medium">
                <p>&copy; {new Date().getFullYear()} RFPAccelerator. All rights reserved.</p>
            </div>
        </footer>
    );
}

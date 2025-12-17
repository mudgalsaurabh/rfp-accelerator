export default function Footer() {
    return (
        <footer className="border-t border-white/10 py-8 mt-auto">
            <div className="container text-center text-sm text-white/40">
                <p>&copy; {new Date().getFullYear()} AI RFP Accelerator. All rights reserved.</p>
            </div>
        </footer>
    );
}

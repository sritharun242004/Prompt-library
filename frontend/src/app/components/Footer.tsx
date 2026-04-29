export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#094067]/15">
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-[#5f6c7b]">
        <div>
          <div className="text-[#094067] mb-3" style={{ fontWeight: 700 }}>PromptVault</div>
          <p style={{ fontSize: "14px", lineHeight: 1.6 }}>Discover, analyze, generate, and improve prompts for any AI tool.</p>
        </div>
        <div>
          <div className="text-[#094067] mb-3" style={{ fontWeight: 700 }}>Product</div>
          <ul className="space-y-1" style={{ fontSize: "14px" }}>
            <li>Library</li>
            <li>Builder</li>
            <li>Improver</li>
            <li>Compare</li>
          </ul>
        </div>
        <div>
          <div className="text-[#094067] mb-3" style={{ fontWeight: 700 }}>Community</div>
          <ul className="space-y-1" style={{ fontSize: "14px" }}>
            <li>Submit a prompt</li>
            <li>Top rated</li>
            <li>Trending</li>
          </ul>
        </div>
        <div>
          <div className="text-[#094067] mb-3" style={{ fontWeight: 700 }}>About</div>
          <ul className="space-y-1" style={{ fontSize: "14px" }}>
            <li>Docs</li>
            <li>Changelog</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#094067]/15 py-4 text-center text-[#5f6c7b]" style={{ fontSize: "13px" }}>
        © 2026 PromptVault · Built with care
      </div>
    </footer>
  );
}

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-[#0F0D0A] border-r border-[#2C271F] p-12 relative overflow-hidden dot-grid">
        {/* Abstract blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#C8A882]/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 right-0 w-56 h-56 rounded-full bg-[#8A9E8C]/5 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-1 relative z-10">
          <span className="text-[18px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>CPD</span>
          <span className="text-[18px] font-mono text-[#C8A882]">{"}"}</span>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-6">
          <h1
            className="text-[44px] leading-tight text-[#F2EDE6]"
            style={{ fontFamily: "var(--font-dm-serif)", letterSpacing: "-0.02em" }}
          >
            Start<br />
            <em className="text-[#C8A882] not-italic">crafting.</em>
          </h1>
          <p className="text-[15px] text-[#6B5E50] leading-relaxed">
            Everything you need to create, automate, and grow — all in one place. Free to start, no card needed.
          </p>
          <ul className="space-y-3">
            {[
              "50 free credits to spend however you like",
              "Full access to image generation with FLUX Pro",
              "Create and test AI agents for 3 days free",
              "Schedule posts to 7 social platforms",
            ].map(f => (
              <li key={f} className="flex items-center gap-3 text-[13px] text-[#A89880]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A9E8C] shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {/* Trial badge */}
          <div className="flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-[#1A1712] border border-[#2C271F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A882] shrink-0" />
            <span className="font-mono text-[11px] text-[#A89880] tracking-wide">3-day free trial</span>
            <span className="font-mono text-[11px] text-[#2C271F]">·</span>
            <span className="font-mono text-[11px] text-[#6B5E50]">No credit card required</span>
          </div>
        </div>

        {/* Social proof */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["#C8A882", "#8A9E8C", "#B5704F"].map(c => (
              <div
                key={c}
                className="w-7 h-7 rounded-full border-2"
                style={{ backgroundColor: c + "40", borderColor: "#0F0D0A" }}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] text-[#6B5E50]">Join 1,247 creators today</span>
        </div>
      </div>

      {/* Right sign-up panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 bg-[#111009]">
        {/* Mobile logo */}
        <div className="flex items-center gap-1 mb-4 lg:hidden">
          <span className="text-[22px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>CPD</span>
          <span className="text-[22px] font-mono text-[#C8A882]">{"}"}</span>
        </div>

        {/* Mobile trial badge */}
        <div className="flex items-center gap-1.5 h-6 px-3 rounded-full bg-[#1A1712] border border-[#2C271F] mb-4 lg:hidden">
          <span className="text-[11px] font-mono text-[#8A9E8C] tracking-wide">50 free credits</span>
          <span className="text-[#2C271F]">·</span>
          <span className="text-[11px] font-mono text-[#6B5E50]">No credit card required</span>
        </div>

        <p className="font-mono text-[11px] text-[#6B5E50] mb-6 tracking-widest">[ start your free trial ]</p>
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#C8A882",
              colorBackground: "#1A1712",
              colorText: "#F2EDE6",
              colorTextSecondary: "#A89880",
              colorInputBackground: "#111009",
              colorInputText: "#F2EDE6",
              borderRadius: "8px",
            },
            elements: {
              card: "border border-[#2C271F] shadow-none",
              headerTitle: "font-serif text-[#F2EDE6]",
              socialButtonsBlockButton: "border-[#2C271F] text-[#A89880] hover:bg-[#221E18]",
              formButtonPrimary: "bg-[#C8A882] text-[#111009] hover:bg-[#BFA070]",
              footerActionLink: "text-[#C8A882]",
            },
          }}
        />
      </div>
    </div>
  );
}

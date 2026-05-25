import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#111009] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-1 mb-8">
        <span className="text-[22px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>CPD</span>
        <span className="text-[22px] font-mono text-[#C8A882]">{"}"}</span>
      </div>
      <p className="text-[13px] text-[#6B5E50] mb-8 font-mono">[ sign in to your workspace ]</p>
      <SignIn
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
  );
}

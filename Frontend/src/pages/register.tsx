import { type FormEvent, useState } from "react";
import graph from "../assets/graph.png";
import Penta from "../assets/Penta.svg";

const MailIcon = () => <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
const PersonIcon = () => <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
const LockIcon = () => <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: formData.get("name"), username: formData.get("username"), email: formData.get("email"), password: formData.get("password") }),
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Unable to create your account");
      setFeedback({ type: "success", message: result.message ?? "Account created successfully" });
    } catch (error) {
      setFeedback({ type: "error", message: error instanceof Error ? error.message : "Unable to create your account" });
    } finally {
      setIsSubmitting(false);
    }
  };
  const field = "flex h-11 items-center gap-2.5 rounded-[7px] border border-[#343944] bg-[#242831] px-3 text-[#808898] transition focus-within:border-[#22c962] focus-within:ring-3 focus-within:ring-[#22c962]/10";
  const input = "min-w-0 w-full border-0 bg-transparent text-xs text-[#f3f4f5] outline-none placeholder:text-[#707887]";

  return <main className="grid min-h-screen grid-cols-1 bg-[#181b22] font-['Poppins',sans-serif] text-[#f7f7f8] md:h-dvh md:grid-cols-[1.08fr_.92fr]">
    <aside className="relative hidden overflow-hidden border-r border-[#30343d] bg-[radial-gradient(circle_at_76%_75%,rgba(31,210,98,.14),transparent_27%),#20232c] px-[clamp(44px,7vw,105px)] py-[42px] md:block">
      <div className="absolute -left-56 -top-92 h-[680px] w-[680px] rounded-full border border-white/5" /><div className="absolute -bottom-72 -right-56 h-[560px] w-[560px] rounded-full border border-white/5" />
      <div className="relative z-10 inline-flex items-center gap-2 text-[22px] font-semibold tracking-[-.8px]"><img src={Penta} alt="Penta" />Penta</div>
      <div className="relative z-10 mt-[clamp(32px,8vh,84px)] max-w-[500px]"><p className="text-[10px] font-medium tracking-[1.6px] text-[#21d367]"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-current" />START YOUR JOURNEY</p><h1 className="mt-4 text-[clamp(32px,3.6vw,54px)] font-semibold leading-[1.18] tracking-[-2.7px]">Your money,<br />all in one place.</h1><p className="mt-4 max-w-[400px] text-sm leading-7 text-[#9da4b2]">Build a clearer picture of your finances and make every decision count.</p></div>
      <img src={graph} alt="Account balance overview" className="relative z-10 mt-[clamp(12px,3vh,30px)] h-auto max-h-[240px] w-auto max-w-full rounded-[10px] shadow-2xl shadow-black/25" />
    </aside>
    <section className="relative flex min-h-dvh items-center justify-center px-6 py-16 md:min-h-0 md:py-8">
      <div className="absolute left-7 top-7 inline-flex items-center gap-2 text-[22px] font-semibold tracking-[-.8px] md:hidden"><img src={Penta} alt="Penta" />Penta</div>
      <div className="w-full max-w-[390px]"><p className="mb-2 text-[10px] font-semibold tracking-[1.6px] text-[#21cf64]">GET STARTED</p><h1 className="text-[30px] font-semibold tracking-[-1.25px]">Create your account</h1><p className="mb-5 mt-2 text-[13px] text-[#949baa]">Start managing your money with confidence.</p>
        <form className="flex flex-col" onSubmit={submit}>
          <div className="grid grid-cols-2 gap-3"><div><label className="mb-1.5 block text-xs font-medium text-[#d4d7dd]" htmlFor="name">Full name</label><div className={field}><PersonIcon /><input className={input} id="name" name="name" placeholder="Your name" autoComplete="name" required /></div></div><div><label className="mb-1.5 block text-xs font-medium text-[#d4d7dd]" htmlFor="username">Username</label><div className={field}><PersonIcon /><input className={input} id="username" name="username" placeholder="username" autoComplete="username" required /></div></div></div>
          <label className="mb-1.5 mt-4 text-xs font-medium text-[#d4d7dd]" htmlFor="email">Email address</label><div className={field}><MailIcon /><input className={input} id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></div>
          <label className="mb-1.5 mt-4 text-xs font-medium text-[#d4d7dd]" htmlFor="password">Password</label><div className={field}><LockIcon /><input className={input} id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create a password" autoComplete="new-password" required /><button className="bg-transparent text-[10px] text-[#939ba9]" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div>
          <label className="my-4 flex cursor-pointer items-start gap-2 text-[11px] leading-4 text-[#999fac]"><input className="mt-0.5 h-3.5 w-3.5 shrink-0 appearance-none rounded-[3px] border border-[#4a515e] bg-[#242831] checked:border-[#1bd363] checked:bg-[#1bd363]" type="checkbox" required />I agree to the <a className="text-[#22d467]" href="#terms">Terms of Service</a> and Privacy Policy.</label>
          <button className="h-[49px] rounded-[7px] bg-[#20d463] text-[13px] font-semibold text-[#15231a] shadow-lg shadow-[#1dd362]/15 transition hover:bg-[#34e273] disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : <>Create account <span className="ml-2 text-[17px]">&rarr;</span></>}</button>
        </form>
        {feedback && <p className={`mt-4 text-center text-xs ${feedback.type === "error" ? "text-red-400" : "text-[#22d467]"}`}>{feedback.message}</p>}
        <p className="mt-5 text-center text-[11px] text-[#9299a7]">Already have an account? <a className="ml-1 text-[#22d467] no-underline" href="#signin">Sign in</a></p>
      </div>
      <p className="absolute bottom-6 hidden text-[10px] text-[#737b89] lg:block"><span className="text-[#23cb64]">Secure</span> &nbsp; Your financial data is encrypted and secure.</p>
    </section>
  </main>;
}

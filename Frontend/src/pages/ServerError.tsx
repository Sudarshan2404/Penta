import { Link } from "react-router-dom";

export default function ServerError() {
  return <main className="grid min-h-screen place-items-center bg-[#181b22] px-6 font-['Poppins',sans-serif] text-white"><section className="max-w-md text-center"><p className="text-sm font-semibold tracking-[.3em] text-[#f2bd22]">WE&apos;LL BE RIGHT BACK</p><h1 className="mt-4 text-4xl font-semibold tracking-tight">Something went wrong.</h1><p className="mt-4 text-sm leading-6 text-[#9da4b2]">We&apos;re having trouble loading your account right now. Please try again in a moment.</p><button onClick={() => window.location.reload()} className="mt-8 rounded-lg bg-[#20d264] px-5 py-3 text-sm font-semibold text-[#101512]">Try again</button><Link to="/signin" className="ml-4 text-sm text-[#20d264]">Back to sign in</Link></section></main>;
}

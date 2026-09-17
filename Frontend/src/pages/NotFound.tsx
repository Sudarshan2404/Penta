import { Link } from "react-router-dom";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#181b22] px-6 font-['Poppins',sans-serif] text-white"><section className="max-w-md text-center"><p className="text-sm font-semibold tracking-[.3em] text-[#20d264]">404 ERROR</p><h1 className="mt-4 text-4xl font-semibold tracking-tight">This page doesn&apos;t exist.</h1><p className="mt-4 text-sm leading-6 text-[#9da4b2]">The page may have moved, or the address may be incorrect.</p><Link to="/" className="mt-8 inline-block rounded-lg bg-[#20d264] px-5 py-3 text-sm font-semibold text-[#101512]">Go to Penta</Link></section></main>;
}

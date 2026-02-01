import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 bg-amber-50 p-6" dir="rtl">
      <h1 className="text-4xl font-bold text-amber-900 sm:text-5xl">
        נגן שירים
      </h1>
      <Link
        href="/player"
        className="flex min-h-[120px] w-full max-w-sm items-center justify-center rounded-3xl bg-green-600 text-3xl font-bold text-white active:bg-green-700"
      >
        השמעת שירים
      </Link>
    </div>
  );
}

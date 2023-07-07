"use client";

export default function Header() {
  console.log("use hedars");
  return (
    <header className="flex justify-between px-3 py-3 shadow-md fixed top-0 left-0 w-full bg-white ">
      <h1 className="logo px-3 pb-2 pt-1 cursor-pointer rounded-lg bg-gray-100 hover:bg-gray-200 text-fuchsia-800 font-extrabold text-xl">
        Hamzee.Ai
      </h1>
      <a
        href="https://github.com/CodeWith-HAMZA/GPT"
        target="_blank"
        className="bg-gray-800 flex items-center justify-center gap-2 text-white rounded-lg px-4 py-2 hover:text-gray-200"
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.3}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
            />
          </svg>
        </span>
        <span>Git Hub</span>
      </a>
    </header>
  );
}

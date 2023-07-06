'use client'


export default function Header() {
    console.log('use hedars')
    return (
        <header className='flex justify-between shadow-sm px-3 py-3 mb-3'>
            <div className="logo text-gray-700 bg-slate-100 px-3 py-2 rounded-full">LOGO</div>
            <button className="bg-gray-800 flex items-center justify-center gap-2 text-white rounded-lg px-4 py-2 hover:text-gray-200">
                <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                </span>
                <span>Git Hub</span>
            </button>
        </header>
    );
}

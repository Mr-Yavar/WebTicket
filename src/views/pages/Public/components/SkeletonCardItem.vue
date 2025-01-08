<template>
    <div id="card" dir="rtl" class="mx-auto h-[22rem] w-full max-w-[15rem] flex items-end justify-center overflow-hidden rounded-xl bg-gray-100 bg-clip-border text-center text-gray-700 relative flex-col shadow-[0px_20px_13px_-13px_rgba(0,0,0,0.1)] animate-pulse">
        <div class="absolute grid h-full overflow-hidden text-gray-700 bg-gray-300 opacity-0 bg-clip-border rounded-xl place-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-full h-full text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path>
            </svg>
        </div>
        <div class="absolute bottom-0 items-end self-center">
            <div class="py-2">
                <div class="block w-56 h-3 mx-auto mb-4 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-gray-400 rounded-full text-inherit">&nbsp;</div>
                <div class="block w-24 h-2 mb-2 font-sans text-base antialiased font-light leading-relaxed bg-gray-400 rounded-full text-inherit">&nbsp;</div>
                <div class="block w-32 h-2 mb-2 font-sans text-base antialiased font-light leading-relaxed bg-gray-400 rounded-full text-inherit">&nbsp;</div>
                <!-- <div class="block w-full h-2 mb-2 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit">&nbsp;</div>
            <div class="block w-full h-2 mb-2 font-sans text-base antialiased font-light leading-relaxed bg-gray-300 rounded-full text-inherit">&nbsp;</div> -->
            </div>
            <div class="self-center w-full px-0 py-2 pt-0">
                <button disabled="" tabindex="-1" class="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-5 px-6 rounded-lg text-white shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none h-8 bg-gray-400 shadow-none hover:shadow-none !w-full" type="button">&nbsp;</button>
            </div>
        </div>
    </div>
</template>
<script></script>

<style scoped>
#card::before,
#card::after {
    content: '';
    width: 22px;
    height: 22px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    bottom: 10.25rem;
    z-index: 1;
}
#card::after {
    left: -10px;
}

#card::before {
    right: -10px;
}
</style>

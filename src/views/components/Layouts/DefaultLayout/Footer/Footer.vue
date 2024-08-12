<script>
export default {
    name: 'Footer'
}
</script>

<template>
    <footer dir="rtl" class="AppContainer mt-0 mb-1 relative w-full bg-gray-50 border shadow-md rounded-xl border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:px-8 lg:py-4">
        <div class="w-full px-8 mx-auto max-w-7xl">
            <div class="grid justify-between grid-cols-1 gap-4 md:grid-cols-2">
                <h5 class="block mb-6 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-inherit">تیکـــتیوم</h5>
                <div class="grid justify-between grid-cols-3 gap-4">
                    <ul class="col-start-3">
                        <p class="block mb-3 font-sans text-sm antialiased font-medium leading-normal text-blue-gray-900 opacity-40">ما</p>
                        <li>
                            <a href="#" class="block py-1.5 font-sans text-base font-normal leading-relaxed text-gray-700 antialiased transition-colors hover:text-blue-gray-900"> درباره ما </a>
                        </li>
                        <li>
                            <a href="#" class="block py-1.5 font-sans text-base font-normal leading-relaxed text-gray-700 antialiased transition-colors hover:text-blue-gray-900"> تماس با ما </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex flex-col items-center justify-center w-full py-4 mt-12 border-t border-blue-gray-50 md:flex-row md:justify-between">
                <p class="block mb-4 font-sans text-sm antialiased font-normal leading-normal text-center text-blue-gray-900 md:mb-0">
                    © 2024
                    <a href="#">تیکتیوم</a>.
                </p>
                <div class="flex gap-4 text-blue-gray-900 sm:justify-center">
               
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped></style>

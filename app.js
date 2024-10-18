$(document).ready(function() {
    const apiBase = 'https://www.themealdb.com/api/json/v1/1';

    // fungsi hamburger menu
    $('#mobile-menu-button').click(function() {
        $('#mobile-menu').toggleClass('hidden');
    });

    // fungsi untuk memanggil semua kategori
    function loadCategories() {
        axios.get(`${apiBase}/categories.php`)
            .then(response => {
                const categories = response.data.categories;
                let html = '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">';
                categories.forEach(category => {
                    html += `
                        <div class="relative overflow-hidden rounded-lg shadow-md cursor-pointer category-item" data-category="${category.strCategory}">
                            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-full h-48 object-cover">
                            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span class="text-white text-xl font-bold">${category.strCategory}</span>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                $('#content').html(html);
            })
            .catch(error => console.error('Error:', error));
    }

    // Fungsi untuk memanggil kategori makanan
    function loadMealsByCategory(category) {
        axios.get(`${apiBase}/filter.php?c=${category}`)
            .then(response => {
                const meals = response.data.meals;
                let html = `<h2 class="text-3xl font-bold mb-6 font-lora">${category} Meals</h2>`;
                html += '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">';
                meals.forEach(meal => {
                    html += `
                        <div class="relative overflow-hidden rounded-lg shadow-md cursor-pointer meal-item" data-id="${meal.idMeal}">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full h-48 object-cover">
                            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span class="text-white text-xl font-bold text-center">${meal.strMeal}</span>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                $('#content').html(html);
            })
            .catch(error => console.error('Error:', error));
    }

    // fungsi untuk memanggil detail makanan
    function loadMealDetails(id) {
        axios.get(`${apiBase}/lookup.php?i=${id}`)
            .then(response => {
                const meal = response.data.meals[0];
                let html = `
                    <div class="bg-white rounded-lg shadow overflow-hidden p-6">
                        <div class="flex justify-between">
                        <h1 class="sm:text-4xl text-2xl font-bold mb-4 font-lora">${meal.strMeal}</h1>
                        <h2 class="sm:text-3xl text-xl hidden sm:flex font-bold mb-4 mr-11 font-lora">Instruction</h2>
                        </div>
                        <div class="sm:grid sm:grid-cols-2 flex flex-col justify-center gap-4">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-[600px] h-[350px] object-cover rounded-lg mb-4">
                        <h2 class="sm:text-3xl text-xl sm:hidden flex font-bold font-lora">Instruction</h2>
                        <p class="text-gray-700 text-base mb-4 p-4 text-justify">${meal.strInstructions}</p>
                        </div>
                        <h2 class="mt-11 sm:text-2xl text-xl font-bold sm:text-center text-start mb-2 font-lora">Ingredients:</h2>
                        <ul class="justify-center items-center md:inline-flex grid grid-cols-2 mb-4 gap-3">
                `;

                for (let i = 1; i <= 20; i++) {
                    if (meal[`strIngredient${i}`]) {
                        html += `<li class="mt-6 sm:text-base text-xs text-center
                        font-roboto-slab">${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
                    }
                }

                html += `
                        </ul>
                        <h2 class="text-center text-2xl font-bold mb-6 font-lora mt-14">Video Tutorial:</h2>
                        <div class="flex items-center justify-center">
                            <iframe src="https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-[1050px] sm:h-[550px] h-[300px] items-center"></iframe>
                        </div>
                    </div>
                `;
                $('#content').html(html);
            })
            .catch(error => console.error('Error:', error));
    }

    // Fungsi handle routing
    function handleRoute(page) {
        $('#mobile-menu').addClass('hidden');  // Hide mobile menu after clicking
        switch(page) {
            case 'home':
                $('#hero').show();
                loadCategories();
                break;
            case 'foods':
                $('#hero').hide();
                loadCategories();
                break;
            case 'ingredients':
                $('#hero').hide();
                $('#content').html('<h2 class="text-3xl font-bold mb-6 font-lora">Ingredients Page</h2><p>This page is under construction.</p>');
                break;
            case 'local-culinary':
                $('#hero').hide();
                $('#content').html('<h2 class="text-3xl font-bold mb-6 font-lora">Local Culinary Page</h2><p>This page is under construction.</p>');
                break;
            default:
                $('#hero').show();
                loadCategories();
        }
    }

    // Event listeners untuk navigasi
    $('nav a').on('click', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        handleRoute(page);
        window.location.hash = page;
    });

    // Event listeners untuk category dan meal items
    $(document).on('click', '.category-item', function() {
        const category = $(this).data('category');
        $('#hero').hide();
        loadMealsByCategory(category);
    });

    $(document).on('click', '.meal-item', function() {
        const id = $(this).data('id');
        $('#hero').hide();
        loadMealDetails(id);
    });

    // Handle initial route
    $(window).on('load', function() {
        const initialPage = window.location.hash.slice(1) || 'home';
        handleRoute(initialPage);
    });

    // Handle route changes
    $(window).on('hashchange', function() {
        const page = window.location.hash.slice(1);
        handleRoute(page);
    });
})
async function loadCars() {
    try {
        const response = await fetch('turbo_az_cars.json');
        const cars = await response.json();
        const container = document.getElementById('cars-container');
        
        container.innerHTML = cars.map(car => {
            const year = car.properties && car.properties.year ? car.properties.year : '';
            const engine = car.properties && car.properties.engine ? car.properties.engine : '';
            const km = car.properties && car.properties.km ? car.properties.km : '';
            const attributesText = car.properties ? `${year}, ${engine}, ${km}` : (car.attributes || '');

            return `
                <div class="bg-white rounded overflow-hidden hover:shadow-md transition-shadow relative flex flex-col h-full cursor-pointer">
                    <a href="${car.link || '#'}" target="_blank" class="absolute inset-0 z-10"></a>
                    <div class="relative h-[180px] w-full">
                        <img src="${car.image_url || ''}" alt="${car.name || 'Car'}" class="w-full h-full object-cover">
                        <div class="absolute top-2 right-2 z-20 cursor-pointer text-white hover:text-red-500">
                            <i class="far fa-heart text-xl drop-shadow-md"></i>
                        </div>
                        ${(car.featured || car.vipped) ? `
                            <div class="absolute bottom-2 right-2 bg-white rounded-[4px] px-1.5 py-[3px] flex items-center gap-1.5 shadow-sm z-10">
                                ${car.featured ? `<i class="fas fa-crown text-[#faa720] text-[12px]"></i>` : ''}
                                ${car.vipped ? `
                                <div class="relative flex items-center justify-center w-[14px] h-[12px]">
                                    <svg class="absolute inset-0 w-full h-full text-[#ff4e00]" viewBox="0 0 14 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 0L11.5 0L14 4.5L7 12L0 4.5L2.5 0Z" />
                                    </svg>
                                    <span class="relative z-10 text-white text-[9px] font-bold leading-none -mt-[1px]">v</span>
                                </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                    <div class="p-3 flex flex-col flex-grow">
                        <div class="text-[17px] font-bold text-[#222] mb-1">${car.price || ''}</div>
                        <div class="text-[14px] text-[#222] truncate">${car.name || ''}</div>
                        <div class="text-[14px] text-[#888] mt-1">${attributesText}</div>
                        <div class="text-[13px] text-[#888] mt-2">${car.datetime || ''}</div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {}
}

function initCustomSelects() {
    const selects = document.querySelectorAll('.custom-select');
    
    function closeAll() {
        document.querySelectorAll('.select-body').forEach(b => b.classList.add('hidden'));
        document.querySelectorAll('.select-icon').forEach(i => i.classList.remove('rotate-180'));
    }

    selects.forEach(select => {
        const header = select.querySelector('.select-header');
        const body = select.querySelector('.select-body');
        const icon = select.querySelector('.select-icon');
        const textSpan = select.querySelector('.select-text');
        const defaultText = textSpan.innerText;
        const options = select.querySelectorAll('.option-item');
        const closeBtn = select.querySelector('.close-dropdown');
        
        if (header) {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                if (select.classList.contains('disabled')) return;
                
                const isHidden = body.classList.contains('hidden');
                closeAll();
                if (isHidden) {
                    body.classList.remove('hidden');
                    icon.classList.add('rotate-180');
                }
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeAll();
            });
        }
        
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.dataset.val !== undefined ? option.dataset.val : option.dataset.value;
                const isColorTarget = select.dataset.target === 'color';
                
                // Multi-select logic for Color dropdown
                if (isColorTarget) {
                    const checkboxes = select.querySelectorAll('input[type="checkbox"]');
                    
                    if (value === "") {
                        // Reset all checkboxes
                        checkboxes.forEach(cb => cb.checked = false);
                        textSpan.innerText = defaultText;
                        textSpan.classList.add('text-[#999]');
                        textSpan.classList.remove('text-[#333]');
                        closeAll();
                        return;
                    } else {
                        // Toggle the clicked checkbox
                        const checkbox = option.querySelector('input[type="checkbox"]');
                        if (checkbox) {
                            checkbox.checked = !checkbox.checked;
                        }
                        
                        // Count selected
                        const selectedBoxes = select.querySelectorAll('input[type="checkbox"]:checked');
                        if (selectedBoxes.length > 0) {
                            textSpan.innerText = `${selectedBoxes.length} rəng seçilib`;
                            textSpan.classList.remove('text-[#999]');
                            textSpan.classList.add('text-[#333]');
                        } else {
                            textSpan.innerText = defaultText;
                            textSpan.classList.add('text-[#999]');
                            textSpan.classList.remove('text-[#333]');
                        }
                        return; // DO NOT close dropdown
                    }
                }
                
                // Standard single-select logic
                if (value === "") {
                    textSpan.innerText = defaultText;
                    textSpan.classList.add('text-[#999]');
                    textSpan.classList.remove('text-[#333]');
                } else {
                    textSpan.innerText = value;
                    textSpan.classList.remove('text-[#999]');
                    textSpan.classList.add('text-[#333]');
                }
                
                closeAll();
                
                if (select.dataset.target === 'marka') {
                    const modelSelect = document.querySelector('.custom-select[data-target="model"]');
                    const modelHeader = modelSelect.querySelector('.select-header');
                    const modelIcon = modelSelect.querySelector('.select-icon');
                    const modelText = modelSelect.querySelector('.select-text');
                    
                    if (value === "") {
                        modelSelect.classList.add('disabled');
                        modelHeader.classList.add('bg-[#f9f9f9]', 'cursor-not-allowed', 'text-[#999]');
                        modelHeader.classList.remove('bg-white', 'cursor-pointer', 'text-[#555]');
                        modelIcon.classList.add('text-gray-300');
                        modelIcon.classList.remove('text-gray-400');
                        modelText.innerText = "Model";
                    } else {
                        modelSelect.classList.remove('disabled');
                        modelHeader.classList.remove('bg-[#f9f9f9]', 'cursor-not-allowed', 'text-[#999]');
                        modelHeader.classList.add('bg-white', 'cursor-pointer', 'text-[#555]');
                        modelIcon.classList.remove('text-gray-300');
                        modelIcon.classList.add('text-gray-400');
                    }
                }
            });
        });
    });
    
    document.addEventListener('click', () => {
        closeAll();
    });
}

function populateYears() {
    const yearMinList = document.getElementById('year_min_list');
    const yearMaxList = document.getElementById('year_max_list');
    
    if (yearMinList && yearMaxList) {
        const currentYear = new Date().getFullYear();
        let optionsHtml = '';
        
        for (let year = currentYear; year >= 1960; year--) {
            optionsHtml += `<div class="option-item px-[10px] py-[6px] text-[14px] text-[#333] hover:bg-[#f2f2f2] cursor-pointer" data-val="${year}">${year}</div>`;
        }
        
        // Append options to the reset button that is already there
        yearMinList.innerHTML += optionsHtml;
        yearMaxList.innerHTML += optionsHtml;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadCars();
    populateYears();
    initCustomSelects();

    // Toggle more filters
    const toggleMoreFiltersBtn = document.getElementById('toggle_more_filters');
    const extraFiltersDiv = document.getElementById('extra-filters');
    const moreFiltersIcon = document.getElementById('more_filters_icon');
    const moreFiltersText = document.getElementById('more_filters_text');

    if (toggleMoreFiltersBtn && extraFiltersDiv && moreFiltersIcon && moreFiltersText) {
        toggleMoreFiltersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            extraFiltersDiv.classList.toggle('hidden');
            if (extraFiltersDiv.classList.contains('hidden')) {
                moreFiltersIcon.classList.remove('fa-chevron-up');
                moreFiltersIcon.classList.add('fa-chevron-down');
                moreFiltersText.innerText = 'Daha çox filtr';
            } else {
                moreFiltersIcon.classList.remove('fa-chevron-down');
                moreFiltersIcon.classList.add('fa-chevron-up');
                moreFiltersText.innerText = 'Gizlət';
            }
        });
    }

    // Global reset button logic
    const resetFiltersBtn = document.getElementById('reset_filters_btn');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Reset standard form inputs (text inputs, radios, standard checkboxes)
            const form = document.getElementById('search-form');
            if (form) form.reset();
            
            // 2. Reset all custom selects by simulating a click on their 'Sıfırla' option
            const resetOptions = document.querySelectorAll('.custom-select .option-item[data-val=""]');
            resetOptions.forEach(opt => opt.click());
            
            // 3. Ensure dropdowns are closed
            if (typeof closeAll === 'function') closeAll();
        });
    }
});

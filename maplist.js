const fs = require('fs');

// Имена входного и выходного файлов
const INPUT_FILE = 'maps.json';
const OUTPUT_FILE = 'maps_en.json';

/**
 * Преобразует массив объектов карт в структуру maps_en.json
 * @param {Array} mapsData - массив объектов с полями mapname, workshopid, ckznubtier, courseid и др.
 * @returns {Object} - объект с категориями, каждая категория содержит массив из одного словаря
 */
function convertMaps(mapsData) {
    const categories = {};

    for (const item of mapsData) {
        // ✅ Условие: только карты с courseid = 1
        if (item.courseid !== 1) continue;

        const tier = item.ckznubtier;
        if (tier === undefined || tier === null) continue; // пропускаем без tier

        const category = tier === 0 ? 'Test' : `Tier ${tier}`;
        const mapname = item.mapname;
        const workshopid = item.workshopid;

        if (!mapname || !workshopid) continue;

        if (!categories[category]) {
            categories[category] = {};
        }
        categories[category][mapname] = workshopid;
    }

    // Сортируем карты внутри каждой категории по алфавиту
    for (const cat of Object.keys(categories)) {
        const sorted = Object.keys(categories[cat])
            .sort((a, b) => a.localeCompare(b))
            .reduce((acc, key) => {
                acc[key] = categories[cat][key];
                return acc;
            }, {});
        categories[cat] = sorted;
    }

    // Формируем финальную структуру: каждая категория -> [ { mapname: workshopid, ... } ]
    const result = {};
    // Сортируем категории: Test, затем Tier 1, Tier 2, ...
    const sortedCategories = Object.keys(categories).sort((a, b) => {
        if (a === 'Test') return -1;
        if (b === 'Test') return 1;
        const numA = parseInt(a.split(' ')[1], 10);
        const numB = parseInt(b.split(' ')[1], 10);
        return numA - numB;
    });

    for (const cat of sortedCategories) {
        result[cat] = [categories[cat]];
    }

    return result;
}

/**
 * Основная функция: читает maps.json, преобразует и записывает maps_en.json
 */
function main() {
    // Проверяем наличие входного файла
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Ошибка: файл ${INPUT_FILE} не найден.`);
        process.exit(1);
    }

    let inputData;
    try {
        const fileContent = fs.readFileSync(INPUT_FILE, 'utf-8');
        inputData = JSON.parse(fileContent);
    } catch (err) {
        console.error(`Ошибка чтения или парсинга ${INPUT_FILE}:`, err.message);
        process.exit(1);
    }

    if (!Array.isArray(inputData)) {
        console.error('Ошибка: входные данные должны быть массивом.');
        process.exit(1);
    }

    const output = convertMaps(inputData);

    // Записываем результат в файл
    try {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
        console.log(`✅ Успешно! Файл ${OUTPUT_FILE} создан.`);
    } catch (err) {
        console.error(`Ошибка записи ${OUTPUT_FILE}:`, err.message);
        process.exit(1);
    }
}

// Запускаем скрипт
main();
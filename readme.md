# CS2KZ Maps

Этот репозиторий содержит изображения карт для режима **KZ (KreedZ)** в игре **Counter-Strike 2**, а также файл `maps.json` с метаданными о каждой карте и её курсах.

---

## 📁 Структура репозитория
cs2kz-maps/
├── maps/ # Папка со всеми изображениями карт
│ ├── kz_xmas2025.jpg # Главный курс (courseid = 1)
│ ├── kz_xmas2025_2.jpg # Бонусный курс (courseid = 2)
│ └── ... # Остальные карты
└── maps.json # JSON-файл с информацией о картах и курсах

text

---

## 🖼️ Доступ к изображениям

Каждое изображение доступно по прямой ссылке (raw) из этого репозитория. Ссылки формируются по следующему правилу:

- **Для главного курса** (`courseid = 1`):  
  `https://raw.githubusercontent.com/YesSeir/cs2kz-maps/main/maps/{mapname}.jpg`

- **Для бонусных курсов** (`courseid > 1`):  
  `https://raw.githubusercontent.com/YesSeir/cs2kz-maps/main/maps/{mapname}_{courseid}.jpg`

### Примеры

- `kz_xmas2025`, главный курс:  
  [https://raw.githubusercontent.com/YesSeir/cs2kz-maps/main/maps/kz_xmas2025.jpg](https://raw.githubusercontent.com/YesSeir/cs2kz-maps/main/maps/kz_xmas2025.jpg)

- `kz_xmas2025`, бонусный курс 3:  
  [https://raw.githubusercontent.com/YesSeir/cs2kz-maps/main/maps/kz_xmas2025_3.jpg](https://raw.githubusercontent.com/YesSeir/cs2kz-maps/main/maps/kz_xmas2025_3.jpg)

---

## 📄 Файл `maps.json`

Файл `maps.json` содержит полную информацию о каждой карте и её курсах. Он доступен по следующим ссылкам:

- **Прямая ссылка (raw)** – для загрузки в приложениях:  
  [https://raw.githubusercontent.com/YesSeir/cs2kz-maps/main/maps.json](https://raw.githubusercontent.com/YesSeir/cs2kz-maps/main/maps.json)

- **Просмотр в интерфейсе GitHub**:  
  [https://github.com/YesSeir/cs2kz-maps/blob/main/maps.json](https://github.com/YesSeir/cs2kz-maps/blob/main/maps.json)

- **Ускоренная ссылка через CDN (jsDelivr)**:  
  [https://cdn.jsdelivr.net/gh/YesSeir/cs2kz-maps@main/maps.json](https://cdn.jsdelivr.net/gh/YesSeir/cs2kz-maps@main/maps.json)

### Структура JSON

Каждый объект в массиве содержит следующие поля:

```json
{
  "mapname": "kz_xmas2025",
  "coursename": "kz_xmas2025",
  "courseid": 1,
  "workshopid": "3627515270",
  "ckznubtier": 3,
  "ckzprotier": 3,
  "vnlnubtier": 4,
  "vnlprotier": 5,
  "image": "https://raw.githubusercontent.com/YesSeir/cs2kz-maps/main/maps/kz_xmas2025.jpg"
}
Поле	Описание
mapname	Название карты (совпадает с именем файла без суффикса)
coursename	Название конкретного курса
courseid	Идентификатор курса (1 – главный, >1 – бонусные)
workshopid	ID карты в Steam Workshop
ckznubtier / ckzprotier	Сложность по версии CKZ (Nub/Pro)
vnlnubtier / vnlprotier	Сложность по версии VNL (Nub/Pro)
image	Прямая ссылка на изображение для этого курса
Поле image автоматически генерируется на основе mapname и courseid – вы можете использовать его для подгрузки картинок в своём приложении.
# Спецификация функционала и логики расчётов

## 1. Назначение

Инструмент моментального полевого расчёта для замерщика заборов. На входе — базовые физические параметры участка и ограждения; на выходе — точная ведомость закупки материалов, зарплата монтажников и финансовый итог (себестоимость, рекомендованная цена, чистая прибыль).

---

## 2. Входные параметры (`MeasurementInput`)

### Геометрия и полотно

| Поле | Описание | Допустимые значения |
|------|----------|---------------------|
| `perimeter` | Длина ограждения общая, метры | Положительное число, точность до 0.1 |
| `height` | Высота полотна забора | `1.5` \| `1.8` \| `2.0` \| `2.2` \| `2.5` м |
| `postStep` | Шаг между столбами | `2.0` \| `2.5` м |
| `sheetingType` | Тип полотна | `sheet_c8` \| `sheet_mp20` \| `picket_single` \| `picket_double` \| `grid_3d` |
| `postType` | Профиль столба | `pipe_60x60x2` \| `pipe_80x80x3` |
| `railType` | Профиль лаг | `pipe_40x20x1_5` \| `pipe_40x20x2` |
| `railRows` | Число рядов лаг | `2` или `3` |
| `foundationType` | Тип фундамента | `ramming_stone` (забутовка) \| `concreting` \| `screw_piles` |
| `holeDepth` | Глубина лунки | `1.2` \| `1.5` м |

### Входные группы

| Поле | Описание | Допустимые значения |
|------|----------|---------------------|
| `gatesType` | Тип ворот | `none` \| `swing_4m` \| `sliding_4m` \| `sliding_5m` |
| `gatesAutomation` | Наличие автоматики | `true` \| `false` |
| `wicketsCount` | Количество калиток | `0` \| `1` \| `2` |
| `wicketLock` | Тип замка | `mechanical` \| `electromechanical` |

### Усложняющие факторы

| Поле | Описание |
|------|----------|
| `demolitionLength` | Длина старого забора под снос, м |
| `hardSoil` | Коэффициент сложного грунта (камни/уклон) — булево значение |
| `noElectricity` | Отсутствие электричества (требуется бензогенератор) — булево значение |

---

## 3. Математическая модель расчётов

### 3.1. Геометрия каркаса

**1. Ширина ворот и калиток**

- Ворота распашные/откатные: **4.0 м** (или **5.0 м** для `sliding_5m`).
- Калитка: **1.0 м**.

**2. Чистая длина ограждения**

```
netLength = perimeter - gatesWidth - (wicketsCount × 1.0)
```

**3. Промежуточные столбы**

```
fencePostsCount = Math.ceil(netLength / postStep) + 1
```

**4. Воротные и калиточные столбы** (усиленные, 80×80 или 100×100)

- Откатные ворота: **2** опорных столба.
- Распашные ворота: **2** столба.
- Калитка: **1** столб (смежная со столбом ворот или забора).

**5. Длина столба забора**

```
postLength = height + holeDepth
```

Пример: `2.0 + 1.2 = 3.2 м` → отпуск хлыстами по 6 м.

```
stockPostsCount = Math.ceil((fencePostsCount × postLength) / 6.0)
```

### 3.2. Продольные лаги

Длина лаг с запасом **5%** на перехлёст:

```
rawRailsMeters = netLength × railRows × 1.05
```

Количество коммерческих хлыстов по 6 метров:

```
stockRailsCount = Math.ceil(rawRailsMeters / 6.0)
```

### 3.3. Материал полотна

**Профнастил** (С8: полезная ширина 1.15 м, МП20: полезная ширина 1.10 м):

```
sheetsCount = Math.ceil(netLength / usefulWidth)
```

**Евроштакетник** (ширина 0.10 м):

- Односторонний (зазор 0.03 м):

```
picketCount = Math.ceil(netLength / 0.13)
```

- Шахматка:

```
picketCount = Math.ceil(netLength / 0.13) × 1.85
```

### 3.4. Сыпучие материалы и расходники

Лунка Ø200 мм. Чистый объём на один столб:

```
V_hole = π × 0.1² × holeDepth
V_post = postWidth × postHeight × holeDepth
V_net = max(0, V_hole − V_post)
```

Сечение столба берётся из `postType`; для воротных/калиточных — 80×80 мм.

**Забутовка щебнем** (`foundationType = ramming_stone`):

```
totalNetVolumeM3 = Σ V_net по всем столбам
totalStoneKg = ceil(totalNetVolumeM3 × 1450 × 1.10)
```

**Бетонирование, бетон М200** (`foundationType = concreting`, пропорция 1 : 3 : 4 по массе):

```
reserveM3     = totalNetVolumeM3 × 1.10
totalCementKg = ceil(reserveM3 × 300)
totalSandKg   = ceil(reserveM3 × 900)
totalGravelKg = ceil(reserveM3 × 1200)
```

Для винтовых свай (`screw_piles`) сыпучка не считается.

**Саморезы кровельные**

```
screwsCount = Math.ceil(sheetsCount × railRows × 4 × 1.10)
```

**Заглушки пластиковые**

```
capsCount = fencePostsCount + gatePostsCount
```

---

## 4. Экономический расчёт (цены и маржа)

### 4.1. Себестоимость материалов (S_мат)

Сумма всех материалов по каталогу закупочных цен + транспортные расходы (доставка с базы).

### 4.2. Оплата монтажникам (S_монт)

```
S_монт = netLength × ratePerMeter
       + gatesInstallRate
       + wicketInstallRate
       + automationRate
       + demolitionCost
```

При `hardSoil = true` к ставке бурения применяется повышающий коэффициент **1.3**.

### 4.3. Рекомендованная цена клиенту (P_клиент)

```
totalCost = materialCost + laborCost + deliveryCost
recommendedPrice = Math.round(totalCost / (1 - targetMargin))
```

По умолчанию `targetMargin = 0.35`.

### 4.4. Порог торга (минимальная цена)

```
minPrice = Math.round(totalCost / (1 - minMargin))
```

По умолчанию `minMargin = 0.25`.

### 4.5. Чистая прибыль

```
profit = recommendedPrice - totalCost
```

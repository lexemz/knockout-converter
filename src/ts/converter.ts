export default class Converter {
    // тип значения
    private valueType: string = null;

    // система величин в которой можно конвертировать значение (speed, distance, ...)
    private convertedSystemType: string = null

    /* массив с доступными переводами в той системе, 
    которая установлена в convertedSystemType (distance -> kilometers, meters, ...) */
    private avalibleConvertRules: string[] = [null];

    constructor(valueType: string = null) {
        this.valueType = valueType.toString().toLowerCase();
        this.detectConvertedValueType();
    }

    // вернуть массив доступных операций
    getAvalibleConvertRules(): string[] {
        return this.avalibleConvertRules;
    }

    getValueType(): string {
        return this.valueType
    }

    // определям, к какой из величин относится наше входное ключевое
    private detectConvertedValueType(): string {
        let sySytem = {
            mass: {
                kilotons: ['kilotons', 'килотонны',], // килотонна
                tons: ['tons', 'тонны',], // тонна
                kilograms: ['kilograms', 'килограммы',], // килограмм
                grams: ['grams', 'граммы',], // грамм
                milligrams: ['milligrams', 'миллиграмы',], // миллиграмм
                micrograms: ['micrograms', 'микрограммы',], // микрограмм
            },
            distance: {
                kilometers: ['kilometers', 'километры',], // километр
                meters: ['meters', 'метры',], // метр
                decimeters: ['decimeters', 'дециметры',], // дециметр
                centimeters: ['centimeters', 'сантиметры',], // сантиметр
                millimeters: ['millimeters', 'миллиметры',], // миллиметр
                micrometers: ['micrometers', 'микрометры',], // микрометр (микрон)
                nanometers: ['nanometers', 'нанометры',], // нанометр
            },
            volume: {
                liters: ['liters', 'литры',], // литр
                milliliters: ['milliliters', 'миллилитры',], // миллилитр
                meters3: ['meters3', 'кубические метры',], // кубический метр
            },
            area: {
                kilometers2: ['kilometers2', 'квадратные километры',], // квадратный километр
                hectares: ['hectares', 'гектары',], // гектар 
                meters2: ['meters2', 'квадратные метры',], // квадратный метр 
            },
            speed: {
                kph: ['kph', 'километры в час',], // километр в час
                mps: ['mps', 'метры в секунду',], // метр в секунду
            },
            temperature: {
                celsius: ['celsius', 'градусы Цельсия',], // градус Цельсия
                fahrenheit: ['fahrenheit', 'градусы Фаренгейта',], // градус Фаренгейта
                kelvin: ['kelvin', 'кельвины',], // кельвин
            },
            time: {
                years: ['years', 'года'], // год
                months: ['months', 'месяцц'],
                weeks: ['weeks', 'недели'], // неделя
                days: ['days', 'дни'], // сутки
                hours: ['hours', 'часы'], // час
                minutes: ['minutes', 'минуты'], // минута	
                seconds: ['seconds', 'секунды'], // секунда
                milliseconds: ['milliseconds', 'миллисекунды'], // миллисекунда
            },
        };

        // перебор типов систем (time, mass, speed, ...)
        for (let typeSystem in sySytem) {

            // перебор доступных величин внутри типа системы (time -> minutes, hours, ...)
            for (let valueTypeSystem in sySytem[typeSystem]) {

                // перебор доступных "имен" для величины внутри типа (hours -> 'hours', 'часы', ...)
                for (let potentialNameTypeSystem of sySytem[typeSystem][valueTypeSystem]) {

                    // если передаваемый тип найден в коллекции sySystem
                    if (potentialNameTypeSystem == this.valueType) {

                        // перезаписываем тип значения: удаляем оттуда строку с JSON, если таковая имеется и записываем туда тип значения на английском
                        this.valueType = valueTypeSystem;

                        // запись системы перевода
                        this.convertedSystemType = typeSystem;

                        // запись доступных переводов в системе
                        this.avalibleConvertRules = Object.keys(sySytem[typeSystem]);

                        return;
                    }
                }
            }
        }
        console.log('Совпадений с доступными типами данных не найдено!');
        return;
    }

    // вызываемый метод для конвертации
    convert(value: number, newValueType: string): number {
        // this.avalibleConvertRules - массив доступных переводов
        // this.valueType - тип, в котором у нас передается значение
        // this.convertedSystemType - переводимая система
        newValueType = newValueType.toLowerCase();
        if (!this.avalibleConvertRules.includes(newValueType)) {
            console.log("Конвертация невозможна!")
            return
        }
        if (newValueType == this.valueType) {
            return value
        }

        let valueType = this.valueType
        this.valueType = newValueType


        // let roundedValue = +value.toFixed()
        let roundedValue = value
        switch (this.convertedSystemType) {
            case 'mass':
                return convertMass(roundedValue, valueType, newValueType)
            case 'distance':
                return convertDistance(roundedValue, valueType, newValueType)
            case 'volume':
                return convertVolume(roundedValue, valueType, newValueType)
            case 'area':
                return convertArea(roundedValue, valueType, newValueType)
            case 'speed':
                return convertSpeed(roundedValue, valueType, newValueType)
            case 'temperature':
                return convertTemperature(roundedValue, valueType, newValueType)
            case 'time':
                return convertTime(roundedValue, valueType, newValueType)
        }

        function convertMass(value: number, valueType: string, newValueType: string): number {
            let degree = {
                micrograms: 9,
                milligrams: 6,
                grams: 3,
                kilograms: 0,
                tons: -3,
                kilotons: -6,
            }
            if (newValueType in degree) {
                return (value * Math.pow(10, (degree[newValueType] - degree[valueType])))
            }
        }

        function convertDistance(value: number, valueType: string, newValueType: string): number {
            let degree = {
                kilometers: -3,
                meters: 0,
                decimeters: 1,
                centimeters: 2,
                millimeters: 3,
                micrometers: 6,
                nanometers: 9
            }
            if (newValueType in degree) {
                return (value * Math.pow(10, (degree[newValueType] - degree[valueType])))
            }
        }

        function convertVolume(value: number, valueType: string, newValueType: string): number {
            let degree = {
                meters3: -3,
                liters: 0,
                milliliters: 3,
            }
            if (newValueType in degree) {
                return (value * Math.pow(10, (degree[newValueType] - degree[valueType])))
            }
        }

        function convertArea(value: number, valueType: string, newValueType: string): number {
            let degree = {
                kilometers2: -2,
                hectares: 0,
                meters2: 4,
            }
            if (newValueType in degree) {
                return (value * Math.pow(10, (degree[newValueType] - degree[valueType])))
            }
        }

        function convertSpeed(value: number, valueType: string, newValueType: string): number {
            switch (newValueType) {
                // mps -> kph
                case 'kph':
                    return (value * 3.6)
                // kph -> mps
                case 'mps':
                    return (value / 3.6)
            }
        }

        function convertTemperature(value: number, valueType: string, newValueType: string): number {
            switch (newValueType) {
                // перевод в Цельсии
                case 'celsius':
                    // С -> F
                    if (valueType == 'fahrenheit') {
                        return ((value - 32) / 1.8)
                        // С -> K
                    } else if (valueType == 'kelvin') {
                        return (value - 273.15)
                    }
                    break;
                // перевод в Фаренгейт
                case 'fahrenheit':
                    // F -> C
                    if (valueType == 'celsius') {
                        return (value * 1.8 + 32)
                        // F -> K
                    } else if (valueType == 'kelvin') {
                        return ((value - 273.15) * 9 / 5 + 32)
                    }
                    break;
                // перевод в Кельвины
                case 'kelvin':
                    // K -> F
                    if (valueType == 'fahrenheit') {
                        return ((value - 32) * 5 / 9 + 273.15)
                        // K -> F
                    } else if (valueType == 'celsius') {
                        return (value + 273.15)
                    }
                    break;
            }
        }

        function convertTime(value: number, valueType: string, newValueType: string): number {
            // приводим значение к минутам
            let valueInMinute;
            switch (valueType) {
                case 'milliseconds':
                    valueInMinute = value / 60000;
                    break;
                case 'seconds':
                    valueInMinute = value / 60;
                    break;
                case 'minutes':
                    valueInMinute = value;
                    break;
                case 'hours':
                    valueInMinute = value * 60;
                    break;
                case 'days':
                    valueInMinute = value * 1440;
                    break;
                case 'weeks':
                    valueInMinute = value * 10080;
                    break;
                case 'months':
                    valueInMinute = value * 43800;
                    break;
                case 'years':
                    valueInMinute = value * 525600;
                    break;
            }
            switch (newValueType) {
                case 'milliseconds':
                    return (valueInMinute * 60000)
                case 'seconds':
                    return (valueInMinute * 60)
                case 'minutes':
                    return (valueInMinute)
                case 'hours':
                    return (valueInMinute / 60)
                case 'days':
                    return (valueInMinute / 1440)
                case 'weeks':
                    return (valueInMinute / 10080)
                case 'months':
                    return (valueInMinute / 43800)
                case 'years':
                    return (valueInMinute / 525600)
            }
        }
        
    }
}
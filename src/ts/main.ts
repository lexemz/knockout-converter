
let testData = {
    storage: "millimeters",
    // display: "meters",
};

const someData = JSON.stringify(testData);
const value = 10.321;

//// start program
import Converter from "./converter";
import * as ko from "knockout";


const valueField: number = value; // сюда получаем значение
const parameters = findJsonParameters(someData, "storage", 'display') // сюда получаем json

const storedValueType: string = parameters[0]
const displayedValueType: string = parameters[1]

console.log(storedValueType, parameters[1])

let storegedConverter = new Converter(storedValueType); /* не константа, потому что при перезаписи значения, 
мы будем переопределять конвертер, так как значение, из которого нужно переводить, будет изменено */
const displayedConverter = new Converter(displayedValueType);

function ViewModel() {
    // массив доступных операций
    this.availableOperationsArray = displayedConverter.getAvalibleConvertRules();
    // значение в поле
    this.valueField = ko.observable(valueField);
    // дропдаун с типами
    this.selectedValueType = ko.observable(displayedValueType);
    // округление в поле
    this.roundField = ko.observable();

    ////////////////////////////////////////////////
    // слежка за свойством enable элементов формы //
    ////////////////////////////////////////////////

    this.valueFieldEnabler = ko.observable(1);
    this.selectEnabler = ko.observable(1);
    this.roundFieldEnabler = ko.observable(1);
    this.roundButtonEnabler = ko.observable(1);
    this.submitButtonEnabler = ko.observable(1);

    /////////////////////////////////////////////////
    // слежка за свойством visible элементов формы //
    /////////////////////////////////////////////////

    this.roundBlockVisible = ko.observable(0);
    this.roundFieldVisible = ko.observable(0);
    this.roundButtonVisible = ko.observable(0);

    /////////////////////////////////////////////////

    // функция проверяет, в одинаковой ли системе хранимое и отображаемое значение, если нет - элементы формы диактивируются
    this.diffStoredAndPrintedValues = function(): boolean {
        const displayOperationsArray = displayedConverter.getAvalibleConvertRules();
        const storageOperationsArray = storegedConverter.getAvalibleConvertRules();
        if (displayOperationsArray.indexOf(storedValueType) == -1 && 
            storageOperationsArray.indexOf(displayedValueType) == -1) {
            this.valueFieldEnabler(0);
            this.selectEnabler(0);
            this.roundFieldEnabler(0);
            this.roundButtonEnabler(0);
            this.submitButtonEnabler(0);

            this.valueField("Проверьте парамтры!");

            return true;
        }
        return false;
    }

    // функция показывает и скрывает поле округления по необходимости
    this.checkNonIntegerValue = function() {
        function isInteger(num) {
            return (num ^ 0) === num;
          }
        // если число НЕ дробное
        if (isInteger(this.valueField())) {
            this.roundBlockVisible(0);
            this.roundFieldVisible(0);
            this.roundButtonVisible(0);
        }
        // если число дробное
        if (!isInteger(this.valueField())) {
            this.roundBlockVisible(1);
            this.roundFieldVisible(1);
            this.roundButtonVisible(1);
        }
    }

    /////////////////////////////
    // события элементов формы //
    /////////////////////////////

    // событие заполнения поля с главным значением
    this.valueFieldChangeEvent  = function() {
        console.log("field edited");

        this.diffStoredAndPrintedValues();

        // приходящие данные от пользователя - это строка переводим в число
        let valueField = +this.valueField();
        this.valueField(valueField);

        this.checkNonIntegerValue();
    }

    // событие выбора пункта из дропдауна
    this.optionsChangeEvent = function() {
        console.log("option selected");

        this.diffStoredAndPrintedValues();

        const convData = displayedConverter.convert(this.valueField(), this.selectedValueType());
        this.valueField(convData);
    }

    // событие нажатия на кнопку: round
    this.roundButtonClick = function () {
        console.log("round clicked");
        console.log(this.roundField());

        if (this.diffStoredAndPrintedValues()) { return }
        if (this.roundField() == undefined) { return }
        if (isNaN(this.roundField())) {
            this.roundField("");
            return;
        }

        console.log(typeof(this.roundField()));
        console.log(this.valueField());
        let roundetData = +this.valueField().toFixed(this.roundField());
        this.valueField(roundetData);
        this.checkNonIntegerValue(roundetData);
        this.roundField("");
    }

    // событие нажания на кнопку: save
    this.submitButtonClick = function () {
        console.log("save clicked");

        if (this.diffStoredAndPrintedValues()) { return }
        if (isNaN(this.valueField())) {
            this.valueField(""); // очистка мусора из поля
            return;
        }

        storegedConverter = new Converter(this.selectedValueType()) // переопределние исходного типа значения (оно меняется)
        const convData = storegedConverter.convert(this.valueField(), storedValueType)
        
        alert(`Перезапись JSON: ${this.valueField()} ${this.selectedValueType()} -> 
                                 ${convData} ${storedValueType}`);
    }

    /////////////////////////////////////////////////

    this.checkNonIntegerValue();
    this.diffStoredAndPrintedValues();
};
var viewModel = new ViewModel();
ko.applyBindings(viewModel);

function findJsonParameters(jsonData: any, priorityParameter = null, additionalParameter = null): string[] {
    let data = JSON.parse(jsonData);
    let priority = priorityParameter;
    let additional = additionalParameter;

    let availableParameters: string[] = [];
    for (let prop in data) {
        availableParameters.push(prop);
    }

    let returnedParameters: string[] =[];
    if (availableParameters.includes(priority) && !availableParameters.includes(additional)) {
        // has only priority
        
        returnedParameters.push(data[priority].toLowerCase())
        returnedParameters.push(data[priority].toLowerCase())
    } else if (availableParameters.includes(priority) && 
        availableParameters.includes(additional)) {
        // has priority and additional

        returnedParameters.push(data[priority].toLowerCase())
        returnedParameters.push(data[additional].toLowerCase())
    } else {
        // no parameters

        returnedParameters.push('')
        returnedParameters.push('')
    }
    return returnedParameters
}
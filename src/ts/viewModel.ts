let testData = {
    storage: "millimeters",
    display: "meters",
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

console.log(`хранимое -> ${storedValueType}, 
отображаемое -> ${displayedValueType}`)

let storegedConverter = new Converter(storedValueType); /* не константа, потому что при перезаписи значения, 
мы будем переопределять конвертер, так как значение, из которого нужно переводить, будет изменено */
const displayedConverter = new Converter(displayedValueType);

function ViewModel() {
    var self = this;
    // массив доступных операций
    self.availableOperationsArray = displayedConverter.getAvalibleConvertRules(); 
    // значение в поле
    self.valueField = ko.observable(valueField);
    // дропдаун с типами
    self.selectedValueType = ko.observable(displayedConverter.getValueType());
    // округление в поле
    self.roundField = ko.observable();

    ////////////////////////////////////////////////
    // слежка за свойством enable элементов формы //
    ////////////////////////////////////////////////

    self.valueFieldEnabler = ko.observable(1);
    self.selectEnabler = ko.observable(1);
    self.roundFieldEnabler = ko.observable(1);
    self.roundButtonEnabler = ko.observable(1);
    self.submitButtonEnabler = ko.observable(1);

    /////////////////////////////////////////////////
    // слежка за свойством visible элементов формы //
    /////////////////////////////////////////////////

    self.roundBlockVisible = ko.observable(0);

    /////////////////////////////////////////////////

    // функция проверяет, в одинаковой ли системе хранимое и отображаемое значение, если нет - элементы формы диактивируются
    self.diffStoredAndPrintedValues = function(): boolean {
        const displayOperationsArray = displayedConverter.getAvalibleConvertRules();
        const storageOperationsArray = storegedConverter.getAvalibleConvertRules();
        if (displayOperationsArray.indexOf(storedValueType) == -1 && 
            storageOperationsArray.indexOf(displayedValueType) == -1) {
            self.valueFieldEnabler(0);
            self.selectEnabler(0);
            self.roundFieldEnabler(0);
            self.roundButtonEnabler(0);
            self.submitButtonEnabler(0);

            self.valueField("Проверьте JSON!");

            return true;
        }
        return false;
    }

    self.checkNonIntegerValue = function(data) {
        function isInteger(num) {
            return (num ^ 0) === num;
        }
        if (isInteger(+data)) {
            self.roundBlockVisible(0)
        }
        if (!isInteger(+data)) {
            self.roundBlockVisible(1)
        }
    }

    /////////////////////////////
    // события элементов формы //
    /////////////////////////////

    // событие вызывается после каждого изменения поля
    self.valueField.subscribe(function(newValue) {
        self.diffStoredAndPrintedValues();
        self.checkNonIntegerValue(newValue);
    })

    // событие выбора пункта из дропдауна
    self.optionsChangeEvent = function() {
        // console.log("option selected");
        self.diffStoredAndPrintedValues();

        const convData = displayedConverter.convert(self.valueField(), self.selectedValueType());
        self.valueField(convData);
    }

    // событие нажатия на кнопку: round
    self.roundButtonClick = function () {
        // console.log("round clicked");
        // console.log(self.roundField());

        if (self.diffStoredAndPrintedValues()) { return }
        if (self.roundField() == undefined) { return }
        if (isNaN(self.roundField())) {
            self.roundField("");
            return;
        }

        // console.log(typeof(self.roundField()));
        // console.log(self.valueField());
        let roundetData = +(+self.valueField()).toFixed(self.roundField());
        self.valueField(roundetData);
        self.checkNonIntegerValue(roundetData);
        self.roundField("");
    }

    // событие нажания на кнопку: save
    self.submitButtonClick = function () {
        // console.log("save clicked");

        if (self.diffStoredAndPrintedValues()) { return }
        if (isNaN(self.valueField())) {
            self.valueField(""); // очистка мусора из поля
            return;
        }

        storegedConverter = new Converter(self.selectedValueType()) // переопределние исходного типа значения (оно меняется)
        const convData = storegedConverter.convert(self.valueField(), storedValueType)
        
        console.log(`Перезапись JSON: ${self.valueField()} ${self.selectedValueType()} -> 
                 ${convData} ${storedValueType}`);
    }

    // initial
    self.diffStoredAndPrintedValues();
    self.checkNonIntegerValue(self.valueField())
};
var viewModel = new ViewModel();
ko.applyBindings(viewModel);

function findJsonParameters(jsonData: any, priorityParameter = "storage", additionalParameter = "display"): string[] {
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
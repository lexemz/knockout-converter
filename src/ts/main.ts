import Converter from "./converter";
import * as ko from "knockout";

const jsonValue = 10.3241;
const jsonValuePrintType = 'kilograms';
const jsonvalueStorageType = 'celsius';

let valueField: number = jsonValue;
let printedValueType: string = jsonValuePrintType;
let storedValueType: string = jsonvalueStorageType;

let myConverter = new Converter(printedValueType);

let viewModel = {
    // массив доступных операций
    availableOperationsArray: myConverter.getAvalibleConvertRules(),
    // значение в поле
    valueField: ko.observable(valueField),

    // дропдаун с типами
    selectedValueType: ko.observable(printedValueType),

    // округление в поле
    roundField: ko.observable(),

    valueFieldChangeEvent : function() {
        console.log("field edited");

        // приходящие данные от пользователя - это строка
        this.valueField(+this.valueField())
    },

    optionsChangeEvent: function() {
        console.log("option selected");
        let convData = myConverter.convert(this.valueField(), this.selectedValueType());
        this.valueField(+convData.toFixed(10));
    },

    roundButtonClick: function () {
        console.log("round clicked");
        console.log(this.roundField());

        if (this.roundField() == undefined) {
            return;
        }
        if (isNaN(this.roundField())) {
            this.roundField("");
            return;
        }
        console.log(typeof(this.roundField()))
        console.log(this.valueField())
        let roundetData = +this.valueField().toFixed(this.roundField())
        this.valueField(roundetData);
        this.roundField("");
    },

    submitButtonClick: function () {
        console.log("save clicked");
        if (isNaN(this.valueField())) {
            this.valueField("");
            return;
        }

        let myConverter2 = new Converter(this.selectedValueType());
        let convData = myConverter2.convert(this.valueField(), storedValueType);

        alert(`Перезапись JSON: ${this.valueField()} ${this.selectedValueType()}-> ${+convData.toFixed(10)} ${storedValueType}`);
    },
};
ko.applyBindings(viewModel);
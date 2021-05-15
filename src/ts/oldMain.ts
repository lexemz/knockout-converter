import Converter from "./converter";
import * as ko from "knockout";

const jsonValue = 10.3232;
const jsonValuePrintType = 'mps';
const jsonValueStorageType = 'kph';

let valueField: number = jsonValue;
let printedValueType: string = jsonValuePrintType.toLowerCase();
let storedValueType: string = jsonValueStorageType.toLowerCase();

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

    ////////////////////////////////////////////////
    // слежка за свойством enable элементов формы //
    ////////////////////////////////////////////////
    valueFieldEnabler: ko.observable(1),
    selectEnabler: ko.observable(1),
    roundFieldEnabler: ko.observable(1),
    roundButtonEnabler: ko.observable(1),
    submitButtonEnabler: ko.observable(1),

    /////////////////////////////////////////////////
    // слежка за свойством visible элементов формы //
    /////////////////////////////////////////////////
    roundBlockVisible: ko.observable(0),
    roundFieldVisible: ko.observable(0),
    roundButtonVisible: ko.observable(0),

    // инициализатор / внешняя точка входа
    init: function() {
        this.checkNonIntegerValue();
        this.diffStoredAndPrintedValues();
    },

    // функция проверяет, в одинаковой ли системе хранимое и отображаемое значение, если нет - элементы формы диактивируются
    diffStoredAndPrintedValues: function(): boolean {
        let operationsArray = myConverter.getAvalibleConvertRules();
        if (operationsArray.indexOf(storedValueType) == -1) {
            this.valueFieldEnabler(0);
            this.selectEnabler(0);
            this.roundFieldEnabler(0);
            this.roundButtonEnabler(0);
            this.submitButtonEnabler(0);
            return true;
        }
        return false;
    },

    // функция показывает и скрывает поле округления по необходимости
    checkNonIntegerValue: function() {
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
    },

    /////////////////////////////
    // события элементов формы //
    /////////////////////////////

    // событие заполнения поля со главным значением
    valueFieldChangeEvent : function() {
        console.log("field edited");
        this.diffStoredAndPrintedValues();

        // приходящие данные от пользователя - это строка переводим в число
        let valueField = +this.valueField();
        this.valueField(valueField);

        this.checkNonIntegerValue();
    },

    // событие выбора пункта из дропдауна
    optionsChangeEvent: function() {
        console.log("option selected");
        this.diffStoredAndPrintedValues();

        let convData = myConverter.convert(this.valueField(), this.selectedValueType());
        this.valueField(+convData.toFixed(10));
    },

    // событие нажатия на кнопку: round
    roundButtonClick: function () {
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
    },

    // событие нажания на кнопку: save
    submitButtonClick: function () {
        console.log("save clicked");

        if (this.diffStoredAndPrintedValues()) { return }
        if (isNaN(this.valueField())) {
            this.valueField(""); // очистка мусора из поля
            return;
        }

        let myConverter2 = new Converter(this.selectedValueType());
        let convData = myConverter2.convert(this.valueField(), storedValueType);

        alert(`Перезапись JSON: ${this.valueField()} ${this.selectedValueType()}-> ${+convData.toFixed(10)} ${storedValueType}`);
    },
};
ko.applyBindings(viewModel);
viewModel.init();
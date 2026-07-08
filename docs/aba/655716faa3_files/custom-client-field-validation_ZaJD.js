/* requirements :
 * jquery
 * jquery validator 
 */


const englishLetters = "a-zA-Z";
const hebrewLetters = "\u0590-\u05fe";
const arabicLetters = "\u0600-۾ݐ-ݾ\u08a0-\u08fe";
const russianLetters = "Ѐ-ӾԀ-\u052e\u2de0-\u2dfeꙀ-\ua69e"; //cyrillic
const lettersAllLanguages = englishLetters + hebrewLetters + arabicLetters + russianLetters;

const VALIDATION_TYPE_ATTR_NAME = "validation-type";
const VALIDATION_MESSAGE_ATTR_NAME = "validation-message";
const VALIDATION_DATA_ATTR_NAME = "validation-data-key"; 
let verbosity = 0; //0 no console logs, 1 minimal, 2 all logs
let dataForValidation = {};

const getKeyForValidationData = (el) => {
    return $(el).data(VALIDATION_DATA_ATTR_NAME) + '-' + $(el).attr('name');
}
const validateByList = (inputValue, valuesList, shouldInclude) => {
    let isValid = valuesList.includes(inputValue);
    if (!shouldInclude) {
        isValid = !isValid;
    }
    return isValid;
}

$.validator.addMethod(
    "regex",
    function (value, element, regexp) {
        return this.optional(element) || regexp.test(value);
    },
    "אנא בדוק שוב"
);
$.validator.addMethod("novalidate", function (value, element) {
    return true;
});

$.validator.addMethod("validateByList", function (value, element) {
    const valuesListKey = getKeyForValidationData(element);
    const validationData = dataForValidation[valuesListKey];
    const shouldInclude = validationData["ShouldInclude"];
    const valuesList = validationData["Values"];
    if (!valuesList || valuesList.length == 0) {
        return false;
    }

    return validateByList(value, valuesList, shouldInclude);
});    

$.validator.addMethod("textEmailForCompany", function (value, element, emailRegex) {
    if ($("#order-Email").val() == "" && !$('#order-Email').prop('required'))
    {
        // if need to check email by company but the field is not required
        // in this case if the value is empty string we will return true as if the input is valid.
        return true;
    }

    let isEmailValid = emailRegex.test(value);
    if (!isEmailValid) {
        return false;
    }
    const valuesListKey = getKeyForValidationData(element);
    const validationData = dataForValidation[valuesListKey];
    if (!validationData) {
        return true;
    }
    const emailSuffix = value.split('@')[1];
    if (!emailSuffix) {
        return false;
    }
    const allowedEmailSuffixes = validationData["Allowed"];
    const forbiddenEmailSuffixes = validationData["Forbidden"];
    if (allowedEmailSuffixes && allowedEmailSuffixes.length > 0) {
        isEmailValid = isEmailValid && validateByList(emailSuffix, allowedEmailSuffixes, true);
    }
    if (forbiddenEmailSuffixes && forbiddenEmailSuffixes.length > 0) {
        isEmailValid = isEmailValid && validateByList(emailSuffix, forbiddenEmailSuffixes, false);
    }

    return isEmailValid;

});
$.validator.addMethod("isValidIDNumber", function (value, element) {
    const sumOfDigits = (string) => {
        string = string.split(""); //split into individual characters
        var sum = 0; //have a storage ready
        for (var i = 0; i < string.length; i++) {
            //iterate through
            sum += parseInt(string[i], 10); //convert from string to int
        }
        return sum; //return when done
    };

    const isNumeric = (str) => {
        if (typeof str != "string") {
            return;
        }
        if (isNaN(str)) {
            return;
        }
        const iStr = parseInt(str);
        if (isNaN(iStr)) {
            return;
        }
        return true;
    };

    const calculateIDResult = (idValue) => {
        let remainder = idValue % 10;
        if (remainder == 0) {
            remainder = 10;
        }
        return 10 - remainder;
    };
    const isIdValid = (inValue) => {
        if (!isNumeric(inValue) || inValue.length != 9) {
            return false;
        }
        //src : https://www.excelist.co.il/excel_guide/calculate_control_digit/#:~:text=%D7%9E%D7%94%20%D7%96%D7%94%20%D7%A1%D7%A4%D7%A8%D7%AA%20%D7%91%D7%99%D7%A7%D7%95%D7%A8%D7%AA%20%3F,%D7%A9%D7%9E%D7%9E%D7%95%D7%A7%D7%9E%D7%AA%20%D7%9B%D7%A1%D7%A4%D7%A8%D7%94%20%D7%94%D7%99%D7%9E%D7%A0%D7%99%D7%AA%20%D7%91%D7%99%D7%95%D7%AA%D7%A8%20%D7%91%D7%9E%D7%A1%D7%A4%D7%A8.
        let idValue = 0;
        let digitWeight = 0;
        let iDigit = 0;
        let digitValue = 0;
        for (
            let idDigitIdxLeftToRight = 0;
            idDigitIdxLeftToRight < inValue.length - 1 /*exclude check digit*/;
            idDigitIdxLeftToRight++
        ) {
            digitWeight = idDigitIdxLeftToRight % 2 == 0 ? 1 : 2;
            iDigit = parseInt(inValue.charAt(idDigitIdxLeftToRight));
            digitValue = iDigit * digitWeight;
            idValue = idValue + sumOfDigits(digitValue.toString());
        }
        const inCheckDigit = parseInt(inValue.charAt(inValue.length - 1));
        const calculatedCheckDigit = calculateIDResult(idValue);
        return inCheckDigit == calculatedCheckDigit;
    };
    return isIdValid(value);
});

$.validator.setDefaults({
    ignore: '',
    errorElement: 'span',
    errorPlacement: function (error, element) {
        error.appendTo(element.parent());
    },
});
const validationTypesObj = {
    validationTypes: [
        "NoValidate",
        "TextPhoneNumber",
        "TextDigitsOnly",
        "TextLettersOnly",
        "TextLettersSpace",
        "TextLettersSpaceDash",
        "TextAlphaNumeric",
        "TextAlphaNumericSpace",
        "TextEmail",
        "TextEmailForCompany",
        "ValidateByList",
        "RequiredOnly",
        "TextPhoneNumberNoAreaCode",
        "IDNumber"
    ],
    //get [inValidationType]() { return this.validationTypes.includes(inValidationType) ? inValidationType : this.validationTypes[0]; },
};

const validationDataAttributeToValidationInputType = new Proxy(validationTypesObj, {
    get(obj, prop) {
        if (obj.validationTypes.includes(prop)) {
            return prop;
        }
        else {
            return obj.validationTypes[0];
        }
            
    }
});

//const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ //chatGPT regex;
// Newer version
const emailRegex = /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@(?![.-])[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

const validationInputTypeToRegex = {
    TextEmail: emailRegex,
    TextPhoneNumber: /^0([0-9]{9})$/, //^[0]([0-9]{8,})|(^[0]([0-9]{1,})\-+[0-9]{3}[0-9]{4})
    TextPhoneNumberNoAreaCode: /^([0-9]{7})$/, //(052)1234567
    TextLettersOnly: new RegExp(`[^${lettersAllLanguages}]+`),
    TextDigitsOnly: /^[0-9]+$/,
    TextAlphaNumericSpace: new RegExp(`^[${lettersAllLanguages} 0-9]+$`),
    TextLettersSpaceDash: new RegExp(`^[${lettersAllLanguages} -]+$`),
    TextAlphaNumeric: new RegExp(`^[${lettersAllLanguages}0-9]+$`),
};

const validationInputTypeToCustomRule = {
    ValidateByList: {
        validateByList: true
    },
    TextEmailForCompany : { 
        textEmailForCompany: emailRegex
    },
    IDNumber: {
        isValidIDNumber: true
    }
};

const validationInputTypeToMessages = {
    default: "אנא הזן ערך תקין",
    TextEmail: "אנא הזן מייל תקין",
    TextPhoneNumber: "אנא הזן טלפון תקין,מספרים בלבד",
    TextDigitsOnly: "אנא הזן מספרים בלבד",
    TextAlphaNumericSpace: "אנא הזן מספרים, אותיות או רווח בלבד",
    TextLettersSpaceDash: "אנא הזן אותיות, מקף או רווח בלבד",
    ValidateByList : "אנא הזן ערך מתאים לפי הרשימה",
    IDNumber: "מספר תעודת הזהות אינו תקין",
    TextEmailForCompany: "אנא הזן מייל תקין לפי תנאי החברה",
    //ValueInList: "אנא הזן ערך מתוך הרשימה",
    //equalsToValue: "אנא הזן ערך מתוך הרשימה",
};


const getValidationMessage = (inputElement, validationInputType) => {
    const messageEmbeddedInElement = $(inputElement).data(VALIDATION_MESSAGE_ATTR_NAME);
    const messageByValidationInputType = validationInputTypeToMessages[validationInputType];
    //if (verbosity > 1) {
    //    console.table([messageEmbeddedInElement, messageByValidationInputType, validationInputTypeToMessages[validationInputType]]);
    //}
    return messageEmbeddedInElement || messageByValidationInputType || validationInputTypeToMessages[validationInputType] || validationInputTypeToMessages.default;
};

const getValidationRule = (inputElement, validationInputType) => {
    let inputValidationRule = {/*novalidate: true*/};
    if (validationInputType in validationInputTypeToRegex) {
        inputValidationRule = {
            regex: validationInputTypeToRegex[validationInputType],
        };
    } else if (validationInputType in validationInputTypeToCustomRule) {
        inputValidationRule = validationInputTypeToCustomRule[validationInputType];
    }
    const isRequired = $(inputElement).prop('required');
    if (isRequired) {
        inputValidationRule["required"] = true;
        //delete inputValidationRule.novalidate;
    }
    return inputValidationRule;
};

const getValidationData = (inputElement) => {
    const inputValidationDataAttr = $(inputElement).data(VALIDATION_TYPE_ATTR_NAME);
    const validationInputType = validationDataAttributeToValidationInputType[inputValidationDataAttr];

    const inputValidationMessage= getValidationMessage(inputElement, validationInputType);
    let inputValidationRule = getValidationRule(inputElement, validationInputType);

    return {
        rule: inputValidationRule,
        message: inputValidationMessage
    };
}


//const setVerbosity = (inVerbosity) => {
//    verbosity = inVerbosity;
//}


const setDataForJqueryValidation = (el, data) => {
    if (!data || !el) {
        return;
    }
    const dataValidationKey = getKeyForValidationData(el);
    dataForValidation[dataValidationKey] = data;

}


const addJqueryValidation = function (formToValidateId) {
    let inputsValidationRules = {};
    let inputsValidationMessages = {};
    let currInputName;
    let currInputValidationData;
    $(`#${formToValidateId} :input, #${formToValidateId} select`).each(function (index, el) {
        currInputName = $(el).attr("name");
        if (currInputName) {
            currInputValidationData = getValidationData($(this));
            inputsValidationRules[currInputName] = currInputValidationData.rule;
            inputsValidationMessages[currInputName] = currInputValidationData.message;
        }
    });
    if (verbosity > 0) {
        console.log(inputsValidationRules);
        console.log(inputsValidationMessages);
    }
    $(`#${formToValidateId}`).validate({
        rules: inputsValidationRules,
        messages: inputsValidationMessages,
    });
};



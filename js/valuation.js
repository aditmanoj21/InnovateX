/* =========================================
   INNOVATEX TRADE-IN
   VALUATION SYSTEM
   ========================================= */


/*
   Read information sent from device.html
*/

const params = new URLSearchParams(window.location.search);

const brand = params.get("brand") || "";
const model = params.get("model") || "";
const storage = params.get("storage") || "";
const purchaseYear = Number(params.get("year")) || 0;
const originalPrice = Number(params.get("price")) || 0;


/*
   Current year
*/

const currentYear = new Date().getFullYear();


/*
   Calculate device age
*/

const deviceAge = purchaseYear > 0
    ? Math.max(0, currentYear - purchaseYear)
    : 0;


/*
   Age depreciation
   These are project-defined valuation rules.
*/

function getAgeDeduction(age) {

    if (age <= 1) {
        return 0.10;
    }

    if (age <= 2) {
        return 0.20;
    }

    if (age <= 3) {
        return 0.30;
    }

    if (age <= 4) {
        return 0.40;
    }

    return 0.50;
}


/*
   Condition deductions
*/

const conditionDeductions = {

    screen: {
        excellent: 0.00,
        good: 0.05,
        fair: 0.15,
        poor: 0.30
    },

    body: {
        excellent: 0.00,
        good: 0.05,
        fair: 0.10,
        poor: 0.20
    },

    battery: {
        "90plus": 0.00,
        "80-89": 0.05,
        "70-79": 0.10,
        below70: 0.20
    },

    functionality: {
        "fully-functional": 0.00,
        "minor-issues": 0.10,
        "major-issues": 0.25,
        "not-functional": 0.50
    }

};


/*
   Get selected condition
*/

function getSelectedValue(name) {

    const selected = document.querySelector(
        `input[name="${name}"]:checked`
    );

    return selected ? selected.value : null;
}


/*
   Calculate the trade-in value
*/

function calculateValuation() {

    const screen = getSelectedValue("screen");
    const body = getSelectedValue("body");
    const battery = getSelectedValue("battery");
    const functionality = getSelectedValue("functionality");

    /*
       Make sure all condition fields are selected.
    */

    if (!screen || !body || !battery || !functionality) {

        alert("Please complete all condition assessments before continuing.");

        return null;
    }


    /*
       Validate original price.
    */

    if (!originalPrice || originalPrice <= 0) {

        alert("Unable to calculate the value because the original purchase price is missing.");

        return null;
    }


    /*
       Calculate deductions.
    */

    const ageRate = getAgeDeduction(deviceAge);

    const screenRate = conditionDeductions.screen[screen];
    const bodyRate = conditionDeductions.body[body];
    const batteryRate = conditionDeductions.battery[battery];
    const functionalityRate =
        conditionDeductions.functionality[functionality];


    /*
       Calculate money deducted.
    */

    const ageDeduction = originalPrice * ageRate;

    const screenDeduction = originalPrice * screenRate;

    const bodyDeduction = originalPrice * bodyRate;

    const batteryDeduction = originalPrice * batteryRate;

    const functionalityDeduction =
        originalPrice * functionalityRate;


    /*
       Calculate final value.
    */

    let finalValue =
        originalPrice
        - ageDeduction
        - screenDeduction
        - bodyDeduction
        - batteryDeduction
        - functionalityDeduction;


    /*
       Prevent negative values.
    */

    finalValue = Math.max(0, finalValue);


    /*
       Round to nearest ₹100.
    */

    finalValue = Math.round(finalValue / 100) * 100;


    /*
       Return all valuation information.
    */

    return {

        brand,
        model,
        storage,
        purchaseYear,
        deviceAge,
        originalPrice,

        screen,
        body,
        battery,
        functionality,

        ageRate,
        screenRate,
        bodyRate,
        batteryRate,
        functionalityRate,

        ageDeduction,
        screenDeduction,
        bodyDeduction,
        batteryDeduction,
        functionalityDeduction,

        finalValue

    };
}


/*
   When the condition form is submitted
*/

const conditionForm = document.getElementById("conditionForm");

if (conditionForm) {

    conditionForm.addEventListener("submit", function(event) {

        event.preventDefault();


        /*
           Calculate valuation.
        */

        const valuation = calculateValuation();

        if (!valuation) {
            return;
        }


        /*
           Get additional remarks.
        */

        const remarks =
            document.getElementById("remarks")?.value || "";


        /*
           Store valuation data temporarily.
           This allows offer.html to display it.
        */

        sessionStorage.setItem(
            "tradeInValuation",
            JSON.stringify({
                ...valuation,
                remarks
            })
        );


        /*
           Move to offer page.
        */

        window.location.href = "offer.html";

    });

}
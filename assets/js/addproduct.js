const dvdInputs = '<div class="mb-3"><input id="size" class="shadow-sm form-control" type="number" data-bs-toggle="tooltip" data-bs-placement="right" min="0.00" step="0.01" value name="Size" placeholder="Size (MB)" required title="Provide the size of the DVD"/></div> <div class="mb-3"><p>The DVD is a digital optical disc data storage format. Currently, allowing up to 17.08 GB of storage, the medium can store any kind of digital data and was widely used for software and other computer files as well as video programs watched using DVD players. DVDs offer higher storage capacity than compact discs while having the same dimensions.</p><strong>The more you know...</strong></div>';
const furnitureInput = '<div class="mb-3"><input id="height" class="shadow-sm form-control" type="number" data-bs-toggle="tooltip" data-bs-placement="right" min="0.00" step="0.01" value name="Height" placeholder="Height (CM)" required title="Provide the height of the furniture"/></div> <div class="mb-3"><input id="width" class="shadow-sm form-control" type="number" data-bs-toggle="tooltip" data-bs-placement="right" min="0.00" step="0.01" value name="Width" placeholder="Width (CM)" required title="Provide the width of the furniture"/></div> <div class="mb-3"><input id="length" class="shadow-sm form-control" type="number" data-bs-toggle="tooltip" data-bs-placement="right" min="0.00" step="0.01" value name="Length" placeholder="Length (CM)" required title="Provide the length of the furniture"/></div> <div class="mb-3"><p>Furniture refers to movable objects intended to support various human activities such as seating, sleeping and eating. Furniture is also used to hold objects at a convenient height for work, or to store things.</p><strong>The more you know...</strong></div>';
const bookInputs = '<div class="mb-3"><input id="weight" class="shadow-sm form-control" type="number" data-bs-toggle="tooltip" data-bs-placement="right" min="0.00" step="0.01" value name="Weight" placeholder="Weight (KG)" required title="Provide the weight of the book"/></div><div class="mb-3"><p>A book is a medium for recording information in the form of writing or images, typically composed of many pages (made of papyrus, parchment, vellum, or paper) bound together and protected by a cover.The technical term for this physical arrangement is codex.</p><strong>The more you know...</strong></div>';

const additionalInputs = {
    'DVD': dvdInputs,
    'Book': bookInputs,
    'Furniture': furnitureInput
};

const emptyFieldNotification = 'Please, submit required data';
const wrongTypeNotification = 'Please, provide the data of indicated type';
const SkuNotUnique = 'Item with specified SKU already exists';

$(document).ready(function () {
    $('#additional_inputs').empty();

    $('#productType').on('change', function () {
        $('#additional_inputs').empty();
        $('#additional_inputs').append(additionalInputs[this.value]);
    });

    function defineValidationListener() {
        let typeNotSet = $('#productType').find(':selected').val() === '';
        if (typeNotSet) {
            alertify.notify(emptyFieldNotification);
            window.alertEmptyFieldNotSent = false;
        }
        $('input[required]').on('invalid', function () {
            let value = $(this).val();
            let type = $(this).attr('type');

            if (window.alertEmptyFieldNotSent && (!value)) {
                alertify.notify(emptyFieldNotification);
                window.alertEmptyFieldNotSent = false;
            }

            if (window.alertNonNumericNotSent && type === 'number' && !isNumeric(value)) {
                alertify.notify(wrongTypeNotification);
                window.alertNonNumericNotSent = false;
            }
        });
    }
    $('#submitBtn').click(function () {
        let value = $('#productType').find(':selected').val();
        window.alertEmptyFieldNotSent = true;
        window.alertNonNumericNotSent = true;
        defineValidationListener();

        $('form').submit(function () {
            $.ajax({
                type: 'POST',
                url: '/API/addItem',
                data: $('form').serialize() + '&Type=' + value,
                success: function () {
                    location.href = './index.html';
                },
            }).fail(function (data, textStatus, jqXHR) {
                let request = new XMLHttpRequest();
                request.open('GET', '/API/isUniqueSku?sku=' + $('#sku').val(), false);
                request.send(null);

                if (request.status === 200) {
                    let isUniqueSku = JSON.parse(request.responseText);
                    if (isUniqueSku === false) {
                        alertify.error(SkuNotUnique);
                    }
                }
            });

            return false
        });
        $('#submit').click();
    });
});

function isNumeric(str) {
    if (typeof str != "string") return false
    if (str === '') return false
    return !isNaN(str) && !isNaN(parseFloat(str)) && parseFloat(str) >= 0;
}
$(document).ready(function () {
    let json = fetchCardsJson();
    jsonToGrid(json);

    $('#delete-product-btn').click(function () {
        let idArray = [];
        $.each($('input:checked'), function () {
            idArray.push($(this).val());
        });

        idArray.forEach(id => {
            $('#' + id).remove();
        });

        deleteByID(idArray);
    });
});

function jsonToGrid(toParse) {

    $('.grid').empty();
    toParse.items.forEach(item => {
        appendCard(item);
    });
}

function sanitized(string) {
    return $('<div>').text(string).html();
}

function appendCard(card) {
    card.id = parseInt(card.id, 10);
    card.sku = sanitized(card.sku);
    card.name = sanitized(card.name);
    card.price = sanitized(card.price);
    card.additional = sanitized(card.additional);

    markup = `
    <div id="${card.id}" class="card">
        <input class="delete-checkbox form-check-input" type="checkbox" value="${card.id}">
        <div>
            <span>${card.sku}</span>
            <span>${card.name}</span>
            <span>${card.price}</span>
            <span>${card.additional}</span>
        </div>
    </div>
    `

    $('.grid').append(markup);
}

function deleteByID(idArray) {
    let responseJson;
    let jsonArray = JSON.stringify(idArray);

    let request = new XMLHttpRequest();
    request.open('GET', '/API/removeItem?id=' + jsonArray, false);
    request.send(null);

    if (request.status === 200) {
        responseJson = request.responseText;
    }

    jsonToGrid(JSON.parse(responseJson));
}

function fetchCardsJson() {
    let request = new XMLHttpRequest();
    request.open('GET', '/API/getItemsJson', false);
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    }
}
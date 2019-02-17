var optionData = [];
var productData;
var cf = "";

$.getJSON("./products.json", function (data) {
    productData = data;
    $('#productJson').append('<pre>'+JSON.stringify(productData, undefined, 4)+'</pre>');
});

function optionJSON(type) {
    convertProductToOptionJson(productData);
    if(type == 1) {
        exportToJsonFile(optionData);
    }
}

function convertProductToOptionJson(productJson) {
    cf = crossfilter(productJson.products);
    D1 = cf.dimension(function (d) { return d.title; });
    D1.top(Infinity).forEach((element, index) => {
        createOptionsJson(element, index);
    });
    $('#optionJSON').empty();
    $('#optionJSON').append('<h3>Options.JSON</h3><p><pre>' + JSON.stringify(optionData, undefined, 4) + '</pre></p>');
}

function createOptionsJson(data, index) {
    option = data.options;
    var dataArray = [],
        tempDataArray = [],
        tempTempDataArray = [];
    for (let i = (option.length - 1); i >= 0; i--) {
        var object = {};
        if (i == (option.length - 1)) {
            for (let j = 0; j < option[i].values.length; ++j) {
                object.name = option[i].name;
                object.value = option[i].values[j];
                object.variant_id = "";
                tempDataArray.push(object);
                object = {};
            }
        } else {
            if (i != 0) {
                for (let j = 0; j < option[i].values.length; ++j) {
                  object.name = option[i].name;
                  object.value = option[i].values[j];
                  object['option' + (i + 2)] = tempDataArray;
                  tempTempDataArray.push(object);
                  object = {};
                }
            } else {
                for (let j = 0; j < option[i].values.length; ++j) {
                  object.name = option[i].name;
                  object.value = option[i].values[j];
                  if (tempTempDataArray.length > 0) {
                      object['option' + (i + 2)] = tempTempDataArray;
                  } else {
                      object['option' + (i + 2)] = tempDataArray;
                  }
                  dataArray.push(object);
                  object = {};
                }
            }
        }
    }
    if (dataArray.length == 0) {
        dataArray = tempDataArray;
    }
    optionData.push({ 'option1': dataArray });
}

function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let exportFileDefaultName = 'options.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
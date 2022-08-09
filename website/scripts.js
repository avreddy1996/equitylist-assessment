function byId(id) {
    return document.getElementById(id)
}
function formatAmount(amount) {
    if(Number(amount) < 0) {
        return '-$' + Math.abs(amount).toFixed(2)
    } else if (Number(amount) >= 0) {
        return '$' + amount.toFixed(2)
    } else {
        return '$0.00'
    }
}
function formatDate(date) {
    date = new Date(date)
    return date.toLocaleString()
}
function getItemDescription(item) {
    return item.type.toLowerCase() + ' to ' + item.destination.description + ' from ' + (item.source.description || 'External sources')
}
(function () {
    var dataType = 'simple';
    var ledgerData = [];
    var ledgerBody = byId('ledger-body')
    var balance = byId('balance')
    var ledgerStart = byId('ledger-start')
    var ledgerEnd = byId('ledger-end')
    var dataChanger = byId('data-changer')
    dataChanger.addEventListener('change', updateDataType)
    function updateDataType(e) {
        dataType = e.target.value
        getData(dataType)
    }
    function removeDuplicates(data) {
        let resultingArray = [];
        let existing = {};
        for (let i = 0; i < data.length; i++) {
            if (!existing[data[i].activity_id]) {
                existing[data[i].activity_id] = true;
                resultingArray.push(data[i]);
            }
        }
        return resultingArray;
    }
    function sortByDate(data) {
        return data.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });
    }
    function transformData(data) {
        let transformedData = [];
        transformedData = sortByDate(removeDuplicates(data))
        console.log(transformedData)
        return transformedData;
    }
    function drawLedger() {
        ledgerBody.innerHTML = ''
        ledgerData.forEach(function (item) {
            let row = document.createElement('tr');
            row.innerHTML = `<td>${formatDate(item.date)}</td><td>${item.type}</td><td class="description">${getItemDescription(item)}</td><td class="amount">${formatAmount(item.amount)}</td><td class="amount">${formatAmount(item.balance)}</td>`;
            ledgerBody.appendChild(row);
        })
        balance.innerText = formatAmount(ledgerData[0].balance);
        ledgerStart.innerText = (new Date(ledgerData[ledgerData.length - 1].date)).toLocaleDateString()
        ledgerEnd.innerText = (new Date(ledgerData[0].date)).toLocaleDateString()
    }
    function getData(type) {
        fetch(`./../data/${type}_ledger.json`)
          .then((res) => res.json())
          .then((data) => {
            ledgerData = transformData(data);
            drawLedger();
          });
    }
    getData(dataType);
})()
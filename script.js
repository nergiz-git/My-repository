const API_URL = "https://open.er-api.com/v6/latest/";
const API_KEY = "84fbec1168aca3156cc48dc7b38b4907"; 


const currencyTabs1 = document.querySelectorAll(".currency-group:first-child .currency-tab");
const currencyTabs2 = document.querySelectorAll(".currency-group:last-child .currency-tab");
const amountInput1 = document.getElementById("amount1");
const amountInput2 = document.getElementById("amount2");
const rate1 = document.getElementById("rate1");
const rate2 = document.getElementById("rate2");
const offlineMessage = document.getElementById("offline-message");


let currency1 = "RUB";
let currency2 = "USD";


let exchangeRates = {};


async function fetchExchangeRates(baseCurrency) {
  try {
    const response = await fetch(`${API_URL}${baseCurrency}`);
    const data = await response.json();

    if (data.result === "success") {
      exchangeRates = data.rates;
      updateRates();
      calculateFromLeft(); 
      calculateFromRight(); 
    } else {
      console.error("API-dən məlumat alınmadı:", data.error);
    }
  } catch (error) {
    console.error("Xəta:", error);
    offlineMessage.style.display = "block";
  }
}


function updateRates() {
  if (exchangeRates[currency2] && exchangeRates[currency1]) {
  const rate1Value = (exchangeRates[currency2] / exchangeRates[currency1]).toFixed(4);
  const rate2Value = (1 / rate1Value).toFixed(4);

  rate1.textContent = `1 ${currency1} = ${rate1Value} ${currency2}`;
  rate2.textContent = `1 ${currency2} = ${rate2Value} ${currency1}`;
}else {
  console.error("Valyutalar tapılmadı:", currency1, currency2);
}
}



function calculateFromLeft() {
  if (!isOnline) {
    console.warn("İnternet bağlantısı yoxdur, çevrilmə mümkün deyil.");
    if (currency1 === currency2) {
      amountInput2.value = amountInput1.value; 
    }
    return;
  }
  const inputValue = parseFloat(amountInput1.value);
  if (!isNaN(inputValue)) {
    const rate1Value = exchangeRates[currency2] / exchangeRates[currency1];
    amountInput2.value = (inputValue * rate1Value).toFixed(4);
  } else {
    amountInput2.value = "";
  }
}


function calculateFromRight() {
  if (!isOnline) {
    console.warn("İnternet bağlantısı yoxdur, çevrilmə mümkün deyil.");
    if (currency1 === currency2) {
      amountInput1.value = amountInput2.value; 
    }
    return;
  }
  const inputValue = parseFloat(amountInput2.value);
  if (!isNaN(inputValue)) {
    const rate2Value = exchangeRates[currency1] / exchangeRates[currency2];
    amountInput1.value = (inputValue * rate2Value).toFixed(4);
  } else {
    amountInput1.value = "";
  }
}


function setActiveTab(tabs, activeCurrency) {
  tabs.forEach((tab) => {
    if (tab.dataset.currency === activeCurrency) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

currencyTabs1.forEach((tab) => {
  tab.addEventListener("click", () => {
    currency1 = tab.dataset.currency;
    setActiveTab(currencyTabs1, currency1);
    fetchExchangeRates(currency1); 
  });
});

currencyTabs2.forEach((tab) => {
  tab.addEventListener("click", () => {
    currency2 = tab.dataset.currency;
    setActiveTab(currencyTabs2, currency2);
    updateRates(); 
    calculateFromLeft(); 
    calculateFromRight(); 
  });
});


amountInput1.addEventListener("input", calculateFromLeft);
amountInput2.addEventListener("input", calculateFromRight);
fetchExchangeRates(currency1);


let isOnline = navigator.onLine;



function updateNetworkStatus() {
  isOnline = navigator.onLine;
  if (isOnline) {
    hideOfflineMessage();
    fetchExchangeRates(currency1); 
  } else {
    showOfflineMessage();
    amountInput1.value = ""; 
    amountInput2.value = ""; 
  }
}

function showOfflineMessage() {

  offlineMessage.style.display = "block";
}

function hideOfflineMessage() {

  offlineMessage.style.display = "none"; 
}
window.addEventListener("online", updateNetworkStatus); 
window.addEventListener("offline", updateNetworkStatus); 
updateNetworkStatus();

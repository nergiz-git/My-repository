const amount1 = document.getElementById("amount1");
const amount2 = document.getElementById("amount2");
const rate1 = document.getElementById("rate1");
const rate2 = document.getElementById("rate2");
const errorMessage = document.getElementById("errorMessage");
let currency1 = "RUB";
let currency2 = "USD";

function validateNumberInput(event) {
  if (
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "Tab" ||
    event.key === "Escape" ||
    event.key === "Enter" ||
    event.key === "." ||
    event.key === ","
  ) {
    if (
      (event.key === "." || event.key === ",") &&
      event.target.value.includes(".")
    ) {
      event.preventDefault();
    }
    return;
  }
  
if (
    (event.ctrlKey === true || event.metaKey === true) &&
    (event.key === "a" ||
      event.key === "c" ||
      event.key === "v" ||
      event.key === "x")
  ) {
    return;
  }

  if (event.key < "0" || event.key > "9") {
    event.preventDefault();
  }
}


function handlePaste(event) {
  const pastedData = (
    event.clipboardData || window.clipboardData
  ).getData("text");
  if (!/^\d*\.?\d*$/.test(pastedData)) {
    event.preventDefault();
  }
}


amount1.addEventListener("keypress", validateNumberInput);
amount2.addEventListener("keypress", validateNumberInput);
amount1.addEventListener("paste", handlePaste);
amount2.addEventListener("paste", handlePaste);

function handleInput(event) {
  const value = event.target.value;


  let sanitizedValue = value.replace(/,/g, ".");

  const parts = sanitizedValue.split(".");
  if (parts.length > 2) {
    sanitizedValue = parts[0] + "." + parts.slice(1).join("");
  }


  if (sanitizedValue !== value) {
    event.target.value = sanitizedValue;
  }


  if (event.target === amount1) {
    convertCurrency();
  } else {
    convertCurrencyReverse();
  }
}

amount1.addEventListener("input", handleInput);
amount2.addEventListener("input", handleInput);


document.querySelectorAll(".currency-tab").forEach((tab) => {
  tab.addEventListener("click", (e) => {
    const group = e.target.closest(".currency-group");
    group
      .querySelectorAll(".currency-tab")
      .forEach((t) => t.classList.remove("active"));
    e.target.classList.add("active");

    if (group === amount1.closest(".currency-group")) {
      currency1 = e.target.dataset.currency;
    } else {
      currency2 = e.target.dataset.currency;
    }
    convertCurrency();
  });
});

const API_KEY = "cf72c74c0334b5edfe94a1a83e1a8626";

async function convertCurrency() {
  const value1 = parseFloat(amount1.value) || 0;

  if (currency1 === currency2) {
    amount2.value = amount1.value;
    rate1.textContent = `1 ${currency1} = 1 ${currency2}`;
    rate2.textContent = `1 ${currency2} = 1 ${currency1}`;
    return;
  }

  try {
    errorMessage.style.display = "none";
    const response = await fetch(
      `https://api.exchangerate.host/convert?access_key=${API_KEY}&from=${currency1}&to=${currency2}&amount=${value1}`
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    if (!data.success) throw new Error(data.error.info);

    const rate = data.result / value1;

    amount2.value = data.result.toFixed(4);
    rate1.textContent = `1 ${currency1} = ${rate.toFixed(4)} ${currency2}`;
    rate2.textContent = `1 ${currency2} = ${(1 / rate).toFixed(4)} ${currency1}`;
  } catch (error) {
    errorMessage.style.display = "block";
    rate1.textContent = "";
    rate2.textContent = "";
  }
}

async function convertCurrencyReverse() {
  const value2 = parseFloat(amount2.value) || 0;

  if (currency1 === currency2) {
    amount1.value = amount2.value;
    rate1.textContent = `1 ${currency1} = 1 ${currency2}`;
    rate2.textContent = `1 ${currency2} = 1 ${currency1}`;
    return;
  }

  try {
    errorMessage.style.display = "none";
    const response = await fetch(
      `https://api.exchangerate.host/convert?access_key=${API_KEY}&from=${currency2}&to=${currency1}&amount=${value2}`
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    if (!data.success) throw new Error(data.error.info);

    const rate = data.result / value2;

    amount1.value = data.result.toFixed(4);
    rate2.textContent = `1 ${currency2} = ${rate.toFixed(4)} ${currency1}`;
    rate1.textContent = `1 ${currency1} = ${(1 / rate).toFixed(4)} ${currency2}`;
  } catch (error) {
    errorMessage.style.display = "block";
    rate1.textContent = "";
    rate2.textContent = "";
  }
}

const offlineMessage = document.getElementById("offline-message");
const tabs = document.querySelectorAll(".currency-tab");
let isOffline = !navigator.onLine; 


function updateNetworkStatus() {
    isOffline = !navigator.onLine;

    if (isOffline) {
        offlineMessage.style.display = "block"; 
    } else {
        offlineMessage.style.display = "none"; 
        convertCurrency(); 
    }
}

tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        if (isOffline) {
            e.preventDefault(); 
        } else {
            console.log("Tab dəyişdirildi, API çağırışı göndərilir.");
        }
    });
});

updateNetworkStatus();


window.addEventListener("offline", updateNetworkStatus);
window.addEventListener("online", updateNetworkStatus);

async function convertCurrency() {
    const amount1Value = parseFloat(document.getElementById("amount1").value) || 0;
    const amount2Input = document.getElementById("amount2");

   
    if (currency1 === currency2) {
        amount2Input.value = amount1Value; 
        console.log("Valyutalar eynidir, heç bir çevrilmə aparılmadı.");
        document.getElementById("rate1").textContent = `1 ${currency1} = 1 ${currency2}`;
        document.getElementById("rate2").textContent = `1 ${currency2} = 1 ${currency1}`;
        return;
    }

    if (isOffline) return; 

    try {
        const response = await fetch(
            `https://api.exchangerate.host/convert?from=${currency1}&to=${currency2}&amount=${amount1Value}`
        );
        const data = await response.json();
        console.log("API-dən alınan cavab:", data);

        if (data && data.result) {
            amount2Input.value = data.result;
            const rate = data.result / amount1Value;
            document.getElementById("rate1").textContent = `1 ${currency1} = ${rate.toFixed(4)} ${currency2}`;
            document.getElementById("rate2").textContent = `1 ${currency2} = ${(1 / rate).toFixed(4)} ${currency1}`;
        }
    } catch (error) {
        console.error("Valyuta yenilənməsində xəta:", error);
    }
}

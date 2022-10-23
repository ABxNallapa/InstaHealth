import { Chart, registerables } from "./lib/dist/chart.js";

let queryOptions = { active: true, lastFocusedWindow: true };
chrome.tabs.query(queryOptions).then(([tab]) => {
    if (tab) {
        chrome.action.setBadgeText({tabId: tab.id, text: ""});
        chrome.runtime.sendMessage({
            message: 'request_percent_data',
            tabId: tab.id,
        }, (response) => {
            updateUI(response.data)
        });
    }
});

function updateUI(percent_data) {
    Chart.register(...registerables);
    if (percent_data) {
        const calorieChart = createChart("calorieChart", percent_data["calories"], "rgb(255, 99, 132)", "Calories");
        const proteinChart = createChart("proteinChart", percent_data["protein"], "rgb(255, 99, 132)", "Protein");
        const carbChart = createChart("carbChart", percent_data["carbohydrates"], "rgb(255, 99, 132)", "Carbs");
        const fatChart = createChart("fatChart", percent_data["fat"], "rgb(255, 99, 132)", "Fat");
    }
}

function createChart(id, percent, color, category) {
  let canvas = document.getElementById(id);
  const labels = [category, ""];
  const data = {
    labels: labels,
    datasets: [
      {
        label: category,
        backgroundColor: [color, "rgb(192, 192, 192)"],
        borderColor: "rgb(255, 255, 255)",
        borderWidth: 2,
        cutout: "65%",
        data: [percent * 100, 100 - percent * 100],
        // percent is percent from python dict returned from calculate_percent()
      },
    ],
  };
  const config = {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: category,
        },
      },
    },
  };
  return new Chart(canvas, config);
}

import { Chart, registerables } from "./lib/dist/chart.js";

let queryOptions = { active: true, lastFocusedWindow: true };
chrome.tabs.query(queryOptions).then(([tab]) => {
    if (tab) {
        chrome.runtime.sendMessage({
            message: 'request_percent_data',
            tabId: tab.id,
        }, (response) => {
            updateUI(response.data)
        });
    }
});

function updateUI(percent_data) {
    console.log(percent_data)
    calorieChart.data = [percent_data["calories"] * 100, 100 - percent_data["calories"] * 100]
}

function createChart(id, percent, color, category) {
  let canvas = document.getElementById(id);
  const labels = [category, ""];
  const data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: [color, "rgb(192, 192, 192)"],
        borderColor: "rgb(255, 255, 255)",
        borderWidth: 2,
        cutout: "65%",
        hoverOffset: 10,
        hoverBorderWidth: 6,
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

Chart.register(...registerables);

const calorieChart = createChart("calorieChart", 0.75, "rgb(0, 0, 0)", "Calories");
const proteinChart = createChart("proteinChart", 0.75, "rgb(139, 69, 19)", "Protein");
const carbChart = createChart("carbChart", 0.75, "rgb(255, 255, 0)", "Carbs");
const fatChart = createChart("fatChart", 0.75, "rgb(258, 255, 0)", "Fat");


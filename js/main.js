document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("data-table");

  // Добавляем проценты в столбец "Вчера"
  const rows = table.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    if (row.cells.length === 4) {
      const yesterdayCell = row.cells[2];
      const yesterdayValue = parseInt(
        yesterdayCell.textContent.replace(/\s/g, "")
      );
      const todayValue = parseInt(row.cells[1].textContent.replace(/\s/g, ""));
      const percentage = Math.round(
        ((yesterdayValue - todayValue) / todayValue) * 100
      );

      // Создаем элемент для процентов
      const percentElement = document.createElement("span");
      percentElement.textContent = `   ${percentage}%`;

      // Добавляем класс для фона в зависимости от значения процента
      if (percentage > 0) {
        percentElement.classList.add("percent-positive");
      } else if (percentage < 0) {
        percentElement.classList.add("percent-negative");
      } else {
        percentElement.classList.add("percent-zero");
      }

      // Добавляем проценты в ячейку "Вчера"
      yesterdayCell.appendChild(percentElement);

      // Добавляем класс для фона ячейки "Вчера" в зависимости от значения процента
      if (percentage < 0) {
        yesterdayCell.classList.add("negative-background");
      }
    }
  });

  table.addEventListener("click", function (event) {
    if (event.target.tagName === "TD") {
      const row = event.target.parentElement;
      const nextRow = row.nextElementSibling;
      const chartContainer = nextRow.querySelector(".chart-container");

      // Если график уже открыт, скрываем его
      if (chartContainer.style.display === "block") {
        chartContainer.style.display = "none";
        return;
      }

      // Скрываем все графики
      const allChartContainers = table.querySelectorAll(".chart-container");
      allChartContainers.forEach((container) => {
        container.style.display = "none";
      });

      // Показываем график для текущей строки
      chartContainer.style.display = "block";

      // Получаем данные для графика
      const values = row.getAttribute("data-values").split(",");

      // Очищаем предыдущий график
      while (chartContainer.firstChild) {
        chartContainer.removeChild(chartContainer.firstChild);
      }

      // Создание нового графика с помощью Chart.js
      const ctx = document.createElement("canvas");
      chartContainer.appendChild(ctx);

      // Устанавливаем зеленый цвет для всех линий
      const lineColor = "#008000";

      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Текущий день", "Вчера", "Этот день недели"],
          datasets: [
            {
              label: "Данные",
              data: values.map(Number),
              borderColor: lineColor,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  });
});

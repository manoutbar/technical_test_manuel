import { Bar } from 'react-chartjs-2';

const GOLD_COLOR = '255, 205, 86';
const SILVER_COLOR = '201, 203, 207';
const BRONZE_COLOR = '142, 77, 21';
const DEFAULT_COLOR = '255, 0, 0';

function colorByPosition(position) {
  if (position === 1) return GOLD_COLOR
  else if (position === 2) return SILVER_COLOR
  else if (position === 3)  return BRONZE_COLOR
  else return DEFAULT_COLOR;
}

export default function TimesChart({ data, avgTime = null, applyPositionColors = true }) {
  const datasets = [{
    label: 'Time',
    data: data.map(d => d.time_millis),
    backgroundColor: applyPositionColors ? data
      .map(d => colorByPosition(d.position))
      .map(color => `rgba(${color}, 0.8)`) : `rgba(${DEFAULT_COLOR}, 0.8)`,
    borderColor: applyPositionColors ? data
      .map(d => colorByPosition(d.position))
      .map(color => `rgb(${color})`) : `rgba(${DEFAULT_COLOR}, 0.8)`,
    borderWidth: 2,
    borderRadius: 5,
  }];

  if (avgTime != null) {
    datasets.unshift({
      label: 'Average',
      data: data.map(() => avgTime),
      backgroundColor: `rgba(0,255,0,0.2)`,
    });
  }
  return (
    <Bar data={{
      labels: data.map(d => d.name),
      datasets: datasets
    }}
    options={{
      responsive: true,
      scales: {
        yAxes: {
          display: false,
        },
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          ticks: {
            display: false,
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = '';
              if (context.parsed.x != null) {
                const driver = data.find(d => (d.position - 1) === context.parsed.x);
                if (driver != null) {
                  label += `${driver.time}`
                }
              }
              return label;
            }
          }
        },
        legend: {
          display: false
        }
      }
    }}
  />);
}
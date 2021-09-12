import { Bar } from 'react-chartjs-2';

const GOLD_COLOR = '255, 205, 86';
const SILVER_COLOR = '201, 203, 207';
const BRONZE_COLOR = '142, 77, 21';
const DEFAULT_COLOR = '240, 240, 240';

const MAX_Y_AXE_VALUE = 23;


function colorByPosition(position) {
  if (position === 1) return GOLD_COLOR
  else if (position === 2) return SILVER_COLOR
  else if (position === 3)  return BRONZE_COLOR
  else return DEFAULT_COLOR;
}

export default function PositionsChart({ races }) {
  return (
    <Bar data={{
      labels: races.map(race => race.name),
      datasets: [{
        label: 'Positions',
        data: races.map(race => MAX_Y_AXE_VALUE - race.position),
        fill: false,
        backgroundColor: races
          .map(race => colorByPosition(race.position))
          .map(color => `rgba(${color}, 0.2)`),
        borderColor: races
          .map(race => colorByPosition(race.position))
          .map(color => `rgb(${color})`),
        borderWidth: 2,
        borderRadius: 5,
        tension: 0.1,
      }]
    }}
    options={{
      responsive: true,
      scales: {
        yAxes: {
          display: false,
        },
      },
      animation: {
        onComplete: function onComplete() {
          const chartInstance = this;
          const { ctx } = chartInstance;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function (dataset, i) {
              const meta = chartInstance.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  const data = dataset.data[index];     
                  const position = MAX_Y_AXE_VALUE - data;              
                  ctx.fillText(position, bar.x, bar.y + (position < 18 ? 18 : -5));
              });
          });
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = '';

              if (context.parsed.x != null && races[context.parsed.x]?.time != null) {
                label += `Time : ${races[context.parsed.x].time}`
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
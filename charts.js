// Global ApexCharts Instances
let chartTimeSeriesInstance = null;
let chartDistributionInstance = null;
let chartImportanceInstance = null;
let chartClusteringInstance = null;

// Primary function called to render or update charts
function renderDashboardCharts() {
  const chartOptionsBase = {
    theme: {
      mode: 'dark'
    },
    chart: {
      background: 'transparent',
      foreColor: '#94A3B8',
      toolbar: {
        show: false
      }
    },
    grid: {
      borderColor: '#1E3A5F',
      strokeDashArray: 3,
      padding: {
        left: 45,    // Increased left padding to prevent y-axis titles from cutting off
        right: 20,
        bottom: 25,  // Increased bottom padding for rotated labels
        top: 10
      },
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        show: true
      }
    }
  };

  // 1. CHART 1: SERIES TEMPORALES DE DELITOS
  if (!chartTimeSeriesInstance) {
    const optionsTimeSeries = {
      ...chartOptionsBase,
      chart: {
        ...chartOptionsBase.chart,
        id: 'chart-timeseries-el',
        type: 'line',
        height: '100%',
        dropShadow: {
          enabled: true,
          top: 3,
          left: 2,
          blur: 5,
          opacity: 0.1
        }
      },
      colors: ['#10B981', '#F59E0B', '#EF4444'], // Funza (Green), Mosquera (Amber), Madrid (Red)
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [0, 50, 100]
        }
      },
      markers: {
        size: 4,
        strokeColors: '#0F172A',
        strokeWidth: 2,
        hover: {
          size: 6
        }
      },
      series: [
        {
          name: 'Funza',
          data: [132, 103, 119, 98, 122, 107, 115, 101, 110, 95, 105, 99, 92, 88]
        },
        {
          name: 'Mosquera',
          data: [110, 92, 101, 85, 99, 87, 93, 78, 89, 75, 82, 72, 68, 62]
        },
        {
          name: 'Madrid',
          data: [148, 125, 137, 118, 139, 120, 131, 112, 126, 108, 119, 105, 99, 94]
        }
      ],
      xaxis: {
        categories: [
          'Ene 23', 'Abr 23', 'Jul 23', 'Oct 23',
          'Ene 24', 'Abr 24', 'Jul 24', 'Oct 24',
          'Ene 25', 'Abr 25', 'Jul 25', 'Oct 25',
          'Ene 26 (IA)', 'Abr 26 (IA)'
        ],
        axisBorder: {
          show: true,
          color: '#1E3A5F'
        },
        axisTicks: {
          show: true,
          color: '#1E3A5F'
        }
      },
      yaxis: {
        title: {
          text: 'Cantidad de Incidentes',
          offsetX: -10, // Moves title slightly left for better layout spacing
          style: {
            color: '#94A3B8',
            fontWeight: 500,
            fontFamily: 'Space Grotesk'
          }
        }
      }
    };
    chartTimeSeriesInstance = new ApexCharts(document.querySelector('#chart-timeseries'), optionsTimeSeries);
    chartTimeSeriesInstance.render();
  }

  // 2. CHART 2: DISTRIBUCIÓN DE DELITOS POR MUNICIPIO
  if (!chartDistributionInstance) {
    const optionsDistribution = {
      ...chartOptionsBase,
      chart: {
        ...chartOptionsBase.chart,
        id: 'chart-distribution-el',
        type: 'bar',
        height: '100%',
        stacked: false
      },
      colors: ['#10B981', '#F59E0B', '#EF4444'], // Funza, Mosquera, Madrid
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      series: [
        {
          name: 'Funza',
          data: [3683, 288, 277, 143, 37, 40, 245, 31, 21, 16]
        },
        {
          name: 'Mosquera',
          data: [4684, 384, 258, 174, 72, 69, 342, 61, 23, 18]
        },
        {
          name: 'Madrid',
          data: [3376, 475, 234, 272, 105, 49, 435, 48, 38, 13]
        }
      ],
      xaxis: {
        categories: ['Hurto Personas', 'Hurto Residencias', 'Hurto Comercios', 'Hurto Motocicletas', 'Hurto Automotores', 'Homicidio', 'Amenazas', 'Extorsion', 'Acoso Sexual', 'Otro'],
        axisBorder: {
          show: true,
          color: '#1E3A5F'
        },
        axisTicks: {
          show: true,
          color: '#1E3A5F'
        }
      },
      yaxis: {
        title: {
          text: 'Frecuencia Histórica (Casos)',
          offsetX: -10,
          style: {
            color: '#94A3B8',
            fontWeight: 500,
            fontFamily: 'Space Grotesk'
          }
        }
      }
    };
    chartDistributionInstance = new ApexCharts(document.querySelector('#chart-distribution'), optionsDistribution);
    chartDistributionInstance.render();
  }

  // 3. CHART 3: IMPORTANCIA DE VARIABLES (FEATURE IMPORTANCE)
  if (!chartImportanceInstance) {
    const optionsImportance = {
      ...chartOptionsBase,
      chart: {
        ...chartOptionsBase.chart,
        id: 'chart-importance-el',
        type: 'bar',
        height: '100%'
      },
      colors: ['#00FF87'], // Neon Green Accent
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '60%'
        }
      },
      grid: {
        ...chartOptionsBase.grid,
        padding: {
          ...chartOptionsBase.grid.padding,
          left: 55 // Further increased left padding for longer variable names
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: 'Peso del Predictor (Gini)',
        data: [0.38, 0.28, 0.12, 0.09, 0.06, 0.05, 0.02]
      }],
      xaxis: {
        categories: [
          'Municipio (Espacial)', 
          'Tipología Delito', 
          'Estacionalidad Sen(Mes)', 
          'Estacionalidad Cos(Mes)', 
          'Trimestre Temporal', 
          'Año de Registro', 
          'Día de la Semana'
        ],
        axisBorder: {
          show: true,
          color: '#1E3A5F'
        },
        axisTicks: {
          show: true,
          color: '#1E3A5F'
        },
        labels: {
          formatter: function (val) {
            return (val * 100).toFixed(0) + '%';
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontFamily: 'Outfit',
            fontSize: '11px'
          }
        }
      }
    };
    chartImportanceInstance = new ApexCharts(document.querySelector('#chart-importance'), optionsImportance);
    chartImportanceInstance.render();
  }

  // 4. CHART 4: CLUSTERING JERÁRQUICO (SCATTER PLOT)
  if (!chartClusteringInstance) {
    const optionsClustering = {
      ...chartOptionsBase,
      chart: {
        ...chartOptionsBase.chart,
        id: 'chart-clustering-el',
        type: 'scatter',
        height: '100%',
        zoom: {
          enabled: false
        }
      },
      colors: ['#10B981', '#F59E0B', '#EF4444', '#00E5FF'], // Green (Bajo), Amber (Medio), Red (Alto), Cyan (Tu Predicción)
      markers: {
        size: [5, 5, 5, 9],
        strokeColors: ['#0F172A', '#0F172A', '#0F172A', '#00E5FF'],
        strokeWidth: [2, 2, 2, 3],
        hover: {
          size: [7, 7, 7, 11]
        }
      },
      series: [
        {
          name: 'Clúster Bajo Riesgo',
          data: [
            [10, 12], [12, 15], [15, 14], [18, 11], [22, 16], [25, 13],
            [11, 10], [14, 12], [17, 15], [20, 9], [23, 14], [26, 11]
          ]
        },
        {
          name: 'Clúster Medio Riesgo',
          data: [
            [35, 32], [38, 28], [42, 35], [45, 30], [48, 33], [52, 29],
            [36, 30], [39, 34], [41, 31], [46, 28], [49, 35], [51, 32]
          ]
        },
        {
          name: 'Clúster Alto Riesgo',
          data: [
            [75, 68], [78, 74], [82, 71], [85, 78], [88, 72], [92, 79],
            [76, 75], [79, 70], [81, 73], [84, 76], [89, 71], [91, 77]
          ]
        },
        {
          name: 'Tu Predicción actual (IA)',
          data: []
        }
      ],
      xaxis: {
        tickAmount: 10,
        labels: {
          formatter: function (val) {
            return parseFloat(val).toFixed(0);
          }
        },
        title: {
          text: 'Volumen Incidentes Agrupados',
          style: {
            color: '#94A3B8',
            fontFamily: 'Space Grotesk'
          }
        },
        axisBorder: {
          show: true,
          color: '#1E3A5F'
        },
        axisTicks: {
          show: true,
          color: '#1E3A5F'
        }
      },
      yaxis: {
        tickAmount: 6,
        title: {
          text: 'Dispersión de Categorías',
          offsetX: -10,
          style: {
            color: '#94A3B8',
            fontFamily: 'Space Grotesk'
          }
        }
      }
    };
    chartClusteringInstance = new ApexCharts(document.querySelector('#chart-clustering'), optionsClustering);
    chartClusteringInstance.render();
  }
}

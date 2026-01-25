<template>
    <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { computed } from 'vue'

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        default: ''
    }
})

const chartData = computed(() => ({
    labels: props.data.labels || [],
    datasets: props.data.datasets || []
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                font: {
                    size: 12
                },
                boxWidth: 12,
                padding: 10
            }
        },
        title: {
            display: !!props.title,
            text: props.title,
            font: {
                size: 14,
                weight: 'bold'
            },
            padding: {
                top: 10,
                bottom: 20
            }
        },
        tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1f2937',
            bodyColor: '#374151',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            boxPadding: 6,
            titleFont: {
                size: 12
            },
            bodyFont: {
                size: 12
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(229, 231, 235, 0.5)',
                drawBorder: false
            },
            ticks: {
                font: {
                    size: 11
                },
                padding: 8
            }
        },
        x: {
            grid: {
                color: 'rgba(229, 231, 235, 0.5)',
                drawBorder: false
            },
            ticks: {
                font: {
                    size: 11
                },
                padding: 8
            }
        }
    },
    interaction: {
        intersect: false,
        mode: 'nearest'
    }
}
</script>
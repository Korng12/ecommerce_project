<template>
    <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

    // Register ChartJS components
    ChartJS.register(Title, Tooltip, Legend, ArcElement)

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

    const chartData = {
    labels: props.data.labels || [],
    datasets: props.data.datasets || []
    }

    const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        position: 'right',
        labels: {
            font: {
            size: 11
            },
            boxWidth: 12,
            padding: 10,
            generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                
                return {
                    text: label,
                    fillStyle: style.backgroundColor,
                    strokeStyle: style.borderColor,
                    lineWidth: style.borderWidth,
                    hidden: !chart.getDataVisibility(i),
                    index: i
                };
                });
            }
            return [];
            }
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxPadding: 6,
        callbacks: {
            label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}% (${value.toLocaleString()})`;
            }
        }
        }
    }
}
</script>
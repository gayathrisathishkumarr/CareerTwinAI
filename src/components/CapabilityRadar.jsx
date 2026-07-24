import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { radar } from '../data/mock.js'

export default function CapabilityRadar({ youData = radar.you }) {
  const ref = useRef(null)

  useEffect(() => {
    const chart = new Chart(ref.current, {
      type: 'radar',
      data: {
        labels: radar.labels,
        datasets: [
          {
            label: 'Your twin',
            data: youData,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79,70,229,.18)',
            borderWidth: 2,
            pointBackgroundColor: '#4f46e5',
          },
          {
            label: 'Senior ML target',
            data: radar.target,
            borderColor: '#f59e0b',
            borderDash: [5, 4],
            backgroundColor: 'rgba(245,158,11,.08)',
            borderWidth: 2,
            pointBackgroundColor: '#f59e0b',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false, stepSize: 25 },
            grid: { color: '#eceef6' },
            angleLines: { color: '#eceef6' },
            pointLabels: { font: { size: 12, family: 'Inter' }, color: '#5a6076' },
          },
        },
      },
    })
    return () => chart.destroy()
  }, [youData])

  return (
    <div style={{ position: 'relative', height: 260 }}>
      <canvas
        ref={ref}
        role="img"
        aria-label="Radar of six skill areas comparing you to a senior ML engineer target"
      />
    </div>
  )
}

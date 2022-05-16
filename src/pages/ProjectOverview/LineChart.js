import { Chart, Line, Point, Tooltip, Legend } from 'bizcharts'
const LineChart = () => {
  // 数据源
  const data = [
    {
      month: 'Jan',
      city: 'Tokyo',
      temperature: 7
    },
    {
      month: 'Feb',
      city: 'London',
      temperature: 4.2
    },
    {
      month: 'May',
      city: 'Tokyo',
      temperature: 18.4
    },
    {
      month: 'May',
      city: 'London',
      temperature: 11.9
    },
    {
      month: 'Jun',
      city: 'Tokyo',
      temperature: 21.5
    },
    {
      month: 'Jul',
      city: 'London',
      temperature: 17
    },
    {
      month: 'Aug',
      city: 'Tokyo',
      temperature: 26.5
    },
    {
      month: 'Sep',
      city: 'London',
      temperature: 14.2
    },
    {
      month: 'Oct',
      city: 'Tokyo',
      temperature: 18.3
    },
    {
      month: 'Oct',
      city: 'London',
      temperature: 10.3
    },
    {
      month: 'Dec',
      city: 'Tokyo',
      temperature: 9.6
    },
    {
      month: 'Dec',
      city: 'London',
      temperature: 4.8
    }
  ]

  const scale = {
    temperature: { min: 0 },
    city: {
      formatter: (v) => {
        return {
          London: '新增',
          Tokyo: '完成'
        }[v]
      }
    }
  }

  return (
    <Chart
      scale={scale}
      padding={[50, 20, 60, 40]}
      autoFit
      height={320}
      data={data}
      interactions={['element-active']}>
      <Point position="month*temperature" color="city" shape="circle" />
      <Line
        shape="smooth"
        position="month*temperature"
        color="city"
        label="temperature"
      />
      <Tooltip
        shared
        showCrosshairs
        region={null}
        g2-tooltip-list-item={{ display: 'flex' }}
      />
      <Legend position="top" />
    </Chart>
  )
}
export default LineChart
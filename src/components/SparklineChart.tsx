import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { VictoryAxis, VictoryChart, VictoryLine } from 'victory-native';
import { useTheme } from '../themes/useTheme';
import { View } from 'react-native';

type Props = {
  data: number[];
  changePercent: number;
};

const axisStyles = {
  axis: { stroke: 'transparent' },
  ticks: { stroke: 'transparent' },
  tickLabels: { fill: 'transparent' },
  grid: { stroke: 'transparent' },
};

const SparklineChart: React.FC<Props> = ({ data, changePercent }) => {
  const { colors } = useTheme();
  const chartData = data.map((y, x) => ({ x, y }));
  const minY = Math.min(...data);
  const maxY = Math.max(...data);
  const strokeColor = changePercent >= 0 ? colors.green : colors.graph_red;

  return (
    <View pointerEvents="none">
      <VictoryChart
        width={moderateScale(100)}
        height={moderateScale(37)}
        padding={0}
        domain={{ y: [minY, maxY] }}
      >
        <VictoryAxis style={axisStyles} />
        <VictoryAxis dependentAxis style={axisStyles} />
        <VictoryLine
          data={chartData}
          style={{ data: { stroke: strokeColor, strokeWidth: 1 } }}
        />
      </VictoryChart>
    </View>
  );
};

export default SparklineChart;

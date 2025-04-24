import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { colors } from '../themes/theme';

const CardWrapper = ({ children, width, backgroundColor = '#2B2B2B' }) => {
  const aspectRatio = 1;
  const height = width * aspectRatio;

  return (
    <View style={{ width, height, position: 'relative' }}>
      <Svg width={width} height={height} style={{ position: 'absolute' }}>
        <Rect
          width={width}
          height={height}
          rx={24}
          fill={backgroundColor}
          fillOpacity={0.3}
        />
        <Rect
          x={0.25}
          y={0.25}
          width={width - 0.5}
          height={height - 0.5}
          rx={23.75}
          stroke="url(#paint0_linear)"
          strokeOpacity={0.2}
          strokeWidth={0.5}
        />
        <Defs>
          <LinearGradient
            id="paint0_linear"
            x1={width * (16.3636 / 180)}
            y1={0}
            x2={width * (120.994 / 180)}
            y2={height * (170.184 / 191)}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="white" />
            <Stop offset={0.495} stopColor="white" stopOpacity={0} />
            <Stop offset={1} stopColor="white" stopOpacity={0.6} />
          </LinearGradient>
        </Defs>
      </Svg>
      <View
        style={{
          width,
          height,
          padding: moderateScale(12),
          borderRadius: 20,
          justifyContent: 'space-between',
          backgroundColor: colors.card,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default CardWrapper;
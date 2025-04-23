import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../themes/theme';
import { moderateScale } from 'react-native-size-matters';

const CardWrapper = ({ children, width, backgroundColor = '#2B2B2B' }) => {
  // Calculate height based on the original aspect ratio (191/180)
  const height = (moderateScale(191) / moderateScale(180)) * moderateScale(width) - moderateScale(20);
    
  return (
    <View style={{ width, height, position: 'relative' }}>
      {/* SVG Background */}
      <Svg
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Filled rectangle with dynamic background color */}
        <Rect
          width={width}
          height={height}
          rx={24}
          fill={backgroundColor}
          fillOpacity={0.3}
        />
        {/* Stroke rectangle with gradient */}
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
            x1={(16.3636 / 180) * width}
            y1={0}
            x2={(120.994 / 180) * width}
            y2={(170.184 / 191) * height}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="white" />
            <Stop offset={0.495} stopColor="white" stopOpacity={0} />
            <Stop offset={1} stopColor="white" stopOpacity={0.6} />
          </LinearGradient>
        </Defs>
      </Svg>

      {/* Content Container */}
      <View
        style={{
          width,
          height,
          padding: 20,
          borderRadius: 20,
          justifyContent: 'space-between',
        // //   position: 'absolute',
        //   top: 0,
        //   left: 0,
          backgroundColor: colors.card
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default CardWrapper;
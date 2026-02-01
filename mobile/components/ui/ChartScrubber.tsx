import React, {useMemo, useRef, useState} from 'react';
import {View, PanResponder, StyleSheet, Text, LayoutChangeEvent} from 'react-native';
import Svg, {Path, Rect, Line, Defs, LinearGradient, Stop} from 'react-native-svg';

type Props = {
  data: number[];
  height?: number;
  gradientFrom?: string;
  gradientTo?: string;
};

export default function ChartScrubber({
  data,
  height = 100,
  gradientFrom = '#06D6FF',
  gradientTo = '#3B82F6'
}: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const pts = useMemo(() => {
    if (!data || data.length === 0 || containerWidth === 0) return [];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const w = containerWidth;
    return data.map((v, i) => {
      const x = (i / Math.max(1, data.length - 1)) * w;
      const y = height - ((v - min) / Math.max(1e-6, max - min)) * height;
      return {x, y, v};
    });
  }, [data, containerWidth, height]);

  const d = useMemo(() => {
    if (!pts || pts.length === 0) return '';
    return pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`), '');
  }, [pts]);

  const fillPath = useMemo(() => {
    if (!pts || pts.length === 0) return '';
    const pathStr = pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`), '');
    return `${pathStr} L ${pts[pts.length - 1].x},${height} L ${pts[0].x},${height} Z`;
  }, [pts, height]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const x = e.nativeEvent.locationX;
        updateActive(x);
      },
      onPanResponderMove: (e) => {
        const x = e.nativeEvent.locationX;
        updateActive(x);
      },
      onPanResponderRelease: () => {
        setActiveIndex(null);
      }
    })
  ).current;

  function updateActive(x: number) {
    if (!pts || pts.length === 0) return;
    let closest = 0;
    let best = Math.abs(pts[0].x - x);
    pts.forEach((p, i) => {
      const dist = Math.abs(p.x - x);
      if (dist < best) {
        best = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }

  function onLayout(e: LayoutChangeEvent) {
    setContainerWidth(e.nativeEvent.layout.width);
  }

  return (
    <View onLayout={onLayout} style={[styles.container, {height}]}>
      {containerWidth > 0 && (
        <Svg width={containerWidth} height={height} viewBox={`0 0 ${containerWidth} ${height}`}>
          <Defs>
            <LinearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={gradientFrom} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={gradientTo} stopOpacity="0.05" />
            </LinearGradient>
          </Defs>

          <Path d={fillPath} fill="url(#g)" stroke="none" />

          <Path d={d} fill="none" stroke={gradientFrom} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

          {activeIndex !== null && pts[activeIndex] && (
            <>
              <Line
                x1={pts[activeIndex].x}
                x2={pts[activeIndex].x}
                y1={0}
                y2={height}
                stroke={'rgba(255,255,255,0.35)'}
                strokeWidth={1}
              />
              <Rect
                x={Math.max(4, pts[activeIndex].x - 36)}
                y={Math.max(4, pts[activeIndex].y - 36)}
                width={72}
                height={28}
                rx={6}
                fill={'white'}
                opacity={0.95}
              />
            </>
          )}
        </Svg>
      )}

      <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} pointerEvents="box-only">
        {activeIndex !== null && pts[activeIndex] && (
          <View style={[styles.tooltip, {left: Math.max(8, pts[activeIndex].x)}]}>
            <Text style={styles.tooltipText}>{`Value: ${pts[activeIndex].v}`}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', backgroundColor: 'transparent' },
  tooltip: {
    position: 'absolute',
    top: 8,
    transform: [{translateX: -36}],
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    elevation: 3
  },
  tooltipText: { color: '#000', fontWeight: '700', fontSize: 12 }
});
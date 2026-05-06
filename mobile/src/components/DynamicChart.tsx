import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';

const { width } = Dimensions.get('window');

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface DynamicChartProps {
  title: string;
  data: BarData[];
  type?: 'bar' | 'area';
  color?: string;
}

// Graphique en barres natif (sans librairie externe)
export const DynamicChart: React.FC<DynamicChartProps> = ({
  title, data, type = 'bar', color = Colors.ciOrange,
}) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chart}>
        {data.map((item, i) => {
          const barHeight = Math.max((item.value / maxVal) * 120, 4);
          const barColor = item.color || color;
          return (
            <View key={i} style={styles.barWrapper}>
              <Text style={[styles.barValue, { color: barColor }]}>
                {item.value > 999 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
              </Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    { height: barHeight, backgroundColor: barColor, opacity: 0.85 },
                  ]}
                />
              </View>
              <Text style={styles.barLabel} numberOfLines={1}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Graphique de tendance (ligne simple)
interface TrendChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data, color = Colors.ciOrange, height = 60,
}) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const chartWidth = width - 80;
  const stepX = chartWidth / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => ({
    x: i * stepX,
    y: height - (d.value / maxVal) * height,
  }));

  return (
    <View style={[styles.trendContainer, { height: height + 20 }]}>
      {/* Lignes de grille */}
      {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <View
          key={i}
          style={[styles.gridLine, { top: height * (1 - ratio) }]}
        />
      ))}
      {/* Points et lignes */}
      {points.map((pt, i) => (
        <View key={i}>
          {i > 0 && (
            <View
              style={[
                styles.trendLine,
                {
                  left: points[i - 1].x,
                  top: Math.min(points[i - 1].y, pt.y),
                  width: Math.sqrt(
                    Math.pow(pt.x - points[i - 1].x, 2) +
                    Math.pow(pt.y - points[i - 1].y, 2)
                  ),
                  backgroundColor: color,
                  transform: [{
                    rotate: `${Math.atan2(
                      pt.y - points[i - 1].y,
                      pt.x - points[i - 1].x
                    ) * (180 / Math.PI)}deg`,
                  }],
                },
              ]}
            />
          )}
          <View
            style={[
              styles.trendDot,
              { left: pt.x - 4, top: pt.y - 4, backgroundColor: color },
            ]}
          />
        </View>
      ))}
    </View>
  );
};

// Compteur animé de population
interface PopCounterProps {
  value: number;
  label?: string;
}

export const PopCounter: React.FC<PopCounterProps> = ({ value, label = 'Population estimée' }) => (
  <View style={styles.counterContainer}>
    <Text style={styles.counterLabel}>{label}</Text>
    <Text style={styles.counterValue}>{value.toLocaleString('fr-FR')}</Text>
    <View style={styles.counterDots}>
      {[1, 2, 3].map(i => (
        <View key={i} style={[styles.counterDot, { opacity: 0.3 + i * 0.2 }]} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 160,
    paddingTop: 20,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  barValue: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    width: '70%',
  },
  bar: {
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  trendContainer: {
    position: 'relative',
    marginVertical: 8,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.border,
  },
  trendLine: {
    position: 'absolute',
    height: 2,
    transformOrigin: 'left center',
  },
  trendDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  counterContainer: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: `${Colors.ciOrange}30`,
    borderLeftWidth: 3,
    borderLeftColor: Colors.ciOrange,
  },
  counterLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  counterValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    fontFamily: 'monospace',
  },
  counterDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  counterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.ciOrange,
  },
});



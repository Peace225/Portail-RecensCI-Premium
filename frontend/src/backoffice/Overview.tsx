// src/backoffice/Overview.tsx
import { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Card, Metric, Text, AreaChart, Flex, BadgeDelta, Grid } from "@tremor/react";

const fetchStats = async () => {
  const data: any = await apiService.get('/analytics/dashboard');
  return { total: data?.totalCitizens || data?.total || 0 };
};

const fetchTrend = async () => {
  const data: any = await apiService.get('/analytics/trend');
  return data || [];
};

export const Overview = () => {
  const [data, setData] = useState<{ total: number } | null>(null);
  const [chartdata, setChartdata] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStats(), fetchTrend()])
      .then(([stats, trend]) => {
        setData(stats);
        setChartdata(trend);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Grid numItemsLg={3} className="gap-6">
      <Card decoration="top" decorationColor="purple">
        <Text>Population Totale</Text>
        <Flex justifyContent="start" alignItems="baseline" className="space-x-3">
          <Metric>{isLoading ? "..." : data?.total.toLocaleString()}</Metric>
          <BadgeDelta deltaType="moderateIncrease">+12.3%</BadgeDelta>
        </Flex>
      </Card>
      
      {/* Tremor AreaChart : Ultra propre */}
      <Card className="col-span-2">
        <Text className="font-bold">Flux de Recensement Mensuel</Text>
        <AreaChart
          className="h-72 mt-4"
          data={chartdata}
          index="date"
          categories={["Recensements"]}
          colors={["purple"]}
        />
      </Card>
    </Grid>
  );
};
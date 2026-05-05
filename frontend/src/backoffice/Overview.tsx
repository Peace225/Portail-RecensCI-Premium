// src/backoffice/Overview.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { Card, Metric, Text, AreaChart, Flex, BadgeDelta, Grid } from "@tremor/react";

const fetchStats = async () => {
  const { count } = await supabase.from('citizens').select('*', { count: 'exact', head: true });
  return { total: count || 0 };
};

export const Overview = () => {
  const { data, isLoading } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });

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
          data={chartdata} // Tes données Recharts fonctionnent ici aussi !
          index="date"
          categories={["Recensements"]}
          colors={["purple"]}
        />
      </Card>
    </Grid>
  );
};
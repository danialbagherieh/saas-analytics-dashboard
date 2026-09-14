import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LineChart } from "@mui/x-charts/LineChart";

export default function RevenueTrendChart() {
  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        Revenue Trend
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Last 6 months
      </Typography>

      <LineChart
        xAxis={[
          {
            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            scaleType: "band",
          },
        ]}
        series={[
          {
            label: "Revenue ($)",
            data: [12000, 18000, 14000, 22000, 19000, 26000],
            area: true,
          },
        ]}
        height={280}
      />
    </Box>
  );
}

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";

import type { WeeklySellItem } from "./PieChartWithCenterLabel.tsx";

interface WeeklySellsTableProps {
  weeklySales?: WeeklySellItem[];
  loading?: boolean;
}

const defaultWeeklySales: WeeklySellItem[] = [
  { product: "Social", mon: 5, tue: 7, wed: 6, color: "green" },
  { product: "Search Engines", mon: 10, tue: 8, wed: 9, color: "#1976d2" },
  { product: "Direct", mon: 15, tue: 12, wed: 14, color: "#ffb300" },
  { product: "Other", mon: 20, tue: 18, wed: 19, color: "#d32f2f" },
];

export default function WeeklySellsTable({
  weeklySales = defaultWeeklySales,
  loading = false,
}: WeeklySellsTableProps) {
  if (loading) {
    return (
      <Box sx={{ width: "100%", p: 1 }}>
        <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  const totals = {
    mon: weeklySales.reduce((sum, r) => sum + r.mon, 0),
    tue: weeklySales.reduce((sum, r) => sum + r.tue, 0),
    wed: weeklySales.reduce((sum, r) => sum + r.wed, 0),
  };

  const grandTotal = weeklySales.reduce((s, r) => s + r.mon + r.tue + r.wed, 0);

  const maxRowTotal = Math.max(
    ...weeklySales.map((r) => r.mon + r.tue + r.wed),
  );

  const tableHeight = 120 + weeklySales.length * 35;

  return (
    <Paper
      elevation={4}
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Weekly Sells
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          3-day snapshot · totals shown
        </Typography>
      </Box>

      {/* 🔥 Scroll pattern */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          height: tableHeight,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowX: "scroll",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": { height: 10 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.35)",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          {/* 👇 Fill container when wide, scroll when narrow */}
          <Box sx={{ minWidth: 700, width: "100%", height: "100%" }}>
            <Table
              size="small"
              aria-label="weekly sells table"
              sx={{
                minWidth: 400,
                width: "100%",
                tableLayout: "fixed",
                "& .MuiTableCell-root": {
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "grey.100",
                    "& th": { fontWeight: 700, fontSize: 13 },
                  }}
                >
                  <TableCell sx={{ width: 50 }}>Product</TableCell>
                  <TableCell align="right" sx={{ width: 0 }}>
                    Mon
                  </TableCell>
                  <TableCell align="right" sx={{ width: 0 }}>
                    Tue
                  </TableCell>
                  <TableCell align="right" sx={{ width: 0 }}>
                    Wed
                  </TableCell>
                  <TableCell align="right" sx={{ width: 0 }}>
                    Total
                  </TableCell>
                  <TableCell sx={{ width: 0 }} />
                </TableRow>
              </TableHead>

              <TableBody>
                {weeklySales.map((row, idx) => {
                  const rowTotal = row.mon + row.tue + row.wed;
                  return (
                    <Tooltip
                      key={row.product}
                      title={`Product ${row.product}`}
                      placement="top"
                      arrow
                    >
                      <TableRow
                        hover
                        sx={{
                          backgroundColor: idx % 2 === 0 ? "grey.50" : "white",
                          transition: "background-color 160ms ease",
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Chip
                              size="small"
                              sx={{
                                bgcolor: row.color,
                                color: "#fff",
                                fontWeight: 700,
                                height: 26,
                              }}
                              label={row.product}
                              aria-label={`product ${row.product}`}
                            />
                          </Box>
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontFamily:
                              "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          {row.mon}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontFamily:
                              "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          {row.tue}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontFamily:
                              "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          {row.wed}
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                minWidth: 44,
                                textAlign: "right",
                                fontFamily: "ui-monospace, monospace",
                              }}
                            >
                              {rowTotal}
                            </Typography>
                            <Box sx={{ flex: 1, minWidth: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(rowTotal / maxRowTotal) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 6,
                                  backgroundColor: "grey.200",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: row.color,
                                  },
                                }}
                                aria-label={`progress ${row.product}`}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </Tooltip>
                  );
                })}

                <TableRow
                  sx={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))",
                    "& td": { fontWeight: 800 },
                  }}
                >
                  <TableCell>Total</TableCell>
                  <TableCell align="right">{totals.mon}</TableCell>
                  <TableCell align="right">{totals.tue}</TableCell>
                  <TableCell align="right">{totals.wed}</TableCell>
                  {/* <TableCell align="right"> */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ fontFamily: "ui-monospace, monospace" }}>
                      {grandTotal}
                    </Typography>
                  </Box>
                  {/* </TableCell> */}
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

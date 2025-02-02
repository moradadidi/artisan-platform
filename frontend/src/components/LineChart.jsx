import { ResponsiveLine } from "@nivo/line";
import PropTypes from "prop-types";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { mockLineData } from "../data/mockData";

const MyResponsiveLine = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveLine
    theme={{
        axis: {
            domain: {
                line: {
                    stroke: colors.grey[100],
                },
            },
            legend: {
                text: {
                    fill: colors.grey[100],
                },
            },
            ticks: {
                line: {
                    stroke: colors.grey[100],
                    strokeWidth: 1,
                },
                text: {
                    fill: colors.grey[100],
                },
            },
        },
    }}
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="cardinal"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Transportation",
        legendOffset: 36,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Count",
        legendOffset: -40,
        legendPosition: "middle",
        truncateTickAt: 0,
      }}
      enableGridX={false}
      colors={{ scheme: "category10" }}
      lineWidth={3}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel={(d) => d.yFormatted}
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

MyResponsiveLine.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      color: PropTypes.string,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          y: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default function LineChart() {
  return (
    <div className="lineChart" style={{ width: "100%", height: "100%" }}>
      <MyResponsiveLine data={mockLineData} />
    </div>
  );
}

import { jsx } from "react/jsx-runtime";
import { Chart, LineElement, PointElement, BarElement, ArcElement, LineController, BarController, PolarAreaController, RadialLinearScale, CategoryScale, LinearScale, Tooltip, Filler, Legend } from "chart.js";
import { useRef, useEffect } from "react";
import deepMerge from "deepmerge";
Chart.register([
  LineElement,
  PointElement,
  BarElement,
  ArcElement,
  LineController,
  BarController,
  PolarAreaController,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
  Legend
]);
function LazyChart({
  type,
  data,
  options,
  hideLegend
}) {
  const ref = useRef(null);
  const chartRef = useRef();
  useEffect(() => {
    if (ref.current) {
      chartRef.current = new Chart(ref.current, {
        type,
        data,
        options: deepMerge(
          {
            maintainAspectRatio: false,
            animation: {
              duration: 250
            },
            plugins: {
              legend: {
                position: "bottom",
                display: !hideLegend
              },
              tooltip: {
                padding: 16,
                cornerRadius: 4,
                callbacks: {
                  title: ([item]) => {
                    const data2 = item.raw;
                    return data2.tooltipTitle ?? item.label;
                  },
                  label: (item) => {
                    return `  ${item.dataset.label}: ${item.formattedValue}`;
                  }
                }
              }
            }
          },
          options
        )
      });
    }
    return () => {
      var _a;
      (_a = chartRef.current) == null ? void 0 : _a.destroy();
    };
  }, [data, type, options, hideLegend]);
  return /* @__PURE__ */ jsx("canvas", { ref });
}
export {
  LazyChart as default
};
//# sourceMappingURL=lazy-chart-9300132f.mjs.map

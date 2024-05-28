<?php

namespace Common\Admin\Analytics\Actions;

use App\Models\User;
use Common\Database\Metrics\MetricDateRange;
use Illuminate\Support\Arr;

class BuildDemoAnalyticsReport implements BuildAnalyticsReport
{
    protected MetricDateRange $dateRange;

    public function execute(array $params): array
    {
        $this->dateRange = $params['dateRange'];

        return [
            'pageViews' => $this->buildPageviewsMetric(),
            'browsers' => [
                'granularity' => $this->dateRange->granularity,
                'datasets' => [
                    [
                        'label' => __('Sessions'),
                        'data' => $this->buildBrowsersMetric(),
                    ],
                ],
            ],
            'locations' => [
                'granularity' => $this->dateRange->granularity,
                'datasets' => [
                    [
                        'label' => __('Sessions'),
                        'data' => $this->buildLocationsMetric(),
                    ],
                ],
            ],
            'devices' => [
                'granularity' => $this->dateRange->granularity,
                'datasets' => [
                    [
                        'label' => __('Sessions'),
                        'data' => $this->buildDevicesMetric(),
                    ],
                ],
            ],
            'platforms' => [
                'granularity' => $this->dateRange->granularity,
                'datasets' => [
                    [
                        'label' => __('Sessions'),
                        'data' => $this->buildPlatformsMetric(),
                    ],
                ],
            ],
        ];
    }

    public function buildPageviewsMetric(): array
    {
        $current = (new DemoTrend(
            User::query(),
            dateRange: $this->dateRange,
        ))->count();

        $previous = (new DemoTrend(
            User::query(),
            dateRange: $this->dateRange,
        ))->count();

        return [
            'granularity' => $this->dateRange->granularity,
            'total' => array_sum(Arr::pluck($current, 'value')),
            'datasets' => [
                [
                    'label' => __('Current period'),
                    'data' => $current,
                ],
                [
                    'label' => __('Previous period'),
                    'data' => $previous,
                ],
            ],
        ];
    }

    public function buildBrowsersMetric(): array
    {
        return [
            ['label' => 'Chrome', 'value' => random_int(300, 500)],
            ['label' => 'Firefox', 'value' => random_int(200, 400)],
            ['label' => 'IE', 'value' => random_int(100, 150)],
            ['label' => 'Edge', 'value' => random_int(100, 200)],
            ['label' => 'Safari', 'value' => random_int(200, 300)],
        ];
    }

    public function buildDevicesMetric(): array
    {
        return [
            ['label' => 'Mobile', 'value' => random_int(300, 500)],
            ['label' => 'Tablet', 'value' => random_int(200, 400)],
            ['label' => 'Desktop', 'value' => random_int(100, 150)],
        ];
    }

    public function buildPlatformsMetric(): array
    {
        return [
            ['label' => 'Windows', 'value' => random_int(300, 500)],
            ['label' => 'Linux', 'value' => random_int(200, 400)],
            ['label' => 'iOS', 'value' => random_int(100, 150)],
            ['label' => 'Android', 'value' => random_int(100, 150)],
        ];
    }

    public function buildLocationsMetric(): array
    {
        $data = [
            ['label' => 'United States', 'code' => 'US', 'value' => random_int(300, 500)],
            ['label' => 'India', 'code' => 'IN', 'value' => random_int(100, 300)],
            ['label' => 'Russia', 'code' => 'RU', 'value' => random_int(250, 400)],
            ['label' => 'Germany', 'code' => 'DE', 'value' => random_int(200, 500)],
            ['label' => 'France', 'code' => 'FR', 'value' => random_int(150, 300)],
            ['label' => 'Japan', 'code' => 'JP', 'value' => random_int(150, 300)],
            ['label' => 'United Kingdom', 'code' => 'GB', 'value' => random_int(300, 400)],
            ['label' => 'Canada', 'code' => 'CA', 'value' => random_int(100, 150)],
        ];

        $total = array_sum(Arr::pluck($data, 'value'));

        return array_map(function($item) use($total) {
            $item['percentage'] = round($item['value'] / $total * 100, 2);
            return $item;
        }, $data);
    }
}

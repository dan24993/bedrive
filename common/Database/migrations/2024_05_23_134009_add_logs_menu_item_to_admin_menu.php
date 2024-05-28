<?php

use Common\Settings\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $menus = Setting::where('name', 'menus')->first()->value ?? [];

        if ( ! count($menus)) {
          return;
        }

        foreach ($menus as $key => $menu) {
            if ($menu['name'] === 'Admin Sidebar') {
                if (!collect($menu['items'])->contains('label', 'Logs')) {
                    $menus[$key]['items'][] = [
                        'label' => 'Logs',
                        'action' => '/admin/logs',
                        'type' => 'route',
                        'id' => '8j435f',
                        'icon' => [
                            [
                                'tag' => 'path',
                                'attr' => [
                                    'd' =>
                                        'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 14H6v-2h12v2zm0-4H6v-2h12v2zm-3-4H6V7h9v2z',
                                ],
                            ],
                        ],
                    ];

                    Setting::where('name', 'menus')->update([
                        'value' => json_encode($menus),
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

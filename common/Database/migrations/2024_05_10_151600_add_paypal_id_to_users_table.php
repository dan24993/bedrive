<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('users', 'paypal_id')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table
                ->string('paypal_id', 50)
                ->nullable()
                ->unique()
                ->after('stripe_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('paypal_id');
        });
    }
};

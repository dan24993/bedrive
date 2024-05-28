<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('schedule_log', function (Blueprint $table) {
            $table->id();
            $table->string('command')->index();
            $table->text('output')->nullable();
            $table->timestamp('ran_at')->index();
            $table
                ->integer('duration')
                ->unsigned()
                ->index();
            $table->integer('count_in_last_hour')->default(1);
            $table->integer('exit_code')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_log');
    }
};

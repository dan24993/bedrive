<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('outgoing_email_log', function (Blueprint $table) {
            $table->id();
            $table
                ->string('message_id')
                ->unique()
                ->index();
            $table
                ->string('status')
                ->default('not-sent')
                ->index();
            $table->string('from')->index();
            $table->string('to')->index();
            $table->string('subject');
            $table->binary('mime');
            $table
                ->timestamp('created_at')
                ->nullable()
                ->index();
            $table
                ->timestamp('updated_at')
                ->nullable()
                ->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('outgoing_email_log');
    }
};

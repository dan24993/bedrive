<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Laravel\Pulse\Support\PulseMigration;

return new class extends PulseMigration {
    protected string|null $forcedDriver = null;

    protected function driver(): string
    {
        if ($this->forcedDriver) {
            return $this->forcedDriver;
        }

        return DB::connection($this->getConnection())->getDriverName();
    }

    public function up(): void
    {
        if (!$this->shouldRun()) {
            return;
        }

        // catch syntax error if user mysql version does not support md5 and fallback to simple string
        try {
            $this->runPulseMigrations();
        } catch (Exception $e) {
            $this->forcedDriver = 'sqlite';
            $this->runPulseMigrations();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pulse_values');
        Schema::dropIfExists('pulse_entries');
        Schema::dropIfExists('pulse_aggregates');
    }

    protected function runPulseMigrations()
    {
        Schema::create('pulse_values', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('timestamp');
            $table->string('type');
            $table->mediumText('key');
            match ($this->driver()) {
                'mariadb', 'mysql' => $table
                    ->char('key_hash', 16)
                    ->charset('binary')
                    ->virtualAs('unhex(md5(`key`))'),
                'pgsql' => $table
                    ->uuid('key_hash')
                    ->storedAs('md5("key")::uuid'),
                'sqlite' => $table->string('key_hash'),
            };
            $table->mediumText('value');

            $table->index('timestamp'); // For trimming...
            $table->index('type'); // For fast lookups and purging...
            $table->unique(['type', 'key_hash']); // For data integrity and upserts...
        });

        Schema::create('pulse_entries', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('timestamp');
            $table->string('type');
            $table->mediumText('key');
            match ($this->driver()) {
                'mariadb', 'mysql' => $table
                    ->char('key_hash', 16)
                    ->charset('binary')
                    ->virtualAs('unhex(md5(`key`))'),
                'pgsql' => $table
                    ->uuid('key_hash')
                    ->storedAs('md5("key")::uuid'),
                'sqlite' => $table->string('key_hash'),
            };
            $table->bigInteger('value')->nullable();

            $table->index('timestamp'); // For trimming...
            $table->index('type'); // For purging...
            $table->index('key_hash'); // For mapping...
            $table->index(['timestamp', 'type', 'key_hash', 'value']); // For aggregate queries...
        });

        Schema::create('pulse_aggregates', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('bucket');
            $table->unsignedMediumInteger('period');
            $table->string('type');
            $table->mediumText('key');
            match ($this->driver()) {
                'mariadb', 'mysql' => $table
                    ->char('key_hash', 16)
                    ->charset('binary')
                    ->virtualAs('unhex(md5(`key`))'),
                'pgsql' => $table
                    ->uuid('key_hash')
                    ->storedAs('md5("key")::uuid'),
                'sqlite' => $table->string('key_hash'),
            };
            $table->string('aggregate');
            $table->decimal('value', 20, 2);
            $table->unsignedInteger('count')->nullable();

            $table->unique([
                'bucket',
                'period',
                'type',
                'aggregate',
                'key_hash',
            ]); // Force "on duplicate update"...
            $table->index(['period', 'bucket']); // For trimming...
            $table->index('type'); // For purging...
            $table->index(['period', 'type', 'aggregate', 'bucket']); // For aggregate queries...
        });
    }
};

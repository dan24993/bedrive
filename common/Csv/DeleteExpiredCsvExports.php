<?php

namespace Common\Csv;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class DeleteExpiredCsvExports extends Command
{
    protected $signature = 'csvExports:delete';
    protected $description = 'Deleted csv exports that are expired.';

    public function handle(): int
    {
        $count = 0;

        CsvExport::where(
            'created_at',
            '<',
            Carbon::now()->addDays(-1),
        )->chunkById(10, function (Collection $chunk) use ($count) {
            $count += $chunk->count();
            CsvExport::whereIn('id', $chunk->pluck('id'))->delete();
            $filePaths = $chunk->map(function (CsvExport $export) {
                return $export->filePath();
            });
            Storage::delete($filePaths);
        });

        $this->info("Deleted $count expired csv exports");

        return Command::SUCCESS;
    }
}

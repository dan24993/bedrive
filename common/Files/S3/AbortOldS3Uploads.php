<?php

namespace Common\Files\S3;

use Carbon\Carbon;
use Error;
use Illuminate\Console\Command;
use Illuminate\Filesystem\AwsS3V3Adapter;
use Illuminate\Support\Facades\Storage;

class AbortOldS3Uploads extends Command
{
    use InteractsWithS3Api;

    protected $signature = 's3:abort_expired';

    protected $description = 'Abort and delete expired S3 file uploads';

    public function handle(): int
    {
        try {
            $client = $this->getClient();
        } catch (Error $e) {
            // if s3 is not configured or enabled, bail
            $this->error(
                'S3 is not configured or not selected as storage method in settings page.',
            );
            return 0;
        }

        $data = $client->listMultipartUploads([
            'Bucket' => $this->getBucket(),
        ]);

        $uploads = $data['Uploads'] ?: [];

        foreach ($uploads as $upload) {
            $createdAt = Carbon::parse($upload['Initiated']);

            if ($createdAt->lessThanOrEqualTo(Carbon::now()->subDay())) {
                $client->abortMultipartUpload([
                    'Bucket' => $this->getBucket(),
                    'Key' => $upload['Key'],
                    'UploadId' => $upload['UploadId'],
                ]);
            }
        }

        $this->info('Expired uploads deleted from S3');

        return Command::SUCCESS;
    }

    protected function getDiskName(): string
    {
        if (Storage::disk('uploads') instanceof AwsS3V3Adapter) {
            return 'uploads';
        }
        return 'public';
    }
}

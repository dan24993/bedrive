<?php namespace Common\Settings;

use Dotenv\Dotenv;
use Dotenv\Repository\RepositoryBuilder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class DotEnvEditor
{
    public function __construct(protected string $fileName = '.env')
    {
    }

    public function load(): array
    {
        $dotEnv = Dotenv::create(
            RepositoryBuilder::createWithNoAdapters()->make(),
            [base_path()],
            $this->fileName,
        );
        $values = $dotEnv->load();
        $lowercaseValues = [];

        foreach ($values as $key => $value) {
            if (strtolower($value) === 'null') {
                $lowercaseValues[strtolower($key)] = null;
            } elseif (strtolower($value) === 'false') {
                $lowercaseValues[strtolower($key)] = false;
            } elseif (strtolower($value) === 'true') {
                $lowercaseValues[strtolower($key)] = true;
            } elseif (preg_match('/\A([\'"])(.*)\1\z/', $value, $matches)) {
                $lowercaseValues[strtolower($key)] = $matches[2];
            } else {
                $lowercaseValues[strtolower($key)] = $value;
            }
        }

        return $lowercaseValues;
    }

    public function write(array|Collection $values = []): void
    {
        $content = file_get_contents(base_path($this->fileName));

        foreach ($values as $key => $value) {
            $value = $this->formatValue($value);
            $key = strtoupper($key);

            if (Str::contains($content, $key . '=')) {
                preg_match("/($key=)(.*?)(\n|\Z)/msi", $content, $matches);
                $content = str_replace(
                    $matches[1] . $matches[2],
                    $matches[1] . $value,
                    $content,
                );
            } else {
                $content .= "\n$key=$value";
            }
        }

        file_put_contents(base_path($this->fileName), $content);
    }

    /**
     * Format specified value to be compatible with .env file
     */
    private function formatValue(mixed $value = null): string
    {
        if ($value === 0 || $value === false) {
            $value = 'false';
        }
        if ($value === 1 || $value === true) {
            $value = 'true';
        }
        if (!$value) {
            $value = 'null';
        }
        $value = trim($value);

        // wrap string in quotes, if it contains whitespace or special characters
        if (preg_match('/\s/', $value) || Str::contains($value, '#')) {
            //replace double quotes with single quotes
            $value = str_replace('"', "'", $value);

            //wrap string in quotes
            $value = '"' . $value . '"';
        }

        return $value;
    }
}

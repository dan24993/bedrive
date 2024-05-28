<?php

namespace Common\Database\Traits;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

trait AddsIndexToExistingTable
{
    protected function addIndexIfDoesNotExist(Blueprint $table, string $column) {
        $prefix = Schema::getConnection()->getTablePrefix();
        $sm = Schema::getConnection()->getDoctrineSchemaManager();
        $tableName = "{$prefix}{$table->getTable()}";
        $indexesFound = $sm->listTableIndexes($tableName);
        if (!array_key_exists("{$tableName}_{$column}_index", $indexesFound)) {
            $table->index($column);
        }
    }

}

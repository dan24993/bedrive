<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateFollowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('follows')) {
            return;
        }

        Schema::create('follows', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('follower_id');
            $table->integer('followed_id');
            $table->timestamps();

            $table->unique(['follower_id', 'followed_id']);

            $table->collation = config('database.connections.mysql.collation');
            $table->charset = config('database.connections.mysql.charset');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('follows');
    }
}

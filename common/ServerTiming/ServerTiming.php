<?php

namespace Common\ServerTiming;

use Symfony\Component\Stopwatch\Stopwatch;

class ServerTiming
{
    protected array $finishedEvents = [];
    protected array $startedEvents = [];

    public function __construct(protected Stopwatch $stopwatch)
    {
    }

    public function addMetric(string $metric)
    {
        $this->finishedEvents[$metric] = null;

        return $this;
    }

    public function hasStartedEvent(string $key): bool
    {
        return array_key_exists($key, $this->startedEvents);
    }

    public function measure(string $key): static
    {
        if (!$this->hasStartedEvent($key)) {
            return $this->start($key);
        }

        return $this->stop($key);
    }

    public function start(string $key): static
    {
        $this->stopwatch->start($key);

        $this->startedEvents[$key] = true;

        return $this;
    }

    public function stop(string $key): static
    {
        if ($this->stopwatch->isStarted($key)) {
            $event = $this->stopwatch->stop($key);

            $this->setDuration($key, $event->getDuration());

            unset($this->startedEvents[$key]);
        }

        return $this;
    }

    public function stopAllUnfinishedEvents(): void
    {
        foreach (array_keys($this->startedEvents) as $startedEventName) {
            $this->stop($startedEventName);
        }
    }

    public function setDuration(string $key, $duration): static
    {
        if (is_callable($duration)) {
            $this->start($key);

            call_user_func($duration);

            $this->stop($key);
        } else {
            $this->finishedEvents[$key] = $duration;
        }

        return $this;
    }

    public function getDuration(string $key)
    {
        return $this->finishedEvents[$key] ?? null;
    }

    public function events(): array
    {
        return $this->finishedEvents;
    }
}

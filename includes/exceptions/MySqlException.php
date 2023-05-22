<?php

namespace exceptions;

use Exception;
use Throwable;

class MySqlException extends Exception
{
    protected $code = 500;

    public function __construct(string $message = "", int $code = 0, ?Throwable $previous = null)
    {
        http_response_code($code);
        parent::__construct($message, $code, $previous);
    }
}
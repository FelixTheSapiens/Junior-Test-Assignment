<?php

/**
 * Summary of autoloader
 * @param string $class
 * @throws Exception
 * @return void
 */
function autoloader(string $class) {
    // Validate that the class name contains only alphanumeric characters, underscores, and backslashes
    if (!preg_match('/^[a-zA-Z0-9_\\\\]+$/', $class)) {
        throw new Exception('Invalid class name: ' . $class);
    }

    $path = str_replace('\\', '/', $class) . '.php';
    $fileName = realpath($_SERVER["DOCUMENT_ROOT"] . '/includes/' . $path);

    if (strpos($fileName, $_SERVER["DOCUMENT_ROOT"] . '/includes/') !== 0) {
        throw new Exception('Class file not found: ' . $class);
    }

    if (file_exists($fileName)) {
        require_once($fileName);
    }
}

spl_autoload_register('autoloader');
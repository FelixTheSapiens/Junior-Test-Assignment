<?php

namespace controllers;

use configs\MysqlConfig;
use exceptions\MySqlException;
use mysqli;

class DatabaseController
{
    private mysqli $connection;

    /**
     * @throws MySqlException
     * Performs MySQL connection using default config
     */
    public function __construct()
    {
        $configs = new MysqlConfig();
        $defaultConfig = $configs->getConfig('default');
        $this->connection = new mysqli($defaultConfig['host'], $defaultConfig['login'], $defaultConfig['password'], $defaultConfig['dataBase']);

        if ($this->connection->connect_error) {
            throw new MySqlException($this->connection->connect_error);
        }
    }

    /**
     * @param string $sku
     * @param string $name
     * @param string $price
     * @param string $type
     * @param string $additional
     * @return void
     * @throws MySqlException
     */
    public function appendItem(string $sku, string $name, string $price, string $type, string $additional): void
    {
        $statement = $this->connection->prepare("INSERT INTO `Items` (sku, name, price, type, additional) VALUES (?, ?, ?, ?, ?)");
        $statement->bind_param("sssss", $sku, $name, $price, $type, $additional);
        $succeed = $statement->execute();
        if (!$succeed) {
            throw new MySqlException("Failed to save item: ($sku, $name, $price, $type, $additional)");
        }
    }

    /**
     * @param string $json - JSON encoded array of item ID's to remove
     * @return void
     * @throws MySqlException
     */
    public function removeItem(string $json): void
    {
        $ids = json_decode($json, true);
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $statement = $this->connection->prepare("DELETE FROM Items WHERE id IN ($placeholders)");
        if (!$statement) {
            throw new MySqlException('Failed to prepare statement');
        }
        $types = str_repeat('i', count($ids));
        $statement->bind_param($types, ...$ids);
        if (!$statement->execute()) {
            throw new MySqlException('Failed to remove item');
        }
        $statement->close();
    }

    /**
     * @return string - JSON encoded array of items
     * @throws MySqlException
     */
    public function getItemsJson(): string
    {
        $queryString = 'SELECT * FROM `Items`';
        $result = $this->connection->query($queryString);
        if ($result === false) {
            throw new MySqlException('Failed to fetch items');
        }
        $jsonArray = array('items' => array());
        while ($row = $result->fetch_assoc()) {
            $jsonArray['items'][] = $row;
        }
        return json_encode($jsonArray);
    }

    /**
     * @param string $sku
     * @return string - JSON encoded bool. True if SKU is unique, False - if not
     */
    public function isUniqueSku(string $sku): string
    {
        $queryString = "SELECT id FROM `Items` WHERE sku = ?";
        $statement = $this->connection->prepare($queryString);
        $statement->bind_param("s", $sku);
        $statement->execute();
        $result = $statement->get_result();

        if (mysqli_num_rows($result) == 0) {
            return json_encode(true);
        } else {
            return json_encode(false);
        }
    }
}
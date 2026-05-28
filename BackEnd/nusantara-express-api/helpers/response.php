<?php

function jsonResponse($success, $message, $data = null, $statusCode = 200)
{
    http_response_code($statusCode);
    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ]);

    exit;
}

function getJsonInput()
{
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    return is_array($data) ? $data : [];
}
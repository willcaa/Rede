<?php
$tmp_name = $_FILES['imagem']['tmp_name'];
$uploads_dir = 'uploads';
$final = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
$ext = explode("?", $final);
$name = basename($_FILES['imagem']['name']);
if (move_uploaded_file($tmp_name, "$uploads_dir/$name")) {
    return true;
} else {
    return false;
}


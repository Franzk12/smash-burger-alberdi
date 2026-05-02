@echo off
title Iniciador de Smash Burger
color 0A

echo ===================================================
echo     INICIANDO EL SISTEMA DE SMASH BURGER
echo ===================================================
echo.
echo Iniciando el servidor de la pagina web...
start "Smash Burger - Pagina Web" cmd /k "npm start"

echo Iniciando el Bot de WhatsApp...
start "Smash Burger - WhatsApp Bot" cmd /k "cd smash-bot && npm start"

echo.
echo ¡El sistema esta en marcha! 
echo Se han abierto dos ventanas negras (consola). 
echo * Una mantiene la pagina web activa.
echo * La otra mantiene el bot de WhatsApp activo (y te mostrara el QR si hace falta).
echo.
echo NOTA: Puedes minimizar esas ventanas, pero NO las cierres o se apagara el sistema.
echo ===================================================
timeout /t 5
exit

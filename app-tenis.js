


const canvas = document.querySelector('canvas'); // Znalezienie elementu canvas w dokumencie
        const ctx = canvas.getContext('2d'); // Pobranie kontekstu rysowania 2D

        canvas.width = 1000; // Ustawienie szerokości canvas
        canvas.height = 500; // Ustawienie wysokości canvas

        const cw = canvas.width; // Przypisanie szerokości canvas do zmiennej cw
        const ch = canvas.height; // Przypisanie wysokości canvas do zmiennej ch

        const ballSize = 10; // Wielkość piłki
        let ballX = cw / 2 // Początkowa pozycja X piłki
        let ballY = ch / 2 // Początkowa pozycja Y piłki

        const paddelHeight = 100; // Wysokość paletki
        const paddelWidth = 20; // Szerokość paletki

        const playerX = 70; // Początkowa pozycja X gracza
        const aiX = 910; // Początkowa pozycja X komputera

        let playerY = 200; // Początkowa pozycja Y gracza
        let aiY = 200; // Początkowa pozycja Y komputera

        const lineWidth = 6;
        const lineHeight = 16;

        let ballSpeedX = 5; // Prędkość X piłki
        let ballSpeedY = 5; // Prędkość Y piłki
        
        let playerScore = 0; // Początkowy wynik gracza
        let aiScore = 0; // Początkowy wynik komputera

        function roundRect(ctx, x, y, width, height, radius) { // Funkcja do rysowania zaokrąglonych prostokątów
            ctx.beginPath(); // Rozpoczęcie ścieżki rysowania
            ctx.moveTo(x + radius, y); 
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath(); // Zamknięcie ścieżki
            ctx.fill(); // Wypełnienie kształtu
        }

        function table() { // Funkcja do rysowania tła gry
            const backgroundImage = new Image(); // Utworzenie nowego obiektu obrazka
            backgroundImage.src = 'kort.jpg'; // Ustawienie ścieżki do obrazka

            backgroundImage.onload = function() { // Wywołanie, gdy obrazek zostanie załadowany
                ctx.drawImage(backgroundImage, 0, 0, cw, ch); // Narysowanie obrazka na canvas
                
                for (let linePosition = 20; linePosition < ch; linePosition += 30) {
                    ctx.fillStyle = "gray"
                    ctx.fillRect(cw / 2, linePosition, lineWidth, lineHeight)
                }
                ball(); // Wywołanie funkcji do rysowania piłki
                player(); // Wywołanie funkcji do rysowania gracza
                ai(); // Wywołanie funkcji do rysowania komputera
                aiPosition();
                updateScore(); // Wywołanie funkcji do aktualizacji wyniku
            };
        }  

        function ball() { // Funkcja do rysowania piłki
    ctx.beginPath(); // Rozpoczęcie ścieżki rysowania
    ctx.arc(ballX, ballY, ballSize, 0, 2 * Math.PI, false); // Narysowanie okręgu reprezentującego piłkę
    ctx.fillStyle = '#00FF00'; // Ustawienie koloru wypełnienia piłki
    ctx.fill(); // Wypełnienie piłki kolorem
    ctx.lineWidth = 2; // Ustawienie grubości obramowania piłki
    ctx.strokeStyle = 'white'; // Ustawienie koloru obramowania piłki
    ctx.stroke(); // Narysowanie obramowania piłki

    ballX += ballSpeedX; // Aktualizacja pozycji X piłki
    ballY += ballSpeedY; // Aktualizacja pozycji Y piłki

    // Sprawdzenie czy piłka uderzyła w lewą krawędź boiska z marginesem błędu
    if (ballX - ballSize <= 0 + Math.abs(ballSpeedX)) {
        aiScore++; // Zwiększenie punktacji dla AI
        resetBall(); // Resetowanie pozycji piłki i jej prędkości
    }
    // Sprawdzenie czy piłka uderzyła w prawą krawędź boiska z marginesem błędu
    else if (ballX + ballSize >= cw - Math.abs(ballSpeedX)) {
        playerScore++; // Zwiększenie punktacji dla gracza
        resetBall(); // Resetowanie pozycji piłki i jej prędkości
    }

    // Warunek na wyświetlenie komunikatu o zwycięstwie
    if (playerScore === 3) {
        alert("Gracz wygrał!");
        document.getElementById("tenisSound").play(); // Odtwarzanie dźwięku "tenis.mp3"
        resetGame();
    } else if (aiScore === 3) {
        alert("IGA wygrała!");
        document.getElementById("tenisSound").play(); // Odtwarzanie dźwięku "tenis.mp3"
        resetGame();
    }



    // Odbicie piłki od górnej i dolnej krawędzi boiska
    if (ballY <= 0 + ballSize || ballY + ballSize >= ch) {
        ballSpeedY = -ballSpeedY;
        speedUp(); // Wywołanie funkcji speedUp() po kolizji piłki z górną lub dolną krawędzią boiska
    }

    if (ballX - ballSize <= playerX + paddelWidth &&
    ballY >= playerY &&
    ballY <= playerY + paddelHeight &&
    ballSpeedX < 0) {
    ballSpeedX = -ballSpeedX;
}

// Kolizja piłki z paletką komputera
if (ballX + ballSize >= aiX &&
    ballY >= aiY &&
    ballY <= aiY + paddelHeight &&
    ballSpeedX > 0) {
    ballSpeedX = -ballSpeedX;
}
}


        function resetBall() { // Funkcja resetująca pozycję piłki
            ballX = cw / 2; // Resetowanie pozycji X piłki
            ballY = ch / 2; // Resetowanie pozycji Y piłki
            ballSpeedX = -ballSpeedX; // Zmiana kierunku przemieszczania się piłki
            ballSpeedX = 5; // Resetowanie prędkości X piłki
            ballSpeedY = 5; // Resetowanie prędkości Y piłki
            updateScore(); // Aktualizacja wyniku
        }

        function resetGame() { // Funkcja resetująca grę
            playerScore = 0; // Zresetowanie wyniku gracza
            aiScore = 0; // Zresetowanie wyniku AI
            resetBall(); // Resetowanie pozycji piłki
        }

        function updateScore() { // Funkcja do aktualizacji wyniku
            const scoreElement = document.getElementById('score');
            scoreElement.innerText = `Gracz: ${playerScore} - IGA: ${aiScore}`; // Uaktualnienie tekstu wyniku
        }

        function player() { // Funkcja do rysowania gracza
            ctx.fillStyle = '#082E79'; // Ustawienie koloru wypełnienia paletki gracza
            roundRect(ctx, playerX, playerY, paddelWidth, paddelHeight, 10); // Narysowanie paletki gracza

            // Odbicie piłki od paletki gracza z marginesem błędu
    if (ballX - ballSize <= playerX + paddelWidth + Math.abs(ballSpeedX) &&
        ballY >= playerY - ballSize &&
        ballY <= playerY + paddelHeight + ballSize) {
        ballSpeedX = -ballSpeedX;
    }
        }

        function ai() { // Funkcja do rysowania komputera
            ctx.fillStyle = '#DC143C'; // Ustawienie koloru wypełnienia paletki komputera
            roundRect(ctx,aiX, aiY, paddelWidth, paddelHeight, 10); // Narysowanie paletki komputera
            
            // Odbicie piłki od paletki AI z marginesem błędu
    if (ballX + ballSize >= aiX - Math.abs(ballSpeedX) &&
        ballY <= aiY + paddelHeight + ballSize &&
        ballY >= aiY - ballSize) {
        ballSpeedX = -ballSpeedX;
    }
        }

        topCanvas = canvas.offsetTop;

        function playerPosition(e) {
            playerY = e.clientY - topCanvas - paddelHeight / 2; // Dodanie połowy wysokości paletki do pozycji gracza
        
            // Sprawdzenie, czy pozycja gracza nie wychodzi poza obszar gry
            if (playerY >= ch - paddelHeight) {
                playerY = ch - paddelHeight;
            }
        
            if (playerY <= 0) {
                playerY = 0;
            }
        }
        

        function speedUp() {
            //Speed X
            if(ballSpeedX > 0 && ballSpeedX < 16) {
                ballSpeedX += 0.3;
            } else if (ballSpeedX < 0 && ballSpeedX > -16)
            {
                ballSpeedX -= 0.1;
            }
            //Speed Y
            if(ballSpeedY > 0 && ballSpeedY < 16) {
                ballSpeedY += 0.1;
            } else if (ballSpeedY < 0 && ballSpeedY > -16)
            {
                ballSpeedY -= 0.2;
            }
        }

        //ruch ai
        function aiPosition() {
            var middlePaddel = aiY + paddelHeight / 2;
            var middleBall = ballY + ballSize / 2; 

            if(ballX >500) {
                if(middlePaddel - middleBall > 200) {
                    aiY -= 25;
                } else if(middlePaddel - middleBall > 50) {
                    aiY -= 10;
                }

                else if(middlePaddel - middleBall < -200) {
                    aiY += 25;;
                }  
                else if(middlePaddel - middleBall < -50) {
                    aiY += 10;
                } 
            }

            else if (ballX <= 500 && ballX > 150) {
                if (middlePaddel - middleBall > 100) {
                    aiY -= 3 }

                else if (middlePaddel - middleBall < -100) {
                    aiY +=3
                }
            }
        }

        canvas.addEventListener("mousemove", playerPosition)

        function gameLoop() { // Funkcja pętli gry
            table(); // Wywołanie funkcji do rysowania tła gry
            requestAnimationFrame(gameLoop); // Wywołanie kolejnej klatki animacji
        }

        gameLoop(); // Rozpoczęcie pętli gry
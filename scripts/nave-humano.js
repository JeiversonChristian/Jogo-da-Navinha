principal()

function principal() {
    let canvas = window.document.getElementById("canvasPrincipal");
    let ctx = canvas.getContext("2d");

    let canvasInfo = window.document.getElementById("canvasInfo");
    let ctxInfo = canvasInfo.getContext("2d");

    let distancia_percorrida = 0;
    let taxa_dificuldade = 0;
    let i = 1; // contador para utilizar na distância percorrida

    let src_nave = "imagens/nave-humano.png";
    let x_inicial_nave = 60;
    let y_inicial_nave = canvas.height-80;
    let impulso_nave = 5; //5
    let src_tiro = "imagens/tiro.png"

    let src_meteoro1 = "imagens/meteoro1.png";
    let taxa_meteoro1 = 1.5;
    let x_inicial_meteroro1 = gerar_n_aleatorio(canvas.width, taxa_meteoro1*canvas.width);
    let y_inicial_meteoro1 = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_meteoro1 = 5; //5

    let src_meteoro2 = "imagens/meteoro2.png";
    let taxa_meteoro2 = 7;
    let x_inicial_meteroro2 = gerar_n_aleatorio(canvas.width, taxa_meteoro2*canvas.width);
    let y_inicial_meteoro2 = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_meteoro2 = 0.5; //0.5

    let src_meteoro3 = "imagens/meteoro3.png";
    let taxa_meteoro3 = 10;
    let x_inicial_meteroro3 = gerar_n_aleatorio(canvas.width, taxa_meteoro3*canvas.width);
    let y_inicial_meteoro3 = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_meteoro3 = 9; //9

    let src_satelite = "imagens/satelite.png";
    let taxa_satelite = 5;
    let x_inicial_satelite = gerar_n_aleatorio(canvas.width, taxa_satelite*canvas.width);
    let y_inicial_satelite = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_satelite = 3; //3

    let src_astronauta = "imagens/astronauta.png";
    let taxa_astronauta = 6;
    let x_inicial_astronauta = gerar_n_aleatorio(canvas.width, taxa_astronauta*canvas.width);
    let y_inicial_astronauta = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_astronauta = 1; //1

    let src_municao = "imagens/municao.png"
    let taxa_municao = 9;
    let x_inicial_municao = gerar_n_aleatorio(canvas.width, taxa_satelite*canvas.width);
    let y_inicial_municao = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_municao = 2; //2

    const imagemFundo = new Image();
    imagemFundo.src = 'imagens/universo.png';

    let apertou_play = false;

    let musica_atual = 1
    const musica1 = new Audio('sons/Flying - Track Tribe.mp3');
    musica1.volume = 0.3;
    const musica2 = new Audio('sons/Hidden Frozen Lake - Go By Ocean _ Ryan McCaffrey.mp3');
    const musica3 = new Audio('sons/Outreach - Go By Ocean _ Ryan McCaffrey.mp3');
    const musica4 = new Audio('sons/Speak The Truth - Go By Ocean _ Ryan McCaffrey.mp3');
    const som_tiro = new Audio('sons/Laser Gun.mp3');
    const som_explosão_forte = new Audio('sons/Big Explosion Cut Off.mp3');
    const som_municao = new Audio('sons/Beep Short .mp3');
    const som_grito = new Audio('sons/Death Impact Yell Single.mp3');

    let musica = musica1;

    function handleClique(event) {
        let largura = 300;
        let altura = 100;
        let x = (canvas.width - largura) / 2;
        let y = (canvas.height - altura) / 2;

        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        // Verifica se o clique ocorreu dentro das coordenadas do retângulo
        if (mouseX >= x && mouseX <= x + largura && mouseY >= y && mouseY <= y + altura) {
            apertou_play = true;
        }
    }

    function desenharBotao() {
        desenhar_fundo();

        // Desenha um retângulo com bordas normais
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;

        // Coordenadas do retângulo
        let largura = 300;
        let altura = 100;
        let x = (canvas.width - largura) / 2;
        let y = (canvas.height - altura) / 2;

        // Desenha as linhas do retângulo
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + largura, y);
        ctx.lineTo(x + largura, y + altura);
        ctx.lineTo(x, y + altura);
        ctx.closePath();

        // Preenche e desenha as bordas do retângulo
        ctx.fill();
        ctx.stroke();

        // Adiciona texto "PLAY" no centro do retângulo
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PLAY", canvas.width / 2, canvas.height / 2);
    }

    function atualizar_dificuldade() {
        if (nave.nave_atingida == false) {
            distancia_percorrida += 1;
            if (distancia_percorrida == 1000*i && i <= 7) {
                i += 1;
                taxa_dificuldade += 0.12;//0.25
                for (obj of objetos) {
                    obj.v += taxa_dificuldade;
                }
            }
        }
    }

    function gerar_n_aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function verificar_colisao(){
        let cont = 1; // para identificar o meteoro gigante
        // objetos atingindo nave
        for (obj of objetos) {
            if ( (obj.x <= nave.x + nave.imagem.width) && ( (nave.y >= obj.y && nave.y <= obj.y + obj.imagem.height) || (nave.y + nave.imagem.height <= obj.y + obj.imagem.height && nave.y + nave.imagem.height >=  obj.y) ) ) {
                if (cont != 4) {
                    som_explosão_forte.play();
                    nave.nave_atingida = true;
                } else {
                    som_municao.play();
                    nave.municao += 3;
                    obj.eh_municao = true;
                }
                if (cont == 1) {
                    som_grito.play();
                }
            }
            // tiro atingindo objetos
            if ( (obj.x <= nave.pos_x_tiro + nave.imagem_tiro.width) && ( (nave.altura_tiro >= obj.y && nave.altura_tiro <= obj.y + obj.imagem.height) || (nave.altura_tiro + nave.imagem_tiro.height <= obj.y + obj.imagem.height && nave.altura_tiro + nave.imagem_tiro.height >=  obj.y) ) ) {
                nave.tiro_acertou = true;
                if (cont != 6 && cont != 4) { // o meteoro gigante é o único que ignora o tiro
                    obj.tiro_acertou = true;
                }
            } 
            cont ++;
        }
    }

    function desenhar_fundo() {
        ctx.drawImage(imagemFundo, 0, 0);
    }

    function desenhar_objetos() {
        nave.desenhar();
        nave.atirar();
        for (obj of objetos) {
            obj.desenhar();
        }   
    }

    let space_acionado = false;
    let k_acionado = false;
    let seta_direita_acionada = false;
    let seta_esquerda_acionada = false;

    function verificar_teclas() {

        window.addEventListener('keydown', function (event) {
            if (event.code === 'Space' && !space_acionado) {
                space_acionado = true;
                nave.nave_pulando = true;
            }
            if (event.key === 'k' && !k_acionado) {
                k_acionado = true;
                nave.pode_atirar = true;
            }
            if (event.key === 'ArrowUp') {
                aumentar_volume();
            }
            if (event.key === 'ArrowDown') {
                diminuir_volume();
            }
            if (event.key === 'ArrowRight' && !seta_direita_acionada) {
                seta_direita_acionada = true;
                trocar_para_proxima_musica();
            }
            if (event.key === 'ArrowLeft' && !seta_esquerda_acionada) {
                seta_esquerda_acionada = true;
                trocar_para_anterior_musica();
            }
        });

        window.addEventListener('keyup', function (event) {
            if (event.code === 'Space') {
                // Redefine a variável de controle quando a tecla é liberada
                space_acionado = false;
                nave.nave_pulando = false;
            }
            if (event.key === 'k') {
                // Redefine a variável de controle quando a tecla é liberada
                k_acionado = false;
                nave.pode_atirar = false;
            }
            if (event.key === 'ArrowRight') {
                // Redefine a variável de controle quando a tecla é liberada
                seta_direita_acionada = false;
            }    
            if (event.key === 'ArrowLeft') {
                // Redefine a variável de controle quando a tecla é liberada
                seta_esquerda_acionada = false;
            }        
        });

    }


    function atualizar_todas_posicoes() {
        nave.atualizar_posicao();
        for (obj of objetos) {
            obj.atualizar_posicao();
        }
    }

    function atualizar_info() {
        ctxInfo.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
        ctxInfo.font = "20px Arial";
        ctxInfo.fillStyle = "white";
        ctxInfo.textAlign = "center";
        ctxInfo.fillText(`Distância percorrida:`, 150, 40);
        ctxInfo.fillText(`${distancia_percorrida}km`, 290, 40);
        ctxInfo.fillText(`Munição:`, 100, 70);
        ctxInfo.fillText(`${nave.municao}`, 165, 70);
        ctxInfo.fillText(`Subir: Aperte [Espaço]`, 495, 40); //395
        ctxInfo.fillText(`Atirar: Aperte [k]`, 465, 70);
        ctxInfo.fillText(`Aumentar / Diminuir música [↑][↓]`, 800, 40);
        ctxInfo.fillText(`Trocar de música [←][→]`, 770, 70);
        ctxInfo.fillText(`Se tiver travando muito, recarregue a página [↻]`, canvasInfo.width / 2, 120);
    }

    function carregar_menu() {
        desenharBotao();
        canvas.addEventListener('mousedown', handleClique);  
    }

    function resetar_nave() {
        nave = new Nave(src_nave,x_inicial_nave,y_inicial_nave,impulso_nave);
    }

    function resetar_objetos() {
        meteoro1 = new Objeto(src_meteoro1,x_inicial_meteroro1,y_inicial_meteoro1,v_meteoro1, taxa_meteoro1);
        meteoro3 = new Objeto(src_meteoro3,x_inicial_meteroro3,y_inicial_meteoro3,v_meteoro3,taxa_meteoro3);
        satelite = new Objeto(src_satelite, x_inicial_satelite, y_inicial_satelite, v_satelite, taxa_satelite);
        astronauta = new Objeto(src_astronauta, x_inicial_astronauta, y_inicial_astronauta, v_astronauta, taxa_astronauta);
        meteoro2 = new Objeto(src_meteoro2, x_inicial_meteroro2, y_inicial_meteoro2, v_meteoro2, taxa_meteoro2);
        municao = new Objeto(src_municao, x_inicial_municao, y_inicial_municao, v_municao, taxa_municao);

        objetos = [astronauta, satelite, meteoro3, municao ,meteoro1, meteoro2];
    }

    function resetar_dados() {
        distancia_percorrida = 0;
    }

    function limparCache() {
        if ('caches' in window) {
            caches.keys().then(function(cacheNames) {
                return Promise.all(cacheNames.map(function(cacheName) {
                    return caches.delete(cacheName);
                }));
            });
        }
    }

    function resetar_game() {
        limparCache();
        apertou_play = false;
        resetar_nave();
        resetar_objetos();
        resetar_dados();
    }

    function aumentar_volume() {
        if (musica.volume < 1.0) {
            musica.volume += 0.0001;
        }
    }

    function diminuir_volume() {
        if (musica.volume > 0.0) {
            musica.volume -= 0.0001;
        }
    }

    function trocar_para_proxima_musica() {
        musica.pause()
        musica.currentTime = 0;

        if (musica_atual + 1 == 5) {
            musica_atual = 1;
        } else { 
            musica_atual += 1;
        }

        switch (musica_atual) {
            case 1:
                musica = musica1;
                break;
            case 2:
                musica = musica2;
                break;
            case 3:
                musica = musica3;
                break;
            case 4:
                musica = musica4;
                break;
            default:
                musica = musica1;
        }
        tocar_musica()
    }
    
    function trocar_para_anterior_musica() {
        musica.pause()
        musica.currentTime = 0;

        if (musica_atual - 1 == 0) {
            musica_atual = 4;
        } else { 
            musica_atual -= 1;
        }
        
        switch (musica_atual) {
            case 1:
                musica = musica1;
                break;
            case 2:
                musica = musica2;
                break;
            case 3:
                musica = musica3;
                break;
            case 4:
                musica = musica4;
                break;
            default:
                musica = musica1;
        }
        
        tocar_musica()
    }

    function tocar_musica() {
        musica.play();
        musica.addEventListener('ended', function() {
            this.currentTime = 0; // Reinicia a reprodução do início quando acaba
            this.play();
        });
    }
    
    function rodar_jogo() {
        if(apertou_play == false) {
            carregar_menu();
        }
        if(apertou_play == true) {
            tocar_musica();     
            atualizar_dificuldade();
            verificar_colisao();
            desenhar_fundo();
            desenhar_objetos();
            verificar_teclas();
            atualizar_todas_posicoes();
            atualizar_info();
            if (nave.nave_atingida == true) {
                resetar_game();
            }
        }
        //requestAnimationFrame(rodar_jogo);
        setTimeout(rodar_jogo, 60); 
    }
    
    class Nave {
        // source, pos_X, pos_y, impulso
        constructor(src,x,y,i) {
            this.src = src;
            this.imagem = new Image();
            this.imagem.src = src;
            this.x = x;
            this.y = y;
            this.i = i;
            this.in = 3; // impulso negativo 3
            this.nave_pulando = false;
            this.nave_atingida = false;
            this.pode_atirar = false;
            this.atirou = false;
            this.altura_tiro;
            this.pos_x_tiro;
            this.vt = 5;
            this.tiro_acertou = false;
            this.imagem_tiro = new Image();
            this.imagem_tiro.src = src_tiro;
            this.municao = 3;
        }

        desenhar() {
            if (this.nave_atingida == false) {
                ctx.drawImage(this.imagem, this.x, this.y);
            } 
        }
        
        atualizar_posicao() {
            if (this.nave_pulando == true) {
                if (this.y > 0) {
                    this.y -= this.i;
                }
            } else if (this.y < y_inicial_nave) {
                this.y += this.in;
            }

            if(this.nave_atingida == true){
                // tira a posição do tiro da tela pra ele não influenciar na colisão
                this.altura_tiro  = -10
                this.pos_x_tiro = -10

                // tira a posição da nave da tela pra ele não influenciar na colisão
                this.x = -10;
                this.y = -10; 
            }
        }

        atirar() {
            if (this.municao > 0 && this.nave_atingida == false) {
                if (this.pode_atirar == true) {
                    if (this.atirou == false) {
                        // carrega o tiro
                        som_tiro.play();
                        this.altura_tiro  = this.y + 20;
                        this.pos_x_tiro = this.x + 85;
                    }
                    if (this.pos_x_tiro <= canvas.width) {
                        this.atirou = true;
                    }
                }
                
                if (this.atirou == true && this.tiro_acertou == false) {
                    ctx.drawImage(this.imagem_tiro, this.pos_x_tiro, this.altura_tiro);
                    this.pos_x_tiro += this.vt;
                }

                if (this.tiro_acertou == true) {
                    // reseta a condição
                    this.tiro_acertou = false;
                    this.atirou = false;
                    // tira uma munição
                    this.municao -= 1;
                    // tira a posição do tiro da tela pra ele não influenciar na colisão
                    this.altura_tiro  = -10
                    this.pos_x_tiro = -10
                }

                if (this.pos_x_tiro > canvas.width) {
                    this.atirou = false;
                    this.tiro_acertou = false;
                    this.municao -= 1;
                    this.altura_tiro  = -10
                    this.pos_x_tiro = -10
                }
            }
        }
    }
    
    class Objeto {
        // source, pos_X, pos_y, velocidade, taxa
        constructor(src,x,y,v,t) {
            this.src = src;
            this.imagem = new Image();
            this.imagem.src = src;
            this.x = x;
            this.y = y;
            this.v = v;
            this.t = t;
            this.tiro_acertou = false;
            this.eh_municao = false; 
        }
        
        desenhar() {
            if(this.x <= canvas.width){
                ctx.drawImage(this.imagem, this.x, this.y);
            }
        }
        
        atualizar_posicao() {
            this.x -= this.v;
            if ((this.x + this.imagem.width < -5) || (this.tiro_acertou == true)) {
                this.x = gerar_n_aleatorio(canvas.width, this.t*canvas.width);
                this.y = gerar_n_aleatorio(0, canvas.height-85+1);
                this.tiro_acertou = false;
            }
            if  (this.eh_municao == true) {
                this.eh_municao = false;
                this.x = gerar_n_aleatorio(canvas.width, this.t*canvas.width);
                this.y = gerar_n_aleatorio(0, canvas.height-85+1);
            }
        }
    }
    
    let nave = new Nave(src_nave,x_inicial_nave,y_inicial_nave,impulso_nave);

    let meteoro1 = new Objeto(src_meteoro1,x_inicial_meteroro1,y_inicial_meteoro1,v_meteoro1, taxa_meteoro1);
    let meteoro3 = new Objeto(src_meteoro3,x_inicial_meteroro3,y_inicial_meteoro3,v_meteoro3,taxa_meteoro3);
    let satelite = new Objeto(src_satelite, x_inicial_satelite, y_inicial_satelite, v_satelite, taxa_satelite);
    let astronauta = new Objeto(src_astronauta, x_inicial_astronauta, y_inicial_astronauta, v_astronauta, taxa_astronauta);
    let meteoro2 = new Objeto(src_meteoro2, x_inicial_meteroro2, y_inicial_meteoro2, v_meteoro2, taxa_meteoro2);
    let municao = new Objeto(src_municao, x_inicial_municao, y_inicial_municao, v_municao, taxa_municao);

    let objetos = [astronauta, satelite, meteoro3, municao ,meteoro1, meteoro2];

    imagemFundo.onload = nave.imagem.onload = objetos[0].imagem.onload = objetos[1].imagem.onload = objetos[2].imagem.onload = objetos[3].imagem.onload = objetos[4].imagem.onload = rodar_jogo;
}
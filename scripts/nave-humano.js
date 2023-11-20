principal()

function principal() {
    let canvas = window.document.getElementById("canvasPrincipal");
    let ctx = canvas.getContext("2d");

    let src_nave = "imagens/nave-humano.png";
    let x_inicial_nave = 10;
    let y_inicial_nave = canvas.height-53;
    let impulso_nave = 5;
    let src_tiro = "imagens/tiro.png"

    let src_meteoro1 = "imagens/meteoro1.png";
    let taxa_meteoro1 = 1.5;
    let x_inicial_meteroro1 = gerar_n_aleatorio(canvas.width, taxa_meteoro1*canvas.width);
    let y_inicial_meteoro1 = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_meteoro1 = 5;

    let src_meteoro2 = "imagens/meteoro2.png";
    let taxa_meteoro2 = 7;
    let x_inicial_meteroro2 = gerar_n_aleatorio(canvas.width, taxa_meteoro2*canvas.width);
    let y_inicial_meteoro2 = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_meteoro2 = 0.5;

    let src_meteoro3 = "imagens/meteoro3.png";
    let taxa_meteoro3 = 10;
    let x_inicial_meteroro3 = gerar_n_aleatorio(canvas.width, taxa_meteoro3*canvas.width);
    let y_inicial_meteoro3 = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_meteoro3 = 9;

    let src_satelite = "imagens/satelite.png";
    let taxa_satelite = 5;
    let x_inicial_satelite = gerar_n_aleatorio(canvas.width, taxa_satelite*canvas.width);
    let y_inicial_satelite = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_satelite = 3;

    let src_astronauta = "imagens/astronauta.png";
    let taxa_astronauta = 6;
    let x_inicial_astronauta = gerar_n_aleatorio(canvas.width, taxa_astronauta*canvas.width);
    let y_inicial_astronauta = gerar_n_aleatorio(0, canvas.height-85+1);
    let v_astronauta = 1;

    const imagemFundo = new Image();
    imagemFundo.src = 'imagens/universo.png';

    function gerar_n_aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function verificar_colisao(){
        for (obj of objetos){
            if ( (obj.x <= nave.x + nave.imagem.width) && ( (nave.y >= obj.y && nave.y <= obj.y + obj.imagem.height) || (nave.y + nave.imagem.height <= obj.y + obj.imagem.height && nave.y + nave.imagem.height >=  obj.y) ) ) {
                nave.nave_atingida = true;
            }
            if ( (obj.x <= nave.pos_x_tiro + nave.imagem_tiro.width) && ( (nave.altura_tiro >= obj.y && nave.altura_tiro <= obj.y + obj.imagem.height) || (nave.altura_tiro + nave.imagem_tiro.height <= obj.y + obj.imagem.height && nave.altura_tiro + nave.imagem_tiro.height >=  obj.y) ) ) {
                nave.tiro_acertou = true;
                obj.tiro_acertou = true;
            } 
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

    function verificar_teclas() {
        window.addEventListener('keydown', function (event) {
            if (event.code === 'Space') {
                nave.nave_pulando = true;
            }
        });

        window.addEventListener('keyup', function (event) {
            if (event.code === 'Space') {
                nave.nave_pulando = false;
            }
        });

        window.addEventListener('keydown', function (event) {
            if (event.key === 'k') {
                nave.pode_atirar = true;
            }
        });
        window.addEventListener('keyup', function (event) {
            if (event.key === 'k') {
                nave.pode_atirar = false;
            }
        });
    }

    function atualizar_todas_posicoes() {
        nave.atualizar_posicao();
        for (obj of objetos) {
            obj.atualizar_posicao();
        }
    }

    function rodar_jogo() {
        verificar_colisao();
        desenhar_fundo();
        desenhar_objetos();
        verificar_teclas();
        atualizar_todas_posicoes();
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
            this.in = 3; // impulso negativo
            this.nave_pulando = false;
            this.nave_atingida = false;
            this.pode_atirar = false;
            this.atirou = false;
            this.altura_tiro  = this.y + 20;
            this.pos_x_tiro = this.x + 85;
            this.vt = 5;
            this.tiro_acertou = false;
            this.imagem_tiro = new Image();
            this.imagem_tiro.src = src_tiro;
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

            if (this.pos_x_tiro > canvas.width) {
                this.atirou = false;
                this.tiro_acertou = false;
            }
        }

        atirar() {
            if (this.pode_atirar == true) {
                if (this.atirou == false) {
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
                this.tiro_acertou = false;
                this.altura_tiro  = this.y + 20;
                this.pos_x_tiro = this.x + 85;
                this.atirou = false;
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
        }
        
        desenhar() {
            ctx.drawImage(this.imagem, this.x, this.y);
        }
        
        atualizar_posicao() {
            this.x -= this.v;
            if ((this.x + this.imagem.width < -5) || (this.tiro_acertou == true)) {
                this.x = gerar_n_aleatorio(canvas.width, this.t*canvas.width);
                this.y = gerar_n_aleatorio(0, canvas.height-85+1);
                this.tiro_acertou = false;
            }
        }
    }
    
    let nave = new Nave(src_nave,x_inicial_nave,y_inicial_nave,impulso_nave);

    let meteoro1 = new Objeto(src_meteoro1,x_inicial_meteroro1,y_inicial_meteoro1,v_meteoro1, taxa_meteoro1);
    let meteoro3 = new Objeto(src_meteoro3,x_inicial_meteroro3,y_inicial_meteoro3,v_meteoro3,taxa_meteoro3);
    let satelite = new Objeto(src_satelite, x_inicial_satelite, y_inicial_satelite, v_satelite, taxa_satelite);
    let astronauta = new Objeto(src_astronauta, x_inicial_astronauta, y_inicial_astronauta, v_astronauta, taxa_astronauta);
    let meteoro2 = new Objeto(src_meteoro2, x_inicial_meteroro2, y_inicial_meteoro2, v_meteoro2, taxa_meteoro2);

    let objetos = [astronauta, satelite, meteoro3 ,meteoro1, meteoro2];

    imagemFundo.onload = nave.imagem.onload = objetos[0].imagem.onload = objetos[1].imagem.onload = objetos[2].imagem.onload = objetos[3].imagem.onload = objetos[4].imagem.onload = rodar_jogo;
}
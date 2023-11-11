export async function drawP5(imageUrl){
    let processedImageElement = function(p){
        console.log('p5.js is loaded');
        let myShader;
        let img;

        p.preload = function(){
            myShader = p.loadShader('src/shader/shader.vert', 'src/shader/shader.frag');
        }

        p.setup = function(){
            p.createCanvas(375, 375, p.WEBGL);
            img = p.loadImage(imageUrl);
            p.shader(myShader);
            myShader.setUniform('tex', img)
        }
        
        p.draw = function(){
            p.background(255,0,0);
            let frep = p.map(p.mouseX, 0, p.width, 0, 10.0);
            let amp = p.map(p.mouseY, 0, p.height, 0, 0.25);

            myShader.setUniform('frequency', frep);
            myShader.setUniform('amplitude', amp);
            myShader.setUniform('time', p.frameCount * 0.01);

            p.rect(0, 0, p.width, p.height)
        }
    }

    new p5(processedImageElement, 'processedTokenImage');
}
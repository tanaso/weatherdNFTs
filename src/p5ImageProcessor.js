export async function drawP5(imageUrl){
    let processedImageElement = function(p){
        console.log('p5.js is loaded');
        let myShader;
        let img;
        let graphics;

        p.preload = function(){
            img = p.loadImage(imageUrl);
            myShader = p.loadShader('src/shader/shader.vert', 'src/shader/shader.frag');
        }

        p.setup = function(){
            p.createCanvas(1, 1, p.WEBGL);
            graphics = p.createGraphics(img.width, img.height, p.WEBGL); // Create a graphics buffer with the same dimensions as the image
            graphics.shader(myShader);
            // p.shader(myShader);
            myShader.setUniform('u_texture', img);
            myShader.setUniform('u_resolution', [p.width, p.height]);
        }
        
        p.draw = function(){
            graphics.background(255);
            graphics.noStroke();
            graphics.smooth()
            graphics.rect(0, 0, img.width, img.height);

            let base64Image = graphics.canvas.toDataURL();
            document.getElementById('processedImage').src = base64Image;
        }
    }

    new p5(processedImageElement, 'processedTokenImage');
}
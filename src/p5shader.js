export async function processImage(imageUrl){
    let img;
    let myShader;
    let graphics;

    function preload() {
        console.log('p5.js is loaded');
        img = loadImage(imageUrl);
        myShader = loadShader('src/shader/shader.vert', 'src/shader/shader.frag');
    }

    function setup() {
        createCanvas(1, 1, WEBGL); // Create a dummy canvas
        graphics = createGraphics(img.width, img.height, WEBGL); // Create a graphics buffer with the same dimensions as the image
        noLoop();
    }

    function draw() {
        graphics.shader(myShader);
        myShader.setUniform('u_texture', img);
        myShader.setUniform('u_resolution', [graphics.width, graphics.height]);
        graphics.rect(0, 0, graphics.width, graphics.height);

        // Convert the graphics buffer to a base64 encoded image
        let base64Image = graphics.canvas.toDataURL();
        console.log(base64Image);

        // Set the src attribute of the HTML image element to the base64 image
        document.getElementById('processedImage').src = base64Image;
    }
}
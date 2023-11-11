export async function initWebGL(imageUrl) {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Function to load shader script
    function loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // Vertex and fragment shader GLSL source codes
    // Vertex shader source code
    const vsSource = `
        attribute vec4 a_Position;
        attribute vec2 a_TexCoord; // Add this line to declare the attribute for texture coordinates.
        varying vec2 v_TexCoord; // Declare the varying to pass to the fragment shader.
        
        void main() {
            gl_Position = a_Position;
            v_TexCoord = a_TexCoord; // Pass the texture coordinate to the fragment shader.
        }
    `;
    // Fragment shader source code
    const fsSource = `
        precision mediump float;
        uniform sampler2D u_Sampler;
        varying vec2 v_TexCoord; // This should match the varying from the vertex shader.
        
        void main() {
            vec4 texColor = texture2D(u_Sampler, v_TexCoord);
            // Example: simple inversion effect
            gl_FragColor = vec4(1.0 - texColor.rgb, texColor.a);
        }
    `;

    // Load and compile the shaders
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Link the shaders to create a program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Check for linking errors
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    // Use the program
    gl.useProgram(shaderProgram);

    // Set up the vertex positions here...
    // Set up the texture and pass it to the fragment shader here...

    // Draw the scene
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Additional code to set up the WebGL buffers, attributes, and draw the scene
    // Setup and bind texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Create a buffer for vertex positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
        -1.0,  1.0,
        -1.0, -1.0,
        1.0,  1.0,
        1.0, -1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Associate shader attributes with the corresponding data buffers
    const a_Position = gl.getAttribLocation(shaderProgram, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Load the image into the texture
    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // WebGL texture setup code here...
        // ...

        // Now that the image has loaded make sure the canvas is sized to match
        canvas.width = image.width;
        canvas.height = image.height;

        // Setup the vertex buffer, shaders, etc. here
        // ...

        // Draw the scene
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // After drawing, transfer the canvas image to an <img> element
        const processedImageElement = document.getElementById('processedTokenImage');
        processedImageElement.src = canvas.toDataURL();
    };
    image.crossOrigin = ''; // This is important for CORS if the image is not from the same origin
    image.src = imageUrl;
}

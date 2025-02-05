//Xiaohua Huo
//xhuo3@ucsc.edu
//Thank you!

class Ear{
    constructor(){
        this.type = "ear";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render(){
        var rgba = this.color;

        // pass color
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // pass matrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //left
        gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);
        drawTriangle3D( [0, 1, 0,   -0.5, 0, 0,   0, 0, 0.5] );
        
        //front
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        drawTriangle3D( [0, 1, 0,   -0.5, 0, 0,   0.5, 0, 0] );
        
        //right
        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        drawTriangle3D( [0, 1, 0,   0, 0, 0.5,   0.5, 0, 0] );

        //buttom
        gl.uniform4f(u_FragColor, rgba[0]*0.4, rgba[1]*0.4, rgba[2]*0.4, rgba[3]);
        drawTriangle3D( [0, 0, 0.5,   -0.5, 0, 0,   0.5, 0, 0] );
    }
}
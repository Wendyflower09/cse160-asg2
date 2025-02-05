//Xiaohua Huo
//xhuo3@ucsc.edu
//Thank you!

class Cube{
    constructor(){
        this.type = "cube";
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        // this.segments = 10;
        this.matrix = new Matrix4();
    }

    render(){
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        // pass color
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // pass matrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // top of cube
        drawTriangle3D( [0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0] );
        drawTriangle3D( [0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0] );

        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

        // front of cube
        drawTriangle3D( [0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0] );
        drawTriangle3D( [0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0] );

        gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);

        // left of cube
        drawTriangle3D( [0.0, 0.0, 0.0,   0.0, 0.0, 1.0,   0.0, 1.0, 0.0] );
        drawTriangle3D( [0.0, 0.0, 1.0,   0.0, 1.0, 1.0,   0.0, 1.0, 0.0] );

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        // right of cube
        drawTriangle3D( [1.0, 0.0, 0.0,   1.0, 0.0, 1.0,   1.0, 1.0, 1.0] );
        drawTriangle3D( [1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0] );

        gl.uniform4f(u_FragColor, rgba[0]*0.2, rgba[1]*0.2, rgba[2]*0.2, rgba[3]);

        // bottom of cube
        drawTriangle3D( [0.0, 0.0, 0.0,   0.0, 0.0, 1.0,   1.0, 0.0, 0.0] );
        drawTriangle3D( [0.0, 0.0, 1.0,   1.0, 0.0, 1.0,   1.0, 0.0, 0.0] );

        // back of cube
        drawTriangle3D( [0.0, 0.0, 1.0,   1.0, 0.0, 1.0,   0.0, 1.0, 1.0] );
        drawTriangle3D( [1.0, 0.0, 1.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0] );
    }
}
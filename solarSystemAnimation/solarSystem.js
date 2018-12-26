var canvas = document.getElementById("canvas");
        var gl = canvas.getContext("webgl");

        var viewAngleValue = 90;
        var zoomValue = 5;
        var speedFactor = 1;
        var drawElement = gl.TRIANGLES;
        var cameraControl = 0;
        function main(c) {

            if (!gl) {
                console.log("webgl context eroor!");
            }

            const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;

    uniform mat4 u_matrix;

    varying vec4 v_color;

    void main() {
        // Multiply the position by the matrix.
        gl_Position = u_matrix * a_position;

        // Pass the color to the fragment shader.
        v_color = a_color;
    }
`;
            const fragmentShaderSource = `
    precision mediump float;

    // Passed in from the vertex shader.
    varying vec4 v_color;

    uniform vec4 u_colorMult;

    void main() {
        gl_FragColor = v_color * u_colorMult;
    }
`;
            //eatrh vertice intilize
            var earthVertices = createSphereVertices(8, 24, 24);

            var earthArrays = makeRandomVertexColors(deindexVertices(earthVertices), {
                vertsPerColor: 6,
                rand: function (ndx, channel) {
                    return channel < 3 ? ((128 + Math.random() * 128) | 0) : 255;
                }
            });

            var earthSpherebuffer = {
                attribs: createAttribsFromArrays(gl, earthArrays, createMapping(earthArrays)),
            };

            var indices = earthArrays.indices;
            if (indices) {
                indeces = makeTypedArray(indices, "indices");
                earthSpherebuffer.indices = createBufferFromTypedArray(gl, indices, gl.ELEMENT_ARRAY_BUFFER);
                earthSpherebuffer.numElements = indices.length;
            } else {
                earthSpherebuffer.numElements = getNumElementsFromNonIndexedArrays(earthArrays);
            }
            //eath end

            //sun vertice initilize
            var sunVertices = createSphereVertices(20, 34, 34);

            var sunArrays = makeRandomVertexColors(deindexVertices(sunVertices), {
                vertsPerColor: 6,
                rand: function (ndx, channel) {
                    return channel < 3 ? ((128 + Math.random() * 70) | 0) : 255;
                }
            });

            var sunSpherebuffer = {
                attribs: createAttribsFromArrays(gl, sunArrays, createMapping(sunArrays)),
            };

            var sunindices = sunArrays.indices;
            if (sunindices) {
                sunindeces = makeTypedArray(sunindices, "indices");
                sunSpherebuffer.indices = createBufferFromTypedArray(gl, sunindices, gl.ELEMENT_ARRAY_BUFFER);
                sunSpherebuffer.numElements = sunindices.length;
            } else {
                sunSpherebuffer.numElements = getNumElementsFromNonIndexedArrays(sunArrays);
            }
            //sun vertice end

            //moon vertices begin
            var moonVertices = createSphereVertices(2, 8, 8);

            var moonArrays = makeRandomVertexColors(deindexVertices(moonVertices), {
                vertsPerColor: 6,
                rand: function (ndx, channel) {
                    return channel < 3 ? ((128 + Math.random() * 128) | 0) : 255;
                }
            });

            var moonSpherebuffer = {
                attribs: createAttribsFromArrays(gl, moonArrays, createMapping(moonArrays)),
            };

            var moonindices = moonArrays.indices;
            if (moonindices) {
                moonindeces = makeTypedArray(moonindices, "indices");
                moonSpherebuffer.indices = createBufferFromTypedArray(gl, moonnindices, gl.ELEMENT_ARRAY_BUFFER);
                moonSpherebuffer.numElements = moonindices.length;
            } else {
                moonSpherebuffer.numElements = getNumElementsFromNonIndexedArrays(moonArrays);
            }
            //moon vertices end

            programInfo = createProgramInfo(gl, [vertexShaderSource, fragmentShaderSource]);

            function createProgramInfo(
                gl, shaderSources) {
                shaderSources = shaderSources.map(function (source) {
                    return "" + source;
                });

                var program;
                //program shaders initialize
                var vertexShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vertexShader, shaderSources[0]);
                gl.compileShader(vertexShader);
                var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                var success = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
                if (!success) {
                    console.log("vertexshader error!");
                }
                var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fragmentShader, shaderSources[1]);
                gl.compileShader(fragmentShader);
                var success = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
                if (!success) {
                    console.log("fragmentshader error!");
                }

                //program linked to shaders
                var program = gl.createProgram();
                gl.attachShader(program, vertexShader);
                gl.attachShader(program, fragmentShader);
                gl.linkProgram(program);

                var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
                if (!linked) {
                    console.log("program link error");
                }

                if (!program) {
                    return null;
                }
                //uniform setters initialize
                var uniformSetters = {};
                var locationMatrix = gl.getUniformLocation(program, "u_matrix");
                var setterUM = function (value) {
                    gl.uniformMatrix4fv(locationMatrix, false, value);
                }

                var locationColor = gl.getUniformLocation(program, "u_colorMult");

                var setterUC = function (value) {
                    gl.uniform4fv(locationColor, value);
                }

                uniformSetters["u_matrix"] = setterUM;
                uniformSetters["u_colorMult"] = setterUC;
                //Attirib setters initialize
                var attribSetters = {};
                var attribPositionİndex = gl.getAttribLocation(program, "a_position");
                var setterAP = function (b) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                    gl.enableVertexAttribArray(attribPositionİndex);
                    gl.vertexAttribPointer(
                        attribPositionİndex, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
                }

                var attribColorİndex = gl.getAttribLocation(program, "a_color");
                var setterAC = function (b) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                    gl.enableVertexAttribArray(attribColorİndex);
                    gl.vertexAttribPointer(
                        attribColorİndex, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
                }
                var setterAP = function (b) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                    gl.enableVertexAttribArray(attribPositionİndex);
                    gl.vertexAttribPointer(
                        attribPositionİndex, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
                }

                var attribColorİndex = gl.getAttribLocation(program, "a_color");
                var setterAC = function (b) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                    gl.enableVertexAttribArray(attribColorİndex);
                    gl.vertexAttribPointer(
                        attribColorİndex, b.numComponents || b.size, b.type || gl.FLOAT, b.normalize || false, b.stride || 0, b.offset || 0);
                }

                attribSetters["a_position"] = setterAP;
                attribSetters["a_color"] = setterAC;
                return {
                    program: program,
                    uniformSetters: uniformSetters,
                    attribSetters: attribSetters,
                };
            }

            var cameraAngleRadians = degToRad(0);
            var fieldOfViewRadians = degToRad(60);
            var cameraHeight = 50;


            //earth            
            var sphereUniforms = {
                u_colorMult: [0.07, 0.49, 0.74, 1],
                u_matrix: matrixIdentity(),
            };

            //sun
            var sunSphereUniforms = {
                u_colorMult: [0.93, 0.21, 0.13, 1],
                u_matrix: matrixIdentity(),
            };

            //moon
            var moonSphereUniforms = {
                u_colorMult: [0.301, 0.401, 0.351, 1],
                u_matrix: matrixIdentity(),
            };

            //earth
            var sphereTranslation = [0, 0, 0];

            //sun
            var sunSphereTranslation = [0, 0, 0];

            //moon
            var moonSphereTranslation = [0, 0, 0];


            function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
                var matrix = matrixTranslate(viewProjectionMatrix,
                    translation[0],
                    translation[1],
                    translation[2]);
                return matrixYRotate(matrix, yRotation);
            }



            requestAnimationFrame(drawScene);

            var angle = 90;
            var anglemoon = 90;
            function drawScene(time) {
                time *= 0.005 * speedFactor;


                //resize canvas to display
                var width = canvas.clientWidth;
                var height = canvas.clientHeight;

                if (canvas.width !== width || canvas.height !== height) {
                    canvas.width = width;
                    canvas.height = height;
                }
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                gl.clearColor(0, 0, 0, 0);

                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.enable(gl.CULL_FACE);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
                var projectionMatrix =
                    matrixPerspective(fieldOfViewRadians, aspect, 1, 2000);
                 
                if(canvas.clientWidth<768 && cameraControl<1){
                    zoomValue = zoomValue*0.7;
                    cameraControl++;
                }
                else if(canvas.clientWidth>=768 && cameraControl>=1){
                    cameraControl=0;
                    zoomValue = zoomValue/0.7;
                }
                var cameraPosition = [0, viewAngleValue, 800 / zoomValue];
                var target = [0, 0, 0];
                var up = [0, 1, 0];
                var cameraMatrix = matrixLookAt(cameraPosition, target, up);

                var viewMatrix = matrixInverse(cameraMatrix);

                var viewProjectionMatrix = matrixMultiply(projectionMatrix, viewMatrix);
                //earth
                var sphereXRotation = time;
                var sphereYRotation = time;
                //sun
                var sunSphereXRotation = time * 0.1;
                var sunSphereYRotation = time * 0.1;
                //moon
                var moonSphereXRotation = time;
                var moonSphereYRotation = time;

                gl.useProgram(programInfo.program);

                //---earth--
                var setters = programInfo.attribSetters;
                Object.keys(earthSpherebuffer.attribs).forEach(function (name) {
                    var setter = setters[name];
                    if (setter) {
                        setter(earthSpherebuffer.attribs[name]);
                    }
                });
                var originX = 0;
                var originZ = 0;

                var x = originX + Math.cos(angle) * 70;
                var z = originZ + Math.sin(angle) * 70;
                angle = angle - 0.01 * speedFactor;
                sphereTranslation = [x, 0, z];
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, earthSpherebuffer.indeces);

                sphereUniforms.u_matrix = computeMatrix(
                    viewProjectionMatrix,
                    sphereTranslation,
                    sphereXRotation,
                    sphereYRotation);

                //set uniforms
                var setters = programInfo.uniformSetters;
                Object.keys(sphereUniforms).forEach(function (name) {
                    var setter = setters[name];
                    if (setter) {
                        setter(sphereUniforms[name]);
                    }
                });

                gl.drawArrays(drawElement, 0, earthSpherebuffer.numElements);

                //---sun---
                var setters = programInfo.attribSetters;
                Object.keys(sunSpherebuffer.attribs).forEach(function (name) {
                    var setter = setters[name];
                    if (setter) {
                        setter(sunSpherebuffer.attribs[name]);
                    }
                });
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sunSpherebuffer.indeces);

                sunSphereUniforms.u_matrix = computeMatrix(
                    viewProjectionMatrix,
                    sunSphereTranslation,
                    sunSphereXRotation,
                    sunSphereYRotation);

                //set uniforms
                var setters = programInfo.uniformSetters;
                Object.keys(sunSphereUniforms).forEach(function (name) {
                    var setter = setters[name];
                    if (setter) {
                        setter(sunSphereUniforms[name]);
                    }
                });

                gl.drawArrays(drawElement, 0, sunSpherebuffer.numElements);

                //--moon--
                var setters = programInfo.attribSetters;
                Object.keys(moonSpherebuffer.attribs).forEach(function (name) {
                    var setter = setters[name];
                    if (setter) {
                        setter(moonSpherebuffer.attribs[name]);
                    }
                });

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, moonSpherebuffer.indeces);

                var originX = 0;
                var originY = 0;

                var x1 = originX + Math.cos(anglemoon) * 9.2;
                var y = originY + Math.sin(anglemoon) * 9.2;
                var z = (x1) + Math.sin(angle) * 70;
                var x = (x1) + Math.cos(angle) * 70;
                anglemoon = anglemoon - 0.1 * speedFactor;
                moonTranslation = [x, y, z];
                if(angle<=0){
                    angle = 90;
                }
                if(anglemoon<=0){
                    anglemoon = 90;
                }


                moonSphereUniforms.u_matrix = computeMatrix(
                    viewProjectionMatrix,
                    moonTranslation,
                    moonSphereXRotation,
                    moonSphereYRotation);

                //set uniforms
                var setters = programInfo.uniformSetters;
                Object.keys(moonSphereUniforms).forEach(function (name) {
                    var setter = setters[name];
                    if (setter) {
                        setter(moonSphereUniforms[name]);
                    }
                });

                gl.drawArrays(drawElement, 0, moonSpherebuffer.numElements);

                requestAnimationFrame(drawScene);
            }
        }

        main();


        //------sphere vertices funcitons-------------
        function createSphereVertices(
            radius,
            subdivisionsAxis,
            subdivisionsHeight
        ) {

            opt_startLatitudeInRadians = 0;
            opt_endLatitudeInRadians = Math.PI;
            opt_startLongitudeInRadians = 0;
            opt_endLongitudeInRadians = (Math.PI * 2);

            const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
            const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

            const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
            const positions = createAugmentedTypedArray(3, numVertices);
            const normals = createAugmentedTypedArray(3, numVertices);
            const texcoords = createAugmentedTypedArray(2, numVertices);

            // Generate the individual vertices in our vertex buffer.
            for (let y = 0; y <= subdivisionsHeight; y++) {
                for (let x = 0; x <= subdivisionsAxis; x++) {
                    // Generate a vertex based on its spherical coordinates
                    const u = x / subdivisionsAxis;
                    const v = y / subdivisionsHeight;
                    const theta = longRange * u + opt_startLongitudeInRadians;
                    const phi = latRange * v + opt_startLatitudeInRadians;
                    const sinTheta = Math.sin(theta);
                    const cosTheta = Math.cos(theta);
                    const sinPhi = Math.sin(phi);
                    const cosPhi = Math.cos(phi);
                    const ux = cosTheta * sinPhi;
                    const uy = cosPhi;
                    const uz = sinTheta * sinPhi;
                    positions.push(radius * ux, radius * uy, radius * uz);
                    normals.push(ux, uy, uz);
                    texcoords.push(1 - u, v);
                }
            }

            const numVertsAround = subdivisionsAxis + 1;
            const indices = createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array);
            for (let x = 0; x < subdivisionsAxis; x++) {
                for (let y = 0; y < subdivisionsHeight; y++) {
                    // Make triangle 1 of quad.
                    indices.push(
                        (y + 0) * numVertsAround + x,
                        (y + 0) * numVertsAround + x + 1,
                        (y + 1) * numVertsAround + x);

                    // Make triangle 2 of quad.
                    indices.push(
                        (y + 1) * numVertsAround + x,
                        (y + 0) * numVertsAround + x + 1,
                        (y + 1) * numVertsAround + x + 1);
                }
            }

            return {
                position: positions,
                normal: normals,
                texcoord: texcoords,
                indices: indices,
            };
        }

        function augmentTypedArray(typedArray, numComponents) {
            let cursor = 0;
            typedArray.push = function () {
                for (let ii = 0; ii < arguments.length; ++ii) {
                    const value = arguments[ii];
                    if (value instanceof Array) {
                        for (let jj = 0; jj < value.length; ++jj) {
                            typedArray[cursor++] = value[jj];
                        }
                    } else {
                        typedArray[cursor++] = value;
                    }
                }
            };
            typedArray.reset = function (opt_index) {
                cursor = opt_index || 0;
            };
            typedArray.numComponents = numComponents;
            Object.defineProperty(typedArray, 'numElements', {
                get: function () {
                    return this.length / this.numComponents | 0;
                },
            });
            return typedArray;
        }

        function createAugmentedTypedArray(numComponents, numElements, opt_type) {
            const Type = opt_type || Float32Array;
            return augmentTypedArray(new Type(numComponents * numElements), numComponents);
        }


        //attiribfromarrays
        function createAttribsFromArrays(gl, arrays, opt_mapping) {
            var mapping = createMapping(arrays);
            var attribs = {};
            Object.keys(mapping).forEach(function (attribName) {
                var bufferName = mapping[attribName];
                var array = makeTypedArray(arrays[bufferName], bufferName);
                attribs[attribName] = {
                    buffer: createBufferFromTypedArray(gl, array),
                    numComponents: array.numComponents,
                    type: getGLTypeForTypedArray(gl, array),
                    normalize: getNormalizationForTypedArray(array),
                };
            });
            return attribs;
        }
        function allButIndices(name) {
            return name !== "indices";
        }
        function createMapping(obj) {
            var mapping = {};
            Object.keys(obj).filter(allButIndices).forEach(function (key) {
                mapping["a_" + key] = key;
            });
            return mapping;
        }
        function makeTypedArray(array, name) {
            if (isArrayBuffer(array)) {
                return array;
            }

            if (Array.isArray(array)) {
                array = {
                    data: array,
                };
            }

            if (!array.numComponents) {
                array.numComponents = guessNumComponentsFromName(name, array.length);
            }

            var type = array.type;
            if (!type) {
                if (name === "indices") {
                    type = Uint16Array;
                }
            }
            var typedArray = createAugmentedTypedArray(array.numComponents, array.data.length / array.numComponents | 0, type);
            typedArray.push(array.data);
            return typedArray;
        }
        function getGLTypeForTypedArray(gl, typedArray) {
            if (typedArray instanceof Int8Array) { return gl.BYTE; }
            if (typedArray instanceof Uint8Array) { return gl.UNSIGNED_BYTE; }
            if (typedArray instanceof Int16Array) { return gl.SHORT; }
            if (typedArray instanceof Uint16Array) { return gl.UNSIGNED_SHORT; }
            if (typedArray instanceof Int32Array) { return gl.INT; }
            if (typedArray instanceof Uint32Array) { return gl.UNSIGNED_INT; }
            if (typedArray instanceof Float32Array) { return gl.FLOAT; }
        }

        function getNormalizationForTypedArray(typedArray) {
            if (typedArray instanceof Int8Array) { return true; }
            if (typedArray instanceof Uint8Array) { return true; }
            return false;
        }

        function isArrayBuffer(a) {
            return a.buffer && a.buffer instanceof ArrayBuffer;
        }

        function createBufferFromTypedArray(gl, array, type, drawType) {
            type = type || gl.ARRAY_BUFFER;
            var buffer = gl.createBuffer();
            gl.bindBuffer(type, buffer);
            gl.bufferData(type, array, drawType || gl.STATIC_DRAW);
            return buffer;
        }

        function makeRandomVertexColors(vertices, options) {
            options = options || {};
            var numElements = vertices.position.numElements;
            var vcolors = createAugmentedTypedArray(4, numElements, Uint8Array);
            var ii;
            var rand = options.rand || function (ndx, channel) {
                return channel < 3 ? randInt(256) : 255;
            };
            vertices.color = vcolors;
            if (vertices.indices) {
                // just make random colors if index
                for (ii = 0; ii < numElements; ++ii) {
                    vcolors.push(rand(ii, 0), rand(ii, 1), rand(ii, 2), rand(ii, 3));
                }
            } else {
                // make random colors per triangle
                var numVertsPerColor = options.vertsPerColor || 3;
                var numSets = numElements / numVertsPerColor;
                for (ii = 0; ii < numSets; ++ii) {
                    var color = [rand(ii, 0), rand(ii, 1), rand(ii, 2), rand(ii, 3)];
                    for (var jj = 0; jj < numVertsPerColor; ++jj) {
                        vcolors.push(color);
                    }
                }
            }
            return vertices;
        }
        function randInt(range) {
            return Math.random() * range | 0;
        }

        function deindexVertices(vertices) {
            var indices = vertices.indices;
            var newVertices = {};
            var numElements = indices.length;

            function expandToUnindexed(channel) {
                var srcBuffer = vertices[channel];
                var numComponents = srcBuffer.numComponents;
                var array16Buffer = createAugmentedTypedArray(numComponents, numElements, srcBuffer.constructor);
                for (var ii = 0; ii < numElements; ++ii) {
                    var ndx = indices[ii];
                    var offset = ndx * numComponents;
                    for (var jj = 0; jj < numComponents; ++jj) {
                        array16Buffer.push(srcBuffer[offset + jj]);
                    }
                }
                newVertices[channel] = array16Buffer;
            }

            Object.keys(vertices).filter(allButIndices).forEach(expandToUnindexed);

            return newVertices;
        }

        function degToRad(d) {
            return d * Math.PI / 180;
        }

        function getBindPointForSamplerType(gl, type) {
            if (type === gl.SAMPLER_2D) return gl.TEXTURE_2D;
            if (type === gl.SAMPLER_CUBE) return gl.TEXTURE_CUBE_MAP;
            return undefined;
        }

        function getNumElementsFromNonIndexedArrays(arrays) {
            var key = Object.keys(arrays)[0];
            var array = arrays[key];
            if (isArrayBuffer(array)) {
                return array.numElements;
            } else {
                return array.data.length / array.numComponents;
            }
        }
        //input functions

        function zoomRangeChanged(value) {
            zoomValue = value/10;
        }

        function viewAngleChanged(value) {
            viewAngleValue = value;
        }

        function speedRangeChanged(value) {
            speedFactor = value/10;
        }
        function lineModeChanged() {
            if (drawElement === gl.TRIANGLES) {
                drawElement = gl.LINES;
            }
            else {
                drawElement = gl.TRIANGLES;
            }
        }

        //matrix and math functions
        function matrixIdentity() {
            var array16 = new Float32Array(16);

            array16[0] = 1;
            array16[1] = 0;
            array16[2] = 0;
            array16[3] = 0;
            array16[4] = 0;
            array16[5] = 1;
            array16[6] = 0;
            array16[7] = 0;
            array16[8] = 0;
            array16[9] = 0;
            array16[10] = 1;
            array16[11] = 0;
            array16[12] = 0;
            array16[13] = 0;
            array16[14] = 0;
            array16[15] = 1;

            return array16;
        }

        function matrixTranslate(m, tx, ty, tz, array16) {
            var array16 = new Float32Array(16);

            var m00 = m[0];
            var m01 = m[1];
            var m02 = m[2];
            var m03 = m[3];
            var m10 = m[1 * 4 + 0];
            var m11 = m[1 * 4 + 1];
            var m12 = m[1 * 4 + 2];
            var m13 = m[1 * 4 + 3];
            var m20 = m[2 * 4 + 0];
            var m21 = m[2 * 4 + 1];
            var m22 = m[2 * 4 + 2];
            var m23 = m[2 * 4 + 3];
            var m30 = m[3 * 4 + 0];
            var m31 = m[3 * 4 + 1];
            var m32 = m[3 * 4 + 2];
            var m33 = m[3 * 4 + 3];

            if (m !== array16) {
                array16[0] = m00;
                array16[1] = m01;
                array16[2] = m02;
                array16[3] = m03;
                array16[4] = m10;
                array16[5] = m11;
                array16[6] = m12;
                array16[7] = m13;
                array16[8] = m20;
                array16[9] = m21;
                array16[10] = m22;
                array16[11] = m23;
            }

            array16[12] = m00 * tx + m10 * ty + m20 * tz + m30;
            array16[13] = m01 * tx + m11 * ty + m21 * tz + m31;
            array16[14] = m02 * tx + m12 * ty + m22 * tz + m32;
            array16[15] = m03 * tx + m13 * ty + m23 * tz + m33;

            return array16;
        }
        function matrixYRotate(m, angleInRadians, array16) {
            var array16 = new Float32Array(16);

            var m00 = m[0 * 4 + 0];
            var m01 = m[0 * 4 + 1];
            var m02 = m[0 * 4 + 2];
            var m03 = m[0 * 4 + 3];
            var m20 = m[2 * 4 + 0];
            var m21 = m[2 * 4 + 1];
            var m22 = m[2 * 4 + 2];
            var m23 = m[2 * 4 + 3];
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);

            array16[0] = c * m00 - s * m20;
            array16[1] = c * m01 - s * m21;
            array16[2] = c * m02 - s * m22;
            array16[3] = c * m03 - s * m23;
            array16[8] = c * m20 + s * m00;
            array16[9] = c * m21 + s * m01;
            array16[10] = c * m22 + s * m02;
            array16[11] = c * m23 + s * m03;

            if (m !== array16) {
                array16[4] = m[4];
                array16[5] = m[5];
                array16[6] = m[6];
                array16[7] = m[7];
                array16[12] = m[12];
                array16[13] = m[13];
                array16[14] = m[14];
                array16[15] = m[15];
            }

            return array16;
        }
        function matrixPerspective(fieldOfViewInRadians, aspect, near, far) {
            var array16 = new Float32Array(16);
            var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
            var rangeInv = 1.0 / (near - far);

            array16[0] = f / aspect;
            array16[1] = 0;
            array16[2] = 0;
            array16[3] = 0;
            array16[4] = 0;
            array16[5] = f;
            array16[6] = 0;
            array16[7] = 0;
            array16[8] = 0;
            array16[9] = 0;
            array16[10] = (near + far) * rangeInv;
            array16[11] = -1;
            array16[12] = 0;
            array16[13] = 0;
            array16[14] = near * far * rangeInv * 2;
            array16[15] = 0;

            return array16;
        }

        function matrixLookAt(cameraPosition, target, up) {
            var array16 = new Float32Array(16);
            var zAxis = normalize(
                subtractVectors(cameraPosition, target));
            var xAxis = normalize(cross(up, zAxis));
            var yAxis = normalize(cross(zAxis, xAxis));

            array16[0] = xAxis[0];
            array16[1] = xAxis[1];
            array16[2] = xAxis[2];
            array16[3] = 0;
            array16[4] = yAxis[0];
            array16[5] = yAxis[1];
            array16[6] = yAxis[2];
            array16[7] = 0;
            array16[8] = zAxis[0];
            array16[9] = zAxis[1];
            array16[10] = zAxis[2];
            array16[11] = 0;
            array16[12] = cameraPosition[0];
            array16[13] = cameraPosition[1];
            array16[14] = cameraPosition[2];
            array16[15] = 1;

            return array16;
        }
        function normalize(v) {
            var array16 = new Float32Array(3);
            var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            // make sure we don't divide by 0.
            if (length > 0.00001) {
                array16[0] = v[0] / length;
                array16[1] = v[1] / length;
                array16[2] = v[2] / length;
            }
            return array16;
        }
        function subtractVectors(a, b) {
            var array16 = new Float32Array(3);
            array16[0] = a[0] - b[0];
            array16[1] = a[1] - b[1];
            array16[2] = a[2] - b[2];
            return array16;
        }

        function cross(a, b, array16) {
            var array16 = new Float32Array(3);
            array16[0] = a[1] * b[2] - a[2] * b[1];
            array16[1] = a[2] * b[0] - a[0] * b[2];
            array16[2] = a[0] * b[1] - a[1] * b[0];
            return array16;
        }

        function matrixInverse(m) {
            var array16 = new Float32Array(16);
            var m00 = m[0 * 4 + 0];
            var m01 = m[0 * 4 + 1];
            var m02 = m[0 * 4 + 2];
            var m03 = m[0 * 4 + 3];
            var m10 = m[1 * 4 + 0];
            var m11 = m[1 * 4 + 1];
            var m12 = m[1 * 4 + 2];
            var m13 = m[1 * 4 + 3];
            var m20 = m[2 * 4 + 0];
            var m21 = m[2 * 4 + 1];
            var m22 = m[2 * 4 + 2];
            var m23 = m[2 * 4 + 3];
            var m30 = m[3 * 4 + 0];
            var m31 = m[3 * 4 + 1];
            var m32 = m[3 * 4 + 2];
            var m33 = m[3 * 4 + 3];
            var tmp_0 = m22 * m33;
            var tmp_1 = m32 * m23;
            var tmp_2 = m12 * m33;
            var tmp_3 = m32 * m13;
            var tmp_4 = m12 * m23;
            var tmp_5 = m22 * m13;
            var tmp_6 = m02 * m33;
            var tmp_7 = m32 * m03;
            var tmp_8 = m02 * m23;
            var tmp_9 = m22 * m03;
            var tmp_10 = m02 * m13;
            var tmp_11 = m12 * m03;
            var tmp_12 = m20 * m31;
            var tmp_13 = m30 * m21;
            var tmp_14 = m10 * m31;
            var tmp_15 = m30 * m11;
            var tmp_16 = m10 * m21;
            var tmp_17 = m20 * m11;
            var tmp_18 = m00 * m31;
            var tmp_19 = m30 * m01;
            var tmp_20 = m00 * m21;
            var tmp_21 = m20 * m01;
            var tmp_22 = m00 * m11;
            var tmp_23 = m10 * m01;

            var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
                (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
            var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
                (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
            var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
                (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
            var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
                (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

            var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

            array16[0] = d * t0;
            array16[1] = d * t1;
            array16[2] = d * t2;
            array16[3] = d * t3;
            array16[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
            array16[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
            array16[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
            array16[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
            array16[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
            array16[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
            array16[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
            array16[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
            array16[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
            array16[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
            array16[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
            array16[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

            return array16;
        }
        function matrixMultiply(a, b) {
            var array16 = new Float32Array(16);
            var b00 = b[0 * 4 + 0];
            var b01 = b[0 * 4 + 1];
            var b02 = b[0 * 4 + 2];
            var b03 = b[0 * 4 + 3];
            var b10 = b[1 * 4 + 0];
            var b11 = b[1 * 4 + 1];
            var b12 = b[1 * 4 + 2];
            var b13 = b[1 * 4 + 3];
            var b20 = b[2 * 4 + 0];
            var b21 = b[2 * 4 + 1];
            var b22 = b[2 * 4 + 2];
            var b23 = b[2 * 4 + 3];
            var b30 = b[3 * 4 + 0];
            var b31 = b[3 * 4 + 1];
            var b32 = b[3 * 4 + 2];
            var b33 = b[3 * 4 + 3];
            var a00 = a[0 * 4 + 0];
            var a01 = a[0 * 4 + 1];
            var a02 = a[0 * 4 + 2];
            var a03 = a[0 * 4 + 3];
            var a10 = a[1 * 4 + 0];
            var a11 = a[1 * 4 + 1];
            var a12 = a[1 * 4 + 2];
            var a13 = a[1 * 4 + 3];
            var a20 = a[2 * 4 + 0];
            var a21 = a[2 * 4 + 1];
            var a22 = a[2 * 4 + 2];
            var a23 = a[2 * 4 + 3];
            var a30 = a[3 * 4 + 0];
            var a31 = a[3 * 4 + 1];
            var a32 = a[3 * 4 + 2];
            var a33 = a[3 * 4 + 3];
            array16[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
            array16[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
            array16[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
            array16[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
            array16[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
            array16[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
            array16[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
            array16[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
            array16[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
            array16[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
            array16[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
            array16[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
            array16[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
            array16[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
            array16[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
            array16[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
            return array16;
        }
